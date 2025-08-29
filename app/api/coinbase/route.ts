// app/api/checkout/coinbase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPlan } from "../../../../lib/plans";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "COINBASE_COMMERCE_API_KEY ausente no .env" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const coinbase = require("coinbase-commerce-node");
    const Client = coinbase.Client;
    const resources = coinbase.resources;

    Client.init(apiKey);

    const { planId, currency } = (await req.json()) as {
      planId: string;
      currency?: "USD" | "EUR";
    };

    const plan = getPlan(planId);
    if (!plan) return NextResponse.json({ error: "Plano inválido" }, { status: 400 });

    const curr = (currency || "USD").toUpperCase();
    const amount = plan.prices[curr as "USD" | "EUR"] ?? plan.prices.USD;
    if ((amount || 0) <= 0) return NextResponse.json({ url: "/" });

    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    const charge = await resources.Charge.create({
      name: plan.name,
      description: plan.tagline,
      pricing_type: "fixed_price",
      local_price: { amount: String(amount), currency: curr },
      metadata: { planId: plan.id },
      redirect_url: `${base}/planos?ok=1`,
      cancel_url: `${base}/planos?cancel=1`,
    });

    return NextResponse.json({ url: charge.hosted_url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao criar cobrança Coinbase" },
      { status: 500 }
    );
  }
}
