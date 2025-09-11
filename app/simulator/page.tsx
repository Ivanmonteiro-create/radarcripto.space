"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import FullscreenToggle from "@/components/FullscreenToggle";

// Chart via TradingView (client-only)
const TVChart = dynamic(() => import("@/components/Chart"), { ssr: false });

// PARES visíveis na Home (mantém a ordem)
const PAIRS = [
  "BTC/USDT",
  "ETH/USDT",
  "SOL/USDT",
  "XRP/USDT",
  "LINK/USDT",
  "BNB/USDT",
  "ADA/USDT",
  "DOGE/USDT",
];

export default function SimulatorPage() {
  const [pair, setPair] = useState("BTC/USDT");
  const [isFull, setIsFull] = useState(false);

  // evita layout shift quando entra em fullscreen
  useEffect(() => {
    document.body.style.overflow = isFull ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFull]);

  const pairs = useMemo(() => PAIRS, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Simulador</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* ÁREA DO GRÁFICO */}
        <section className="lg:col-span-8 rounded-xl border border-gray-800 bg-gray-900/50 p-3">
          <div className="rounded-lg border border-gray-800 bg-black">
            <TVChart symbol={pair.replace("/", "")} interval="5" height={520} />
          </div>
        </section>

        {/* CONTROLES (somem no fullscreen) */}
        <aside
          className={`lg:col-span-4 rounded-xl border border-gray-800 bg-gray-900/50 p-4 transition-opacity ${
            isFull ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <h2 className="mb-3 text-lg font-medium">Controles de Trade</h2>

          <label className="mb-1 block text-sm text-gray-300">Par</label>
          <select
            value={pair}
            onChange={(e) => setPair(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 outline-none focus:border-emerald-600"
          >
            {pairs.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* … seus inputs/botões de compra/venda permanecem aqui … */}
          <div className="space-y-2">
            <div className="rounded-md bg-gray-800/60 px-3 py-2 text-sm text-gray-400">
              Saldo (demo): $10&nbsp;000
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-md bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-500">
                Comprar
              </button>
              <button className="flex-1 rounded-md bg-rose-600 px-3 py-2 font-medium text-white hover:bg-rose-500">
                Vender
              </button>
            </div>
            <button className="w-full rounded-md border border-gray-700 px-3 py-2 text-gray-200 hover:bg-gray-800">
              Resetar
            </button>
          </div>
        </aside>
      </div>

      {/* BOTÃO F/X MINIMALISTA */}
      <FullscreenToggle onChange={setIsFull} />
    </main>
  );
}
