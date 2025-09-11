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

  // alturas: vista normal = 72vh; fullscreen = 100vh x 100vw SEM sobras
  const chartHeight = isFullscreen ? "100vh" : "72vh";
  const chartWidth = isFullscreen ? "100vw" : "100%";

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <a href="/" className="text-sm text-emerald-400 hover:underline">
          Voltar ao início
        </a>

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

      {/* contêiner que entra em fullscreen; no fullscreen removemos bordas/paddings */}
      <div
        id="chart-root"
        className={
          (isFullscreen
            ? "rounded-none border-0 p-0 m-0"
            : "rounded-2xl border border-gray-800 p-0") + " bg-transparent"
        }
      >
        {/* grid SEM gap no fullscreen para colar o gráfico nas bordas */}
        <div className={isFullscreen ? "grid grid-cols-12 gap-0" : "grid grid-cols-12 gap-3"}>
          {/* gráfico ocupa tudo no fullscreen */}
          <div className={isFullscreen ? "col-span-12" : "col-span-12 lg:col-span-8"}>
            <div
              className="w-full"
              style={{
                height: chartHeight,
                width: chartWidth,
              }}
            >
              <Chart symbol={selected.symbol} interval="5" />
            </div>
          </div>

          {/* painel escondido no fullscreen; mesma altura da área do gráfico quando visível */}
          <div className={isFullscreen ? "hidden" : "col-span-12 lg:col-span-4"}>
            <div
              className="rounded-xl border border-gray-800 bg-gray-900/60 p-3"
              style={{ height: chartHeight }}
            >
              <TradePanel pair={selected.symbol} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
