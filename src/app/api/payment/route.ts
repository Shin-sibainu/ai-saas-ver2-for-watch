import { NextResponse } from "next/server";
import Payjp from "payjp";

const payjp = Payjp(process.env.PAYJP_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { tokenId, planName, amount } = await request.json();

    const charge = await payjp.charges.create({
      amount: amount,
      currency: "jpy",
      card: tokenId,
      capture: true,
      description: `${planName}プランへのアップグレード`,
    });

    //Option: update to supabase table user planName

    return NextResponse.json({ success: true, chargeId: charge.id });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      {
        error: "決済処理に失敗しました。",
      },
      { status: 500 }
    );
  }
}
