"use client";

import Link from "next/link";
import { useState } from "react";

// Componentes existentes no seu projeto
import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";
import FullscreenToggle from "@/components/FullscreenToggle";

// Helper para classes (substitui o clsx)
import { cn } from "@/lib/cn";

// Pares exibidos também na Home — mantenha esta lista igual à da Home
const PAIRS = [
  "BTC/USDT",
  "ETH/USDT",
  "SOL/USDT",
  "BNB/USDT",
  "ADA/USDT",
  "XRP/USDT",
  "LINK/USDT",
  "DOGE/USDT",
] as const;

export default function SimulatorPage() {
  const [symbol, setSymbol] = useState<(typeof PAIRS)[number]>("BTC/USDT");
  const [isFull, setIsFull] = useState(false);

  return (
    <main className="min-h-[calc(100vh-80px)] w-full px-3 sm:px-4 md:px-6 lg:px-8">
      {/* topo: voltar e fullscreen */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-emerald-400 hover:text-emerald-300 transition"
        >
          Voltar ao início
        </Link>

        {/* Botão compacto de tela cheia (ícone + tecla) */}
        <FullscreenToggle
          isFull={isFull}
          onToggle={() => setIsFull((v) => !v)}
          className="h-8 w-8"
          title={isFull ? "Sair da tela cheia (Esc)" : "Tela cheia (F)"}
        />
      </div>

      {/* grade principal */}
      <div
        className={cn(
          "grid gap-4",
          // quando não está full: 12 colunas, gráfico 9, painel 3
          !isFull && "grid-cols-12",
          // em full: gráfico sozinho ocupando tudo
          isFull && "grid-cols-1"
        )}
      >
        {/* coluna do gráfico */}
        <section
          className={cn(
            "rounded-2xl border border-gray-800 bg-gray-900/50 p-2 sm:p-3",
            // largura quando não-full
            !isFull && "col-span-12 lg:col-span-9",
            // remove bordas internas em full para colar nas extremidades
            isFull && "p-0"
          )}
          // garante que o container ocupe a altura disponível
          style={{ minHeight: isFull ? "calc(100vh - 120px)" : "70vh" }}
        >
          <Chart
            symbol={symbol.replace("/", "")} // ex.: "BTCUSDT"
            interval="5"
            // em full, o chart deve preencher completamente
            fitParent
          />
        </section>

        {/* coluna do painel — escondido em tela cheia */}
        {!isFull && (
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-3">
              <TradePanel
                selectedSymbol={symbol}
                onChangeSymbol={(s: string) => {
                  // segurança para aceitar apenas itens da lista
                  if (PAIRS.includes(s as (typeof PAIRS)[number])) {
                    setSymbol(s as (typeof PAIRS)[number]);
                  }
                }}
                pairs={PAIRS as unknown as string[]}
              />
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
