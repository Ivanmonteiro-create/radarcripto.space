"use client";

import { useState } from "react";

export default function TradePanel() {
  const [qty, setQty] = useState<number>(0);
  const [pair, setPair] = useState("BTC/USDT");
  const [balance, setBalance] = useState(10000);

  function buy() {
    // stub: integre depois com o store do simulador
    alert(`Comprar ${qty} ${pair}`);
  }
  function sell() {
    alert(`Vender ${qty} ${pair}`);
  }
  function reset() {
    setQty(0);
    setPair("BTC/USDT");
    setBalance(10000);
  }

  return (
    <aside className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4 md:p-5 h-full">
      <h3 className="mb-4 text-gray-200 font-semibold">Controles de Trade</h3>

      <label className="block text-sm text-gray-400 mb-1">Par</label>
      <select
        value={pair}
        onChange={(e) => setPair(e.target.value)}
        className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:outline-none"
      >
        <option>BTC/USDT</option>
        <option>ETH/USDT</option>
        <option>SOL/USDT</option>
        <option>BNB/USDT</option>
      </select>

      <label className="block text-sm text-gray-400 mb-1">Quantidade</label>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100 focus:outline-none"
      />

      <div className="mb-4 text-sm text-gray-400">
        Saldo (demo): <span className="text-gray-100 font-medium">${balance.toLocaleString()}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={buy}
          className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-500"
        >
          Comprar
        </button>
        <button
          onClick={sell}
          className="flex-1 rounded-lg bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-500"
        >
          Vender
        </button>
      </div>

      <button
        onClick={reset}
        className="mt-3 w-full rounded-lg border border-gray-700 px-3 py-2 text-gray-200 hover:bg-gray-800"
      >
        Resetar
      </button>
    </aside>
  );
}
