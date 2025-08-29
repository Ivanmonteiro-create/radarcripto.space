// lib/plans.ts
export type PlanId = "starter" | "pro" | "master";

export type Currency = "USD" | "BRL" | "EUR";

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  prices: Record<Currency, number>; // unit_amount por MÊS
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    tagline: "Gratuito",
    prices: { USD: 0, BRL: 0, EUR: 0 },
    features: [
      "Créditos fictícios: US$ 100.000",
      "Acesso ao simulador (BTC, ETH, SOL, BNB, XRP)",
      "Indicadores visuais (TradingView embutido)",
      "Painel de trade com PnL não realizado",
    ],
  },
  pro: {
    id: "pro",
    name: "Trader Pro",
    tagline: "Para quem quer evoluir rápido",
    prices: { USD: 19, BRL: 89, EUR: 18 },
    features: [
      "Tudo do Starter",
      "Metas semanais e histórico de performance",
      "Gestão de risco (limite por trade e por dia)",
      "Alertas de liquidez (Buy/Sell/Reset)",
      "Suporte prioritário",
    ],
  },
  master: {
    id: "master",
    name: "Master",
    tagline: "Para quem quer ir além",
    prices: { USD: 49, BRL: 229, EUR: 45 },
    features: [
      "Tudo do Pro",
      "Relatórios avançados de PnL e WinRate",
      "Exportação de operações (CSV)",
      "Templários de setups e indicadores",
    ],
  },
};

export function getPlan(planId: string): Plan | null {
  const id = planId as PlanId;
  return PLANS[id] ?? null;
}
