// app/api/checkout/mercadopago/route.ts
import { NextRequest, NextResponse } from "next/server";
import mercadopago from "mercadopago";
import { getPlan } from "../../../../lib/plans";

export async function POST(req: NextRequest) {
  try {
    const token = process.env.MP_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "MP_ACCESS_TOKEN ausente no .env" },
        { status: 500 }
      );
    }
    mercadopago.configure({ access_token: token });

    const { planId, success_url, cancel_url } = (await req.json()) as {
      planId: string;
      success_url?: string;
      cancel_url?: string;
    };

    const plan = getPlan(planId);
    if (!plan) return NextResponse.json({ error: "Plano inválido" }, { status: 400 });

    const amountBRL = plan.prices.BRL || 0;
    if (amountBRL <= 0) return NextResponse.json({ url: success_url || "/" });

    const base = process.env.NEXT_PUBLIC_BASE_URL || "";
    const preference = await mercadopago.preferences.create({
      items: [
        {
          title: plan.name,
          description: plan.tagline,
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(amountBRL),
        },
      ],
      back_urls: {
        success: success_url || `${base}/planos?ok=1`,
        failure: cancel_url || `${base}/planos?cancel=1`,
        pending: success_url || `${base}/planos?pending=1`,
      },
      auto_return: "approved",
      metadata: { planId: plan.id },
    });

    const url = preference.body.init_point || preference.body.sandbox_init_point;
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao criar preferência Mercado Pago" },
      { status: 500 }
    );
  }
}
