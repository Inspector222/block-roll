import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutConfirmationProps {
  className?: string;
}

const CheckoutConfirmation: React.FC<CheckoutConfirmationProps> = ({
  className,
}) => {
  return (
    <div className={cn("max-w-4xl mx-auto p-8 lg:p-16", className)}>
      <div className="relative bg-transparent border-2 border-white/20 rounded-[2rem] p-8 lg:p-16 backdrop-blur-sm">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-green-400/30 bg-green-500/20 flex items-center justify-center">
            <Check className="w-10 h-10 lg:w-12 lg:h-12 text-green-400 stroke-[3]" />
          </div>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-6">
          <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto">
            Hell yeah, you&apos;ve made it! Congratulations on becoming the
            premium member of Opensox AI. Very soon you&apos;ll receive an email
            with the next steps from our side.
          </p>

          <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto">
            If you have any doubts, feel free to ping us here:{" "}
            <span className="text-[#A970FF]">hi@opensox.ai</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
