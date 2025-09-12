// app/simulator/SimulatorClient.tsx
"use client";

import { useState } from "react";
import TradingViewWidget from "@/components/TradingViewWidget";
import TradeControls from "@/components/TradeControls";

export default function SimulatorClient() {
  const [symbol, setSymbol] = useState<string>("BINANCE:BTCUSDT");
  const [interval, setInterval] = useState<string>("5");

  return (
    <main className="mx-auto w-full max-w-[1400px] px-3 pb-6">
      {/* cabeçalho compacto */}
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-white/90">Simulador</h1>
      </div>

      {/* grade principal */}
      <div className="flex gap-4">
        {/* gráfico - ocupa todo o restante */}
        <section className="min-h-[70vh] flex-1 rounded-xl border border-gray-700/60 bg-gray-900/30 p-2">
          <div className="h-[calc(100vh-190px)] w-full">
            <TradingViewWidget
              symbol={symbol}
              interval={interval}
              hideLegend={true}
              hideTopToolbar={false}
              allowSymbolChange={true}
            />
          </div>
        </section>

        {/* controles fixos à direita */}
        <aside className="w-[360px]">
          <TradeControls
            symbol={symbol}
            onChangeSymbol={setSymbol}
            interval={interval}
            onChangeInterval={setInterval}
          />
        </aside>
      </div>
    </main>
  );
}
