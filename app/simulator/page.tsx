"use client";

import TradingViewChart from "@/components/TradingViewChart";
import TradeControls from "@/components/TradeControls";
import TradeHistory from "@/components/TradeHistory";
import BackToHome from "@/components/BackToHome";

export default function SimulatorPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 grid lg:grid-cols-5 gap-6">
      {/* Gráfico */}
      <div className="lg:col-span-3 space-y-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3">
          <TradingViewChart symbol="BINANCE:BTCUSDT" interval="60" height={520} />
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
          <p className="text-sm text-gray-300">
            Dica: use o simulador para treinar entradas, stops e manejo de risco.
          </p>
        </div>
        <BackToHome />
      </div>

      {/* Coluna lateral */}
      <div className="lg:col-span-2 space-y-6">
        <TradeControls />
        <TradeHistory />
      </div>
    </section>
  );
}
