// app/simulador/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";
import FullscreenToggle from "@/components/FullscreenToggle";

// Pares padronizados com a Home
const PAIRS = [
  { label: "BTC/USDT", value: "BINANCE:BTCUSDT" },
  { label: "ETH/USDT", value: "BINANCE:ETHUSDT" },
  { label: "SOL/USDT", value: "BINANCE:SOLUSDT" },
  { label: "XRP/USDT", value: "BINANCE:XRPUSDT" },
  { label: "LINK/USDT", value: "BINANCE:LINKUSDT" },
  { label: "ADA/USDT", value: "BINANCE:ADAUSDT" },
  { label: "BNB/USDT", value: "BINANCE:BNBUSDT" },
  { label: "DOGE/USDT", value: "BINANCE:DOGEUSDT" },
];

export default function SimulatorPage() {
  const [pair, setPair] = useState(PAIRS[0].value);
  const [isFs, setIsFs] = useState(false);

  // atalhos de teclado: F para fullscreen, X para sair
  useEffect(() => {
    const onKey = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f" && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
      }
      if (e.key.toLowerCase() === "x" && document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onFsChange = useCallback((active: boolean) => setIsFs(active), []);

  const chartSymbol = useMemo(() => pair, [pair]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-200">Simulador</h1>

      <div className={isFs ? "hidden" : "mb-4 flex flex-wrap items-center gap-3"}>
        <label className="text-sm text-gray-400">Par</label>
        <select
          className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-200"
          value={pair}
          onChange={(e) => setPair(e.target.value)}
        >
          {PAIRS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid: quando fullscreen, o chart ocupa 100% e o painel some */}
      <div className={`grid gap-4 ${isFs ? "grid-cols-1" : "lg:grid-cols-3"}`}>
        <section className={`${isFs ? "" : "lg:col-span-2"} h-[72vh]`}>
          <Chart symbol={chartSymbol} interval="5" height="100%" />
        </section>

        <aside className={`${isFs ? "hidden" : "block"}`}>
          <TradePanel hidden={isFs} />
        </aside>
      </div>

      {/* Botão flutuante (ícone) */}
      <FullscreenToggle onChange={onFsChange} />
    </main>
  );
}
