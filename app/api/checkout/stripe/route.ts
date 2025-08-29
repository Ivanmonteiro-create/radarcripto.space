// app/api/checkout/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlan, Currency } from "@/lib/plans";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    if (!stripeSecret) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY ausente no .env" },
        { status: 500 }
      );
    }
    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

    const { planId, currency, success_url, cancel_url } =
      (await req.json()) as {
        planId: string;
        currency: Currency;
        success_url?: string;
        cancel_url?: string;
      };

    const plan = getPlan(planId);
    if (!plan) return NextResponse.json({ error: "Plano inválido" }, { status: 400 });

    const curr: Currency = (currency || "USD").toUpperCase() as Currency;
    const amount = Math.round((plan.prices[curr] || 0) * 100); // em cents

    // Gratuito? redireciona direto
    if (amount === 0) {
      return NextResponse.json({ url: success_url || "/" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment", // poderia ser subscription se preferir
      success_url: success_url || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/planos?ok=1`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_BASE_URL || ""}/planos?cancel=1`,
      line_items: [
        {
          price_data: {
            currency: curr.toLowerCase(),
            product_data: {
              name: plan.name,
              description: plan.tagline,
            },
            unit_amount: amount,
            recurring: undefined, // deixe undefined para pagamento único; use { interval: "month" } se assinatura
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId: plan.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao criar checkout Stripe" },
      { status: 500 }
    );
  }
}
