// /app/dashboard/plans/layout.tsx
import Script from "next/script";

export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="absolute top-4 z-50" style={{ zIndex: 9999 }}>
        <Script
          type="text/javascript"
          src="https://checkout.pay.jp/"
          className="payjp-button"
          data-key={process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY}
          data-text="カード情報を入力"
          data-submit-text="支払う"
        />
      </div>
    </div>
  );
}
