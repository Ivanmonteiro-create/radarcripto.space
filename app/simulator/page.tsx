// app/simulator/page.tsx
"use client";

import TradeControls from "@/components/TradeControls";
import TradeHistory from "@/components/TradeHistory";

export default function SimulatorPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3 rounded-xl border border-gray-800 bg-gray-900/50 p-3">
        {/* Placeholder do gráfico – aqui no futuro entra o widget/iframe */}
        <div className="h-[420px] rounded-lg border border-gray-800 bg-gray-950 grid place-items-center text-gray-400">
          Área do gráfico (placeholder)
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <TradeControls />
        <TradeHistory />
      </div>
    </section>
  );
}
