import { getNetwork, isConnected, requestAccess } from "@stellar/freighter-api";
import { StellarError } from "./errors";
import { STELLAR_NETWORK_PASSPHRASE } from "./config";

export class StellarWalletError extends StellarError {}

export async function connectFreighter(): Promise<string> {
  const { isConnected: connected, error: connectionError } = await isConnected();
  if (connectionError || !connected) {
    throw new StellarWalletError(
      "Freighter wallet not found. Install the Freighter browser extension to continue."
    );
  }

  const { address, error: accessError } = await requestAccess();
  if (accessError || !address) {
    throw new StellarWalletError(accessError?.message ?? "Could not get your address from Freighter.");
  }

  const { networkPassphrase, error: networkError } = await getNetwork();
  if (networkError || networkPassphrase !== STELLAR_NETWORK_PASSPHRASE) {
    throw new StellarWalletError("Switch Freighter to the matching Stellar network and try again.");
  }

  return address;
}
