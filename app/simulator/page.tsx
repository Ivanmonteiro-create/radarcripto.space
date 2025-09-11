"use client";

import { useMemo, useState } from "react";
import FullscreenToggle from "@/components/FullscreenToggle";
import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";

const PAIRS = [
  { symbol: "BTCUSDT", label: "BTC/USDT" },
  { symbol: "ETHUSDT", label: "ETH/USDT" },
  { symbol: "SOLUSDT", label: "SOL/USDT" },
  { symbol: "BNBUSDT", label: "BNB/USDT" },
  { symbol: "ADAUSDT", label: "ADA/USDT" },
  { symbol: "XRPUSDT", label: "XRP/USDT" },
  { symbol: "LINKUSDT", label: "LINK/USDT" },
  { symbol: "DOGEUSDT", label: "DOGE/USDT" },
];

export default function SimulatorPage() {
  const [pair, setPair] = useState(PAIRS[0].symbol);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const selected = useMemo(() => PAIRS.find((p) => p.symbol === pair)!, [pair]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <a href="/" className="text-sm text-emerald-400 hover:underline">Voltar ao início</a>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">Par</label>
          <select
            className="rounded-md border border-gray-700 bg-gray-900 px-2 py-1 text-sm"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
          >
            {PAIRS.map((p) => (
              <option key={p.symbol} value={p.symbol}>
                {p.label}
              </option>
            ))}
          </select>

          <FullscreenToggle targetId="chart-root" onChange={setIsFullscreen} />
        </div>
      </div>

      {/* contêiner que entra em fullscreen */}
      <div
        id="chart-root"
        className="rounded-2xl border border-gray-800 bg-gray-900/50 p-3"
      >
        {/* mesma altura para gráfico e painel -> sem “buracos” */}
        <div className="grid grid-cols-12 gap-3">
          <div className={isFullscreen ? "col-span-12" : "col-span-12 lg:col-span-8"}>
            <div className="h-[72vh] w-full rounded-xl border border-gray-800 bg-gray-900/40 p-2">
              <div className="h-full w-full">
                <Chart symbol={selected.symbol} interval="5" />
              </div>
            </div>
          </div>

          {/* painel some em fullscreen; altura fixa igual à do gráfico */}
          <div className={isFullscreen ? "hidden" : "col-span-12 lg:col-span-4"}>
            <div className="h-[72vh] rounded-xl border border-gray-800 bg-gray-900/60 p-3">
              <TradePanel pair={selected.symbol} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
