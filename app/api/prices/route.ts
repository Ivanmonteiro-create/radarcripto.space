// app/api/prices/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", source: "prices endpoint" });
}
