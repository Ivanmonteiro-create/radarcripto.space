"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";
import FullscreenToggle from "@/components/FullscreenToggle";
import clsx from "clsx";

// mesmos 8 pares que aparecem na home
const PAIRS = [
  { label: "BTC/USDT", symbol: "BTCUSDT" },
  { label: "ETH/USDT", symbol: "ETHUSDT" },
  { label: "SOL/USDT", symbol: "SOLUSDT" },
  { label: "BNB/USDT", symbol: "BNBUSDT" },
  { label: "ADA/USDT", symbol: "ADAUSDT" },
  { label: "XRP/USDT", symbol: "XRPUSDT" },
  { label: "LINK/USDT", symbol: "LINKUSDT" },
  { label: "DOGE/USDT", symbol: "DOGEUSDT" },
];

export default function SimulatorPage() {
  const [selected, setSelected] = useState(PAIRS[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // controla o verdadeiro fullscreen do navegador
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onChange = () => {
      const inFs =
        document.fullscreenElement === el ||
        // safari
        // @ts-ignore
        document.webkitFullscreenElement === el;
      setIsFullscreen(inFs);
    };
    document.addEventListener("fullscreenchange", onChange);
    // @ts-ignore - safari
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      // @ts-ignore
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    const el = rootRef.current;
    if (!el) return;
    if (!isFullscreen) {
      // entrar em FS
      if (el.requestFullscreen) await el.requestFullscreen();
      // @ts-ignore - safari
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) await document.exitFullscreen();
      // @ts-ignore
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
    }
  };

  return (
    // altura total da viewport menos a navbar (ajuste fino se precisar)
    <div className="w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* wrapper que entra em fullscreen */}
      <div
        ref={rootRef}
        className={clsx(
          "relative h-full w-full bg-[#0b0f12] overflow-hidden",
          isFullscreen && "fixed inset-0 z-50"
        )}
      >
        {/* GRID PRINCIPAL: gráfico ocupa 1fr, painel 380px. Em fullscreen o painel some */}
        <div
          className={clsx(
            "h-full w-full grid",
            isFullscreen ? "grid-cols-1" : "grid-cols-[1fr_380px]"
          )}
          style={{ gap: 0 }}
        >
          {/* COLUNA DO GRÁFICO — sem bordas/sobras */}
          <div className="h-full w-full">
            <div className="h-full w-full m-0 p-0">
              <Chart symbol={selected.symbol} interval="5" />
            </div>
          </div>

          {/* PAINEL DE TRADE (some no fullscreen) */}
          <aside
            className={clsx(
              "h-full w-[380px] border-l border-gray-800/60 bg-gray-900/30 backdrop-blur",
              isFullscreen && "hidden"
            )}
          >
            <TradePanel
              symbol={selected.symbol}
              onSymbolChange={(sym) => {
                const found = PAIRS.find((p) => p.symbol === sym);
                if (found) setSelected(found);
              }}
              pairs={PAIRS}
            />
          </aside>
        </div>

        {/* BOTÃO DE FULLSCREEN (canto superior direito) */}
        <div className="absolute top-3 right-4">
          <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
        </div>

        {/* seletor rápido do par (fica sobre o gráfico, canto superior esquerdo) */}
        {!isFullscreen && (
          <div className="absolute top-3 left-4">
            <select
              value={selected.symbol}
              onChange={(e) => {
                const found = PAIRS.find((p) => p.symbol === e.target.value);
                if (found) setSelected(found);
              }}
              className="bg-gray-900/70 border border-gray-700 rounded-md px-3 py-1 text-sm outline-none"
            >
              {PAIRS.map((p) => (
                <option key={p.symbol} value={p.symbol}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
