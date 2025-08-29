// lib/plans.ts
export type PlanId = "starter" | "pro" | "master";

export const PLANS: Record<PlanId, {
  label: string;
  usd: number;
  eur: number;
  brl: number; // usaremos no Mercado Pago (Checkout Pro)
}> = {
  starter: { label: "Starter", usd: 0,  eur: 0,  brl: 0 },
  pro:     { label: "Trader Pro", usd: 19, eur: 19, brl: 97 },
  master:  { label: "Master",     usd: 49, eur: 49, brl: 247 },
};
