"use client";

import TradeControls from "@/components/TradeControls";
import TradeHistory from "@/components/TradeHistory";

export default function SimulatorPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-5 gap-6">
      {/* Coluna do gráfico */}
      <div className="lg:col-span-3 space-y-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3">
          {/* Placeholder do gráfico – aqui virá o widget ou canvas */}
          <div className="h-[460px] rounded-lg border border-gray-800 bg-gray-950 grid place-items-center text-gray-400">
            Área do gráfico
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-sm text-gray-300">
            Dica: use o simulador para treinar entradas, stops e manejo de risco.
          </p>
        </div>
      </div>

      {/* Coluna lateral */}
      <div className="lg:col-span-2 space-y-6">
        <TradeControls />
        <TradeHistory />
      </div>
    </section>
  );
}
