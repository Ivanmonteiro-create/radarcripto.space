"use client";

import { useMemo, useState } from "react";
import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";
import FullscreenToggle from "@/components/FullscreenToggle";
import Link from "next/link";

// pares a partir da Home (8 ativos)
const PAIRS = [
  { label: "BTC/USDT", symbol: "BINANCE:BTCUSDT" },
  { label: "ETH/USDT", symbol: "BINANCE:ETHUSDT" },
  { label: "SOL/USDT", symbol: "BINANCE:SOLUSDT" },
  { label: "BNB/USDT", symbol: "BINANCE:BNBUSDT" },
  { label: "ADA/USDT", symbol: "BINANCE:ADAUSDT" },
  { label: "XRP/USDT", symbol: "BINANCE:XRPUSDT" },
  { label: "LINK/USDT", symbol: "BINANCE:LINKUSDT" },
  { label: "DOGE/USDT", symbol: "BINANCE:DOGEUSDT" },
];

export default function SimulatorPage() {
  const [isFull, setIsFull] = useState(false);
  const [symbol, setSymbol] = useState(PAIRS[0].symbol);
  const [interval, setInterval] = useState<"1" | "3" | "5" | "15" | "30" | "60" | "120" | "240" | "D" | "W">("5");

  // painel some no modo fullscreen
  const showSidePanel = !isFull;

  // classes utilitárias para altura máxima útil da janela
  const pageClass = useMemo(
    () =>
      "relative mx-auto w-full max-w-[1400px] px-3 md:px-6 " +
      (isFull ? "h-screen" : "min-h-[calc(100vh-120px)]"),
    [isFull]
  );

  return (
    <main className={pageClass}>
      {/* topo: voltar */}
      {!isFull && (
        <div className="mb-3 flex items-center justify-between">
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">
            Voltar ao início
          </Link>

          <div className="flex items-center gap-2">
            <label className="hidden text-sm text-gray-300 md:block">Intervalo</label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value as any)}
              className="h-8 rounded-md border border-gray-700 bg-gray-900 px-2 text-gray-100"
            >
              <option value="1">1m</option>
              <option value="3">3m</option>
              <option value="5">5m</option>
              <option value="15">15m</option>
              <option value="30">30m</option>
              <option value="60">1h</option>
              <option value="240">4h</option>
              <option value="D">1D</option>
              <option value="W">1W</option>
            </select>

            <FullscreenToggle
              isFull={isFull}
              onToggle={() => setIsFull((v) => !v)}
              className="h-8 w-8"
              title="Tela cheia (F)"
            />
          </div>
        </div>
      )}

      {/* grid: gráfico ocupa todo o restante, painel fica à direita */}
      <section
        className={
          "grid h-[calc(100vh-160px)] grid-cols-1 gap-4 md:h-[calc(100vh-140px)] " +
          (showSidePanel ? "md:grid-cols-[1fr_340px]" : "md:grid-cols-1")
        }
      >
        {/* CARD do gráfico */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-2 md:p-3">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <Chart
              symbol={symbol}
              interval={interval}
              theme="dark"
              autosize
              hideTopToolbar={false}
              hideLegend={true}
            />
          </div>
        </div>

        {/* Painel lateral (some no fullscreen) */}
        {showSidePanel && (
          <div className="flex flex-col gap-4">
            <TradePanel
              pairs={PAIRS}
              selected={symbol}
              onChangePair={(s) => setSymbol(s)}
            />
          </div>
        )}
      </section>
    </main>
  );
}
