"use client";

import { useRef, useState } from "react";
import { Check, FileCheck2, Loader2, ShieldCheck, Upload, X } from "lucide-react";
import Header from "@/components/ui/header";
import Footer from "@/components/landing-sections/footer";
import PrimaryButton from "@/components/ui/custom-button";
import { useStellarNotary } from "@/hooks/useStellarNotary";
import { STELLAR_NETWORK } from "@/lib/stellar/config";

const explorerUrl = (txHash: string) =>
  `https://stellar.expert/explorer/${STELLAR_NETWORK === "mainnet" ? "public" : "testnet"}/tx/${txHash}`;

const FilePicker = ({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-between gap-3 border border-dashed border-[#252525] rounded-xl px-4 py-3 text-left hover:border-[#a472ea]/60 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm text-[#e1e1e1] truncate">
          <Upload className="size-4 flex-shrink-0 text-[#a472ea]" />
          {file ? file.name : "Choose a file"}
        </span>
        {file && (
          <X
            className="size-4 flex-shrink-0 text-[#b1b1b1] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          />
        )}
      </button>
    </div>
  );
};

const NotarizeCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const { notarize, isNotarizing, notarizeError, notarizeResult } = useStellarNotary();

  return (
    <div className="flex flex-col gap-4 w-full flex-1 p-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#a472ea]/10 flex items-center justify-center">
          <ShieldCheck className="size-5 text-[#a472ea]" />
        </div>
        <h3 className="text-xl font-medium">Notarize a file</h3>
      </div>
      <p className="text-sm text-[#b1b1b1]">
        We hash your file in your browser - the file itself never leaves your device - and anchor
        that hash on Stellar with your wallet. Anyone can later prove the file existed, unmodified,
        at that point in time.
      </p>
      <FilePicker file={file} onChange={setFile} />
      <PrimaryButton
        classname="w-full"
        disabled={!file || isNotarizing}
        onClick={() => file && notarize(file)}
      >
        {isNotarizing ? <Loader2 className="animate-spin" /> : <FileCheck2 />}
        {isNotarizing ? "Confirm in Freighter..." : "Notarize on Stellar"}
      </PrimaryButton>
      {notarizeError && <p className="text-sm text-red-400">{notarizeError}</p>}
      {notarizeResult && (
        <div className="flex flex-col gap-1 text-sm border-t border-[#252525] pt-4">
          <p className="flex items-center gap-2 text-green-400">
            <Check className="size-4" /> Notarized on Stellar
          </p>
          <p className="text-[#b1b1b1] font-mono text-xs break-all">
            SHA-256: {notarizeResult.hashHex}
          </p>
          <a
            href={explorerUrl(notarizeResult.txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#a472ea] hover:underline font-mono text-xs break-all"
          >
            {notarizeResult.txHash}
          </a>
        </div>
      )}
    </div>
  );
};

const VerifyCard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState("");
  const { verify, isVerifying, verifyError, verifyResult } = useStellarNotary();

  return (
    <div className="flex flex-col gap-4 w-full flex-1 p-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-[#a472ea]/10 flex items-center justify-center">
          <FileCheck2 className="size-5 text-[#a472ea]" />
        </div>
        <h3 className="text-xl font-medium">Verify a notarization</h3>
      </div>
      <p className="text-sm text-[#b1b1b1]">
        Pick the same file and paste the Stellar transaction hash you got when it was notarized.
        We&apos;ll re-hash it locally and compare it against what&apos;s on-chain.
      </p>
      <FilePicker file={file} onChange={setFile} />
      <input
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        placeholder="Stellar transaction hash"
        className="w-full bg-transparent border border-[#252525] rounded-xl px-4 py-3 text-sm font-mono placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#a472ea]/60"
      />
      <PrimaryButton
        classname="w-full"
        disabled={!file || !txHash.trim() || isVerifying}
        onClick={() => file && verify(file, txHash)}
      >
        {isVerifying ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
        {isVerifying ? "Verifying..." : "Verify"}
      </PrimaryButton>
      {verifyError && <p className="text-sm text-red-400">{verifyError}</p>}
      {verifyResult && (
        <div className="flex flex-col gap-1 text-sm border-t border-[#252525] pt-4">
          {verifyResult.matches ? (
            <p className="flex items-center gap-2 text-green-400">
              <Check className="size-4" /> Match - this file is unmodified since {verifyResult.closeTime}
            </p>
          ) : (
            <p className="flex items-center gap-2 text-red-400">
              <X className="size-4" /> This file does not match what was notarized
            </p>
          )}
          <p className="text-[#b1b1b1] font-mono text-xs break-all">
            On-chain: {verifyResult.onChainHashHex}
          </p>
          <p className="text-[#b1b1b1] font-mono text-xs break-all">
            Local: {verifyResult.localHashHex}
          </p>
        </div>
      )}
    </div>
  );
};

const Notary = () => {
  return (
    <>
      <main className="w-full overflow-hidden flex flex-col items-center justify-center relative">
        <Header title="Stellar File Notary" />
        <div className="flex flex-col bg-[#151515]/20 backdrop-blur-xl relative w-full">
          <div className="text-center py-6 px-4 border-b border-[#252525] text-sm text-[#b1b1b1] max-w-2xl mx-auto">
            A free, standalone way to prove a file existed at a point in time - built on Stellar,
            requires the{" "}
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#a472ea] hover:underline"
            >
              Freighter wallet
            </a>
            . Currently running on Stellar {STELLAR_NETWORK}.
          </div>
          <ul className="flex flex-col lg:flex-row [&>li]:w-full divide-y lg:divide-y-0 lg:divide-x divide-[#252525]">
            <li>
              <NotarizeCard />
            </li>
            <li>
              <VerifyCard />
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Notary;
