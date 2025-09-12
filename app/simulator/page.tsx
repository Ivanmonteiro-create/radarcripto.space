"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";
import FullscreenToggle from "@/components/FullscreenToggle";

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

  // Detecta entrada/saída de fullscreen
  useEffect(() => {
    const onChange = () => {
      const el = rootRef.current;
      const inFs =
        document.fullscreenElement === el ||
        // @ts-ignore (Safari)
        document.webkitFullscreenElement === el;
      setIsFullscreen(!!inFs);
    };
    document.addEventListener("fullscreenchange", onChange);
    // @ts-ignore
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
      if (el.requestFullscreen) await el.requestFullscreen();
      // @ts-ignore
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) await document.exitFullscreen();
      // @ts-ignore
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* container que entra em fullscreen */}
      <div
        ref={rootRef}
        className={
          "relative h-full w-full bg-[#0b0f12] overflow-hidden" +
          (isFullscreen ? " fixed inset-0 z-50" : "")
        }
      >
        {/* GRID: gráfico ocupa 1fr; painel 380px. Sem gap e sem padding. */}
        <div
          className={
            "h-full w-full grid gap-0 " +
            (isFullscreen ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_380px]")
          }
        >
          {/* COLUNA DO GRÁFICO – encosta nas bordas */}
          <div className="h-full w-full">
            <div className="h-full w-full m-0 p-0">
              <Chart symbol={selected.symbol} interval="5" />
            </div>
          </div>

          {/* PAINEL – some no fullscreen */}
          <aside
            className={
              "h-full w-[380px] border-l border-gray-800/60 bg-gray-900/30 backdrop-blur" +
              (isFullscreen ? " hidden" : "")
            }
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

        {/* Toggle de Fullscreen (ícone) */}
        <div className="absolute top-3 right-4">
          <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
        </div>

        {/* Seletor rápido do par (não aparece no fullscreen) */}
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
