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
      <Script src="https://js.pay.jp/v2/pay.js" strategy="beforeInteractive" />
    </div>
  );
}
