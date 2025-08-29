// app/api/checkout/mercadopago/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PLANS } from "@/lib/plans";
import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN as string,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = (searchParams.get("plan") || "pro") as keyof typeof PLANS;

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    const preference = {
      items: [
        {
          title: `${PLANS[plan].label} (mensal)`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: PLANS[plan].brl,
        },
      ],
      back_urls: {
        success: `${base}/success?gateway=mercadopago&plan=${plan}`,
        failure: `${base}/cancel?gateway=mercadopago&plan=${plan}`,
        pending: `${base}/success?gateway=mercadopago&plan=${plan}&status=pending`,
      },
      auto_return: "approved",
    };

    const { body } = await mercadopago.preferences.create(preference as any);
    // init_point abre o Checkout Pro (usuário escolhe Pix, cartão, etc.)
    return NextResponse.redirect(body.init_point, 303);
  } catch (e: any) {
    console.error("MercadoPago error:", e);
    return NextResponse.json({ error: e.message || "Erro Mercado Pago" }, { status: 500 });
  }
}
