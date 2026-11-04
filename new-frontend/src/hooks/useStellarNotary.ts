import { useCallback, useState } from "react";
import { sha256File } from "@/lib/stellar/hash";
import { notarizeHash, verifyNotarization, type NotarizeResult, type VerifyResult } from "@/lib/stellar/notary";
import { StellarError } from "@/lib/stellar/errors";

type Status = "idle" | "working" | "success" | "error";

export const useStellarNotary = () => {
  const [notarizeStatus, setNotarizeStatus] = useState<Status>("idle");
  const [notarizeError, setNotarizeError] = useState<string | null>(null);
  const [notarizeResult, setNotarizeResult] = useState<NotarizeResult | null>(null);

  const [verifyStatus, setVerifyStatus] = useState<Status>("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);

  const notarize = useCallback(async (file: File) => {
    setNotarizeStatus("working");
    setNotarizeError(null);
    try {
      const hashBytes = await sha256File(file);
      const result = await notarizeHash(hashBytes);
      setNotarizeResult(result);
      setNotarizeStatus("success");
    } catch (err) {
      setNotarizeError(err instanceof StellarError ? err.message : "Something went wrong. Please try again.");
      setNotarizeStatus("error");
    }
  }, []);

  const verify = useCallback(async (file: File, txHash: string) => {
    setVerifyStatus("working");
    setVerifyError(null);
    try {
      const hashBytes = await sha256File(file);
      const result = await verifyNotarization(hashBytes, txHash.trim());
      setVerifyResult(result);
      setVerifyStatus("success");
    } catch (err) {
      setVerifyError(err instanceof StellarError ? err.message : "Something went wrong. Please try again.");
      setVerifyStatus("error");
    }
  }, []);

  return {
    notarize,
    notarizeStatus,
    notarizeError,
    notarizeResult,
    isNotarizing: notarizeStatus === "working",
    verify,
    verifyStatus,
    verifyError,
    verifyResult,
    isVerifying: verifyStatus === "working",
  };
};
