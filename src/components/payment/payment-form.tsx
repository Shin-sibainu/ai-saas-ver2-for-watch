/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payment/payment-form.tsx
"use client";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

//https://qiita.com/asip2k25/items/9687d19dad6481137785

interface PaymentFormProps {
  plan: {
    name: string;
    price: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Payjp: (key: string) => {
      elements: () => {
        create: (type: string, options?: any) => any;
      };
      createToken: (element: any) => Promise<{
        error?: { message: string };
        token?: { id: string };
      }>;
    };
  }
}
export function PaymentForm({ plan, onSuccess, onCancel }: PaymentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [payjpElement, setPayjpElement] = useState<any>(null);
  const payjpInstanceRef = useRef<any>(null);

  // インスタンス化を1回だけ行う
  if (!payjpInstanceRef.current) {
    payjpInstanceRef.current = window.Payjp(
      process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY!
    );
  }

  // カード要素の初期化
  useEffect(() => {
    if (
      !cardElementRef.current ||
      payjpElement ||
      !process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY
    )
      return;

    try {
      // elementsインスタンスを作成
      const elements = payjpInstanceRef.current.elements();

      // カード要素を作成
      const cardElement = elements.create("card", {
        style: {
          base: {
            color: "#32325d",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
          },
        },
      });

      // カード要素をマウント
      cardElement.mount(cardElementRef.current);
      setPayjpElement(cardElement);

      return () => {
        if (cardElement) {
          cardElement.unmount();
        }
      };
    } catch (error) {
      console.error("PAY.JP initialization error:", error);
      toast({
        title: "エラー",
        description: "決済フォームの初期化に失敗しました",
        variant: "destructive",
      });
    }
  }, [payjpElement]);

  const handleSubmit = async () => {
    if (!payjpElement || !payjpInstanceRef.current || isLoading) return;

    setIsLoading(true);

    try {
      const { error, token } = await payjpInstanceRef.current.createToken(
        payjpElement
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!token) {
        throw new Error("決済トークンの取得に失敗しました");
      }

      const amount = parseInt(plan.price.replace(/[^0-9]/g, ""));
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId: token.id,
          planName: plan.name,
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "決済処理中にエラーが発生しました"
        );
      }

      toast({
        title: "決済完了",
        description: "お支払いが正常に完了しました",
      });

      onSuccess();
      router.refresh();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "エラー",
        description:
          error instanceof Error ? error.message : "決済処理に失敗しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={cardElementRef}
        className="p-4 border rounded-md shadow-sm bg-white min-h-[60px]"
      />
      <div className="space-y-2">
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isLoading || !payjpElement}
        >
          {isLoading ? "処理中..." : "支払う"}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          キャンセル
        </Button>
      </div>
    </div>
  );
}
