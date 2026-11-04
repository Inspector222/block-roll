import { BASE_FEE, Horizon, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { StellarError } from "./errors";
import { connectFreighter } from "./wallet";
import { STELLAR_HORIZON_URL, STELLAR_NETWORK_PASSPHRASE } from "./config";
import { base64ToHex, bytesToHex } from "./hash";

export class StellarNotaryError extends StellarError {}

const horizon = new Horizon.Server(STELLAR_HORIZON_URL);

// The Stellar account data entry key BlockRoll notarizations are recorded under.
// The proof is the transaction itself (permanent in Stellar's history), not this entry -
// it just gets overwritten by each new notarization from the same account.
const NOTARY_DATA_KEY = "blockroll_notary";

export interface NotarizeResult {
  hashHex: string;
  txHash: string;
  payerAddress: string;
}

export async function notarizeHash(hashBytes: Uint8Array): Promise<NotarizeResult> {
  const payerAddress = await connectFreighter();
  const account = await horizon.loadAccount(payerAddress);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.manageData({ name: NOTARY_DATA_KEY, value: hashBytes }))
    .setTimeout(180)
    .build();

  const { signedTxXdr, error: signError } = await signTransaction(transaction.toXDR(), {
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    address: payerAddress,
  });
  if (signError || !signedTxXdr) {
    throw new StellarNotaryError(signError?.message ?? "Notarization was not signed.");
  }

  const signedTransaction = TransactionBuilder.fromXDR(signedTxXdr, STELLAR_NETWORK_PASSPHRASE);

  try {
    const response = await horizon.submitTransaction(signedTransaction);
    return { hashHex: bytesToHex(hashBytes), txHash: response.hash, payerAddress };
  } catch {
    throw new StellarNotaryError("The notarization transaction was rejected by the Stellar network.");
  }
}

export interface VerifyResult {
  matches: boolean;
  onChainHashHex: string;
  localHashHex: string;
  closeTime: string;
}

export async function verifyNotarization(hashBytes: Uint8Array, txHash: string): Promise<VerifyResult> {
  const localHashHex = bytesToHex(hashBytes);

  const transaction = await horizon
    .transactions()
    .transaction(txHash)
    .call()
    .catch(() => {
      throw new StellarNotaryError("Couldn't find that transaction on Stellar.");
    });

  const operations = await horizon.operations().forTransaction(txHash).call();
  const manageDataOp = operations.records.find(
    (op) => op.type === "manage_data" && (op as any).name === NOTARY_DATA_KEY
  ) as { value?: string } | undefined;

  if (!manageDataOp?.value) {
    throw new StellarNotaryError("That transaction doesn't contain a BlockRoll notarization.");
  }

  const onChainHashHex = base64ToHex(manageDataOp.value);

  return {
    matches: onChainHashHex === localHashHex,
    onChainHashHex,
    localHashHex,
    closeTime: transaction.created_at,
  };
}
