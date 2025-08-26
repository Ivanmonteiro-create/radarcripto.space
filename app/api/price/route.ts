// app/api/price/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Placeholder para testar a API
  return NextResponse.json({ ok: true, price: 123.45 });
}
