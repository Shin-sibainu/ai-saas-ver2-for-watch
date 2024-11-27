// components/pricing/upgrade-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { PaymentForm } from "./payment-form";

interface PricingButtonProps {
  planName: string;
  buttonText: string;
  price: string;
  isPopular?: boolean;
  disabled?: boolean;
}

export function PricingButton({
  planName,
  buttonText,
  price,
  isPopular,
  disabled,
}: PricingButtonProps) {
  const [showPayment, setShowPayment] = useState(false);

  const handleSuccess = () => {
    setShowPayment(false);
    toast({
      title: "アップグレードが完了しました",
      description: `${planName}へのアップグレードが正常に完了しました。`,
    });
  };

  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => setShowPayment(true)}
        className={cn(
          "w-full",
          isPopular
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            : "bg-primary/10 hover:bg-primary/20 text-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Zap
          className={cn(
            "w-4 h-4 mr-2",
            isPopular ? "text-white" : "text-primary"
          )}
        />
        {buttonText}
      </Button>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{planName}へのアップグレード</DialogTitle>
            <DialogDescription>
              {price}
              /月のプランにアップグレードします。クレジットカード情報を入力してください。
            </DialogDescription>
          </DialogHeader>
          <PaymentForm
            plan={{ name: planName, price }}
            onSuccess={handleSuccess}
            onCancel={() => setShowPayment(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
