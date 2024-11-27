"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Payjp from "payjp";

interface PaymentFormProps {
  plan: {
    name: string;
    price: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm = ({
  plan,
  onSuccess,
  onCancel,
}: PaymentFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cardElement, setCardElement] = useState<any>(null);
  const [cardBrand, setCardBrand] = useState<string>("");
  const [cardError, setCardError] = useState<string | null>(null);

  // PAY.JP Elements の初期化と配置
  const initializePayjp = () => {
    try {
      // グローバルオブジェクトとしてのPayjpを使用
      const elements = (window as any)
        .Payjp(process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY)
        .elements();

      // カスタムスタイルの定義
      const style = {
        base: {
          color: "#1a1a1a",
          lineHeight: "48px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#666666",
          },
        },
        invalid: {
          color: "#ff0000",
        },
      };

      // カード入力フォームの作成
      const card = elements.create("card", { style });

      // DOMへの配置
      card.mount("#card-element");

      // イベントリスナーの設定
      card.on("change", (event: any) => {
        if (event.error) {
          setCardError(event.error.message);
        } else {
          setCardError(null);
        }
        setCardBrand(event.brand);
      });

      setCardElement(card);
    } catch (error) {
      console.error("PAY.JP initialization error:", error);
      toast({
        title: "エラー",
        description: "決済フォームの初期化に失敗しました",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardElement) return;

    setIsLoading(true);

    try {
      // @ts-ignore
      const payjp = Payjp("pk_test_your_public_key");

      // カード情報のトークン化
      const { error, id: tokenId } = await payjp.createToken(cardElement);

      if (error) {
        throw new Error(error.message);
      }

      // 金額を数値に変換（"¥1,980" → 1980）
      const amount = parseInt(plan.price.replace(/[^0-9]/g, ""));

      // バックエンドAPIに決済処理をリクエスト
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId,
          planName: plan.name,
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "決済処理に失敗しました");
      }

      toast({
        title: "決済が完了しました",
        description: `${plan.name}プランへのアップグレードが完了しました。`,
      });

      onSuccess();
      router.refresh();
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "エラー",
        description:
          error instanceof Error
            ? error.message
            : "決済処理中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          {plan.name} - {plan.price}/月
        </div>

        {/* PAY.JPのカード入力フォーム */}
        <div className="space-y-2">
          <Label>カード情報</Label>
          <div
            id="card-element"
            className="p-4 border rounded-md min-h-[48px]"
            onClick={!cardElement ? initializePayjp : undefined}
          />
          {cardError && (
            <p className="text-sm text-red-500 mt-1">{cardError}</p>
          )}
          {cardBrand && (
            <p className="text-sm text-muted-foreground mt-1">
              カードブランド: {cardBrand}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isLoading || !cardElement}>
          {isLoading ? "処理中..." : "決済する"}
        </Button>
      </div>
    </form>
  );
};
