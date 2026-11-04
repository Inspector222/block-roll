import { Networks } from "@stellar/stellar-sdk";

export type StellarNetworkName = "testnet" | "mainnet";

export const STELLAR_NETWORK: StellarNetworkName =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === "mainnet" ? "mainnet" : "testnet";

export const STELLAR_NETWORK_PASSPHRASE =
  STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

export const STELLAR_HORIZON_URL =
  STELLAR_NETWORK === "mainnet"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

// Circle's official USDC issuer accounts on Stellar.
// Source: https://developers.circle.com/stablecoins/quickstarts/transfer-usdc-stellar
// Re-verify against that page before switching STELLAR_NETWORK to "mainnet".
const USDC_ISSUER_TESTNET =
  process.env.NEXT_PUBLIC_STELLAR_USDC_ISSUER_TESTNET ??
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
const USDC_ISSUER_MAINNET = process.env.NEXT_PUBLIC_STELLAR_USDC_ISSUER_MAINNET ?? "";

export const STELLAR_USDC_ISSUER =
  STELLAR_NETWORK === "mainnet" ? USDC_ISSUER_MAINNET : USDC_ISSUER_TESTNET;

// BlockRoll's own Stellar address that receives Premium payments.
// It must already hold a USDC trustline, otherwise payments fail with `op_no_trust`.
export const STELLAR_TREASURY_ADDRESS = process.env.NEXT_PUBLIC_STELLAR_TREASURY_ADDRESS ?? "";

export const PREMIUM_PRICE_USDC = process.env.NEXT_PUBLIC_STELLAR_PREMIUM_PRICE_USDC ?? "99";
