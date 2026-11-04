import { Asset, BASE_FEE, Horizon, Operation, TransactionBuilder } from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";
import { StellarError } from "./errors";
import { connectFreighter } from "./wallet";
import {
  PREMIUM_PRICE_USDC,
  STELLAR_HORIZON_URL,
  STELLAR_NETWORK_PASSPHRASE,
  STELLAR_TREASURY_ADDRESS,
  STELLAR_USDC_ISSUER,
} from "./config";

export class StellarPaymentError extends StellarError {}

const horizon = new Horizon.Server(STELLAR_HORIZON_URL);

export interface StellarPaymentResult {
  hash: string;
  payerAddress: string;
}

export async function payPremiumWithUsdc(): Promise<StellarPaymentResult> {
  if (!STELLAR_TREASURY_ADDRESS || !STELLAR_USDC_ISSUER) {
    throw new StellarPaymentError("Stellar payments aren't configured yet.");
  }

  const payerAddress = await connectFreighter();
  const account = await horizon.loadAccount(payerAddress);
  const usdc = new Asset("USDC", STELLAR_USDC_ISSUER);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: STELLAR_TREASURY_ADDRESS,
        asset: usdc,
        amount: PREMIUM_PRICE_USDC,
      })
    )
    .setTimeout(180)
    .build();

  const { signedTxXdr, error: signError } = await signTransaction(transaction.toXDR(), {
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    address: payerAddress,
  });
  if (signError || !signedTxXdr) {
    throw new StellarPaymentError(signError?.message ?? "Payment was not signed.");
  }

  const signedTransaction = TransactionBuilder.fromXDR(signedTxXdr, STELLAR_NETWORK_PASSPHRASE);

  try {
    const response = await horizon.submitTransaction(signedTransaction);
    return { hash: response.hash, payerAddress };
  } catch (err: any) {
    const resultCodes = err?.response?.data?.extras?.result_codes;
    if (resultCodes?.operations?.includes("op_no_trust")) {
      throw new StellarPaymentError(
        "Payment failed: BlockRoll's wallet doesn't have a USDC trustline set up yet."
      );
    }
    if (resultCodes?.operations?.includes("op_underfunded")) {
      throw new StellarPaymentError("Payment failed: your wallet doesn't have enough USDC.");
    }
    throw new StellarPaymentError("Payment was rejected by the Stellar network.");
  }
}
