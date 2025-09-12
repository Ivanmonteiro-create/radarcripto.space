"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Importa o gráfico da TradingView dinamicamente (SSR off)
const TradingViewWidget = dynamic(() => import("@/components/TradingViewWidget"), { ssr: false });

export default function SimuladorPage() {
  const [balance, setBalance] = useState(10000);
  const [quantity, setQuantity] = useState(0);
  const [trades, setTrades] = useState<string[]>([]);

  const handleBuy = () => {
    const newTrade = `Comprou ${quantity} BTCUSDT`;
    setTrades([newTrade, ...trades]);
    setQuantity(0);
  };

  const handleSell = () => {
    const newTrade = `Vendeu ${quantity} BTCUSDT`;
    setTrades([newTrade, ...trades]);
    setQuantity(0);
  };

  const handleReset = () => {
    setBalance(10000);
    setTrades([]);
    setQuantity(0);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Título */}
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-500">RadarCripto — Simulador</h1>
      </header>

      {/* Layout principal */}
      <div className="flex flex-1">
        {/* Gráfico (lado esquerdo, ocupa mais espaço) */}
        <div className="flex-1 border-r border-gray-800">
          <TradingViewWidget symbol="BTCUSDT" interval="5" />
        </div>

        {/* Painel de Trade (lado direito) */}
        <aside className="w-80 p-4 bg-gray-900">
          <h2 className="text-xl font-bold mb-4">Controles de Trade</h2>
          <div className="mb-2">
            <label className="block mb-1">Par:</label>
            <p className="font-mono">BTC/USDT</p>
          </div>

          <div className="mb-2">
            <label className="block mb-1">Quantidade:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-2 rounded bg-black border border-gray-700"
            />
          </div>

          <div className="mb-4">
            <p>💰 Saldo (demo): ${balance.toLocaleString()}</p>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleBuy}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Comprar
            </button>
            <button
              onClick={handleSell}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Vender
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Resetar
          </button>

          {/* Histórico */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Histórico</h3>
            <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
              {trades.map((t, i) => (
                <li key={i} className="border-b border-gray-700 pb-1">{t}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
