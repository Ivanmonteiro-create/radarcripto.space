// app/api/checkout/coinbase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PLANS } from "@/lib/plans";
import coinbase from "coinbase-commerce-node";

const { Client, resources } = coinbase;
const { Charge } = resources as any;

Client.init(process.env.COINBASE_COMMERCE_API_KEY as string);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = (searchParams.get("plan") || "pro") as keyof typeof PLANS;

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const successUrl = `${base}/success?gateway=coinbase&plan=${plan}`;
    const cancelUrl  = `${base}/cancel?gateway=coinbase&plan=${plan}`;

    const charge = await Charge.create({
      name: PLANS[plan].label,
      description: `Assinatura mensal do plano ${PLANS[plan].label}`,
      pricing_type: "fixed_price",
      local_price: { amount: PLANS[plan].usd.toString(), currency: "USD" },
      metadata: { plan },
      redirect_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.redirect(charge.hosted_url, 303);
  } catch (e: any) {
    console.error("Coinbase error:", e);
    return NextResponse.json({ error: e.message || "Erro Coinbase" }, { status: 500 });
  }
}
