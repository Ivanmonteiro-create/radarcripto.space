// app/api/checkout/stripe/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PLANS } from "@/lib/plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = (searchParams.get("plan") || "pro") as keyof typeof PLANS;
    const currency = (searchParams.get("currency") || "USD").toUpperCase();

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }
    const amountMap: Record<string, number> = {
      USD: PLANS[plan].usd,
      EUR: PLANS[plan].eur,
    };
    if (!(currency in amountMap)) {
      return NextResponse.json({ error: "Moeda não suportada" }, { status: 400 });
    }

    const unitAmount = Math.round(amountMap[currency] * 100); // em cents

    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const successUrl = process.env.STRIPE_SUCCESS_URL || `${base}/success?gateway=stripe&plan=${plan}`;
    const cancelUrl  = process.env.STRIPE_CANCEL_URL  || `${base}/cancel?gateway=stripe&plan=${plan}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            recurring: { interval: "month" },
            unit_amount: unitAmount,
            product_data: {
              name: `${PLANS[plan].label} (mensal)`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (e: any) {
    console.error("Stripe error:", e);
    return NextResponse.json({ error: e.message || "Erro Stripe" }, { status: 500 });
  }
}
