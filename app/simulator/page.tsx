"use client";

import { useState } from "react";
import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";

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
  const [symbol, setSymbol] = useState(PAIRS[0].symbol);

  return (
    // O id 'sim-root' é usado pelo botão de Tela Cheia
    <main id="sim-root" className="mx-auto w-full max-w-none px-0">
      {/* GRID ocupa a tela inteira abaixo da navbar */}
      <section
        className="
          grid h-[calc(100vh-64px)]
          grid-cols-1 gap-4
          md:grid-cols-[1fr_360px]
          px-3 md:px-6
        "
      >
        {/* Gráfico: bordas bem sutis; ocupa todo o espaço sobrando */}
        <div className="chart-card rounded-2xl border border-gray-800 bg-gray-900/30 p-2 md:p-3">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <Chart symbol={symbol} interval="5" theme="dark" autosize hideLegend />
          </div>
        </div>

        {/* Painel lateral */}
        <TradePanel pairs={PAIRS} selected={symbol} onChangePair={setSymbol} />
      </section>

      {/* Nenhum rodapé com links duplicados aqui */}
    </main>
  );
}
