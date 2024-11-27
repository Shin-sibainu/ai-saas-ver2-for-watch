import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PricingButton } from "@/components/payment/upgrade-button";

const pricingPlans = [
  {
    name: "無料プラン",
    description: "個人での利用に最適",
    price: "¥0",
    interval: "/月",
    features: [
      "画像生成 月10枚まで",
      "背景削除 月5枚まで",
      "画像圧縮 月20枚まで",
      "最大画像サイズ 2MB",
      "標準画質での出力",
    ],
    buttonText: "現在のプラン",
    isPopular: false,
    disabled: true,
  },
  {
    name: "プロプラン",
    description: "プロフェッショナルな利用に",
    price: "¥1,980",
    interval: "/月",
    features: [
      "画像生成 月100枚",
      "背景削除 月50枚",
      "画像圧縮 無制限",
      "最大画像サイズ 10MB",
      "高画質での出力",
      "優先サポート",
      "商用利用可能",
    ],
    buttonText: "アップグレード",
    isPopular: true,
    disabled: false,
  },
  {
    name: "ビジネスプラン",
    description: "チームでの利用に最適",
    price: "¥4,980",
    interval: "/月",
    features: [
      "画像生成 無制限",
      "背景削除 無制限",
      "画像圧縮 無制限",
      "最大画像サイズ 無制限",
      "最高画質での出力",
      "優先サポート",
      "商用利用可能",
      "API アクセス",
      "チームメンバー5名まで",
    ],
    buttonText: "アップグレード",
    isPopular: false,
    disabled: false,
  },
];

export default function PricingPage() {
  // 現在のプランを取得（実際の実装ではAPIやContextから取得）
  const currentPlan = "free";

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-4">料金プラン</h1>
        <p className="text-muted-foreground">
          あなたのニーズに合わせた最適なプランをお選びください
        </p>
      </div>

      {currentPlan === "free" && (
        <div className="max-w-md mx-auto mb-8 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-4 rounded-lg">
          <div className="flex items-center justify-between text-center">
            <p className="font-medium">現在の利用状況</p>
            <p className="text-sm text-muted-foreground">
              今月の画像生成: 8/10枚
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.isPopular && "border-primary shadow-lg"
            )}
          >
            {plan.isPopular && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500">
                人気
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {plan.name}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <PricingButton
                planName={plan.name}
                buttonText={plan.buttonText}
                price={plan.price}
                isPopular={plan.isPopular}
                disabled={plan.disabled}
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
