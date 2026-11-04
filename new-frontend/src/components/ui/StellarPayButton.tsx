"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import PrimaryButton from "@/components/ui/custom-button";
import { useStellarPayment } from "@/hooks/useStellarPayment";

const StellarIcon = () => (
  <svg viewBox="0 0 32 32" className="size-5" fill="currentColor" aria-hidden>
    <path d="M16 0a16 16 0 1 0 16 16A16 16 0 0 0 16 0ZM8.1 11.3 23.9 9l-4 2.3-11.7 6.7-2.4 1.4a7.5 7.5 0 0 1 2.3-8.1Zm15.8 9.4L8.1 23l4-2.3 11.7-6.7 2.4-1.4a7.5 7.5 0 0 1-2.3 8.1Z" />
  </svg>
);

const StellarPayButton = ({ classname }: { classname?: string }) => {
  const router = useRouter();
  const { pay, isPaying, error } = useStellarPayment();

  const handleClick = async () => {
    const result = await pay();
    if (result) {
      router.push(`/checkout?tx=${result.hash}`);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <PrimaryButton classname={classname} onClick={handleClick} disabled={isPaying}>
        {isPaying ? <Loader2 className="animate-spin" /> : <StellarIcon />}
        {isPaying ? "Confirm in Freighter..." : "Pay with Stellar (USDC)"}
      </PrimaryButton>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
    </div>
  );
};

export default StellarPayButton;
