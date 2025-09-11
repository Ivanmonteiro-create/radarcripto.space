"use client";

import { useEffect, useState, useCallback } from "react";
import TradingViewChart from "@/components/TradingViewChart";
import TradePanel from "@/components/TradePanel";

export default function SimulatorPage() {
  const [isFull, setIsFull] = useState(false);

  const enterFull = useCallback(async () => {
    if (document.fullscreenElement) return;
    // cobre tudo com Fullscreen API
    const el = document.getElementById("sim-root");
    if (el && el.requestFullscreen) {
      await el.requestFullscreen();
      setIsFull(true);
      document.body.classList.add("overflow-hidden");
    }
  }, []);

  const exitFull = useCallback(async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
    setIsFull(false);
    document.body.classList.remove("overflow-hidden");
  }, []);

  // atalhos F (entrar/alternar) e X/Escape (sair)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") {
        if (document.fullscreenElement) exitFull();
        else enterFull();
      }
      if (e.key.toLowerCase() === "x" || e.key === "Escape") {
        exitFull();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enterFull, exitFull]);

  // sai do estado quando o usuário usa ESC nativo
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      {/* Controles topo */}
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-200">Simulador</h1>

        <div className="flex items-center gap-2">
          {!isFull ? (
            <button
              onClick={enterFull}
              className="rounded-lg border border-emerald-600/40 bg-emerald-600/15 px-3 py-1.5 text-emerald-300 hover:bg-emerald-600/25"
              title="Tela cheia (F)"
            >
              ⛶ Tela cheia (F)
            </button>
          ) : (
            <button
              onClick={exitFull}
              className="rounded-lg border border-red-500/40 bg-red-600/15 px-3 py-1.5 text-red-300 hover:bg-red-600/25"
              title="Sair (X)"
            >
              ✕ Sair (X)
            </button>
          )}
        </div>
      </div>

      {/* Área raiz que entra em Fullscreen */}
      <div
        id="sim-root"
        className={`
          ${isFull ? "fixed inset-0 z-50 max-w-none px-0 py-0" : ""}
        `}
      >
        {/* GRID principal: gráfico + painel */}
        <div
          className={`
            grid h-[70vh] grid-cols-1 gap-4
            md:h-[72vh] md:grid-cols-[minmax(0,1fr)_360px]
            ${isFull ? "h-screen md:h-screen" : ""}
          `}
        >
          {/* Gráfico */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50">
            <div className="h-full w-full">
              <TradingViewChart symbol="BINANCE:BTCUSDT" interval="5" />
            </div>
          </div>

          {/* Painel de trade */}
          <TradePanel />
        </div>
      </div>

      {/* link de retorno (fora do fullscreen) */}
      {!isFull && (
        <div className="mt-6">
          <a href="/" className="text-sm text-emerald-400 hover:text-emerald-300">
            ← Voltar ao início
          </a>
        </div>
      )}
    </section>
  );
}
