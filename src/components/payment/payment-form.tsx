/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payment/payment-form.tsx
"use client";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  plan: {
    name: string;
    price: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ plan, onSuccess, onCancel }: PaymentFormProps) {
  const router = useRouter();

  useEffect(() => {
    const handlePayjpComplete = async (event: any) => {
      const { token } = event.detail;

      try {
        const amount = parseInt(plan.price.replace(/[^0-9]/g, ""));
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tokenId: token,
            planName: plan.name,
            amount,
          }),
        });

        if (!response.ok) {
          throw new Error("決済処理に失敗しました");
        }

        onSuccess();
        router.refresh();
      } catch (error) {
        console.error("Payment error:", error);
        toast({
          title: "エラー",
          description:
            error instanceof Error ? error.message : "エラーが発生しました",
          variant: "destructive",
        });
      }
    };

    window.addEventListener("payjp:complete", handlePayjpComplete);
    return () =>
      window.removeEventListener("payjp:complete", handlePayjpComplete);
  }, [plan, onSuccess, router]);

  return (
    <div className="space-y-4">
      <Button onClick={onCancel} variant="outline" className="w-full">
        キャンセル
      </Button>
      <button
        className="payjp-button w-full"
        data-key={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY}
        data-text="カード情報を入力"
        data-submit-text="支払う"
        data-partial="true"
        data-currency="jpy"
        data-name={plan.name}
        data-amount={parseInt(plan.price.replace(/[^0-9]/g, ""))}
        data-lang="ja"
      >
        決済する
      </button>
    </div>
  );
}
