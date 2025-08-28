// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // precisa de Node (não Edge)

function required(name: string, val?: string) {
  if (!val) throw new Error(`Env ${name} ausente`);
  return val;
}

// --- STRIPE (cartão/PIX) ---
async function startStripeCheckout(search: URLSearchParams) {
  const stripeSecret = required("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY);
  const baseUrl = required("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL);

  const plan = (search.get("plan") || "pro").toLowerCase();        // pro | master
  const currency = (search.get("currency") || "BRL").toUpperCase(); // BRL | USD | EUR
  const method = (search.get("method") || "card").toLowerCase();    // card | pix

  // mapeie preços por plano/moeda (IDs criados no Stripe)
  const priceMap: Record<string, string> = {
    // PRO
    "pro:BRL": required("STRIPE_PRICE_PRO_BRL", process.env.STRIPE_PRICE_PRO_BRL),
    "pro:USD": required("STRIPE_PRICE_PRO_USD", process.env.STRIPE_PRICE_PRO_USD),
    "pro:EUR": required("STRIPE_PRICE_PRO_EUR", process.env.STRIPE_PRICE_PRO_EUR),
    // MASTER
    "master:BRL": required("STRIPE_PRICE_MASTER_BRL", process.env.STRIPE_PRICE_MASTER_BRL),
    "master:USD": required("STRIPE_PRICE_MASTER_USD", process.env.STRIPE_PRICE_MASTER_USD),
    "master:EUR": required("STRIPE_PRICE_MASTER_EUR", process.env.STRIPE_PRICE_MASTER_EUR),
  };

  const price = priceMap[`${plan}:${currency}`];
  if (!price) throw new Error("Plano/moeda não suportados");

  // import dinâmico para evitar carregar no Edge
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

  const payment_method_types = method === "pix" ? ["pix"] : ["card"];

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    // você pode coletar email/endereço aqui se quiser
    payment_method_types,
    success_url: `${baseUrl}/success?plan=${plan}`,
    cancel_url: `${baseUrl}/cancel`,
    metadata: { plan, currency, method },
    allow_promotion_codes: true,
  });

  return NextResponse.redirect(session.url!, 303);
}

// --- COINBASE COMMERCE (cripto) ---
async function startCoinbaseCheckout(search: URLSearchParams) {
  const apiKey = required("COINBASE_COMMERCE_API_KEY", process.env.COINBASE_COMMERCE_API_KEY);
  const baseUrl = required("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL);

  const plan = (search.get("plan") || "pro").toLowerCase();

  // preços em USD definidos por plano (para exibir ao usuário na página da Coinbase)
  const unitAmountUSD =
    plan === "master"
      ? Number(required("COINBASE_PRICE_MASTER_USD", process.env.COINBASE_PRICE_MASTER_USD))
      : Number(required("COINBASE_PRICE_PRO_USD", process.env.COINBASE_PRICE_PRO_USD));

  const Commerce = await import("coinbase-commerce-node");
  const { Client, Charge } = Commerce;
  Client.init(apiKey);

  const charge = await Charge.create({
    name: `RadarCripto.space – assinatura ${plan.toUpperCase()}`,
    description: `Plano ${plan.toUpperCase()} (mensal)`,
    local_price: { amount: unitAmountUSD.toFixed(2), currency: "USD" },
    pricing_type: "fixed_price",
    redirect_url: `${baseUrl}/success?plan=${plan}`,
    cancel_url: `${baseUrl}/cancel`,
    metadata: { plan },
  });

  // a API retorna vários links; usamos 'hosted_url'
  return NextResponse.redirect(charge.hosted_url, 303);
}

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams;
    const provider = (search.get("provider") || "stripe").toLowerCase();

    if (provider === "coinbase") {
      return await startCoinbaseCheckout(search);
    }
    // default → stripe
    return await startStripeCheckout(search);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Checkout error", message: err?.message || "Unknown" },
      { status: 400 }
    );
  }
}
