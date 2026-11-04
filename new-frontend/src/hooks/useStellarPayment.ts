import { useCallback, useState } from "react";
import { payPremiumWithUsdc } from "@/lib/stellar/payment";
import { StellarError } from "@/lib/stellar/errors";

type Status = "idle" | "connecting" | "success" | "error";

export const useStellarPayment = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const pay = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    try {
      const result = await payPremiumWithUsdc();
      setTxHash(result.hash);
      setStatus("success");
      return result;
    } catch (err) {
      setError(err instanceof StellarError ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
      return null;
    }
  }, []);

  return { pay, status, error, txHash, isPaying: status === "connecting" };
};
