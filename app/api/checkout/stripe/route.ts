// app/api/checkout/stripe/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { plan, currency } = await req.json();

    // preços simples para demo; ajuste como quiser
    const amountMap: Record<string, number> = {
      pro: 1900,
      master: 4900,
    };
    const amount = amountMap[plan?.toLowerCase()] ?? 1900;

    const urlBase =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${urlBase}/checkout/success?plan=${plan}`,
      cancel_url: `${urlBase}/checkout/cancel`,
      currency: (currency || "usd").toLowerCase(),
      line_items: [
        {
          price_data: {
            currency: (currency || "usd").toLowerCase(),
            product_data: {
              name:
                plan?.toLowerCase() === "master"
                  ? "RadarCripto Master"
                  : "RadarCripto Pro",
            },
            unit_amount: amount, // em cents
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err?.message || "Stripe error" },
      { status: 500 }
    );
  }
}
