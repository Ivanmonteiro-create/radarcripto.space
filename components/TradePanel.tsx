// components/TradePanel.tsx
"use client";

import { useState } from "react";

export default function TradePanel() {
  const [pair, setPair] = useState("BTCUSDT");
  const [qty, setQty] = useState<number | "">("");

  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="text-lg font-semibold mb-4">Controles de Trade</h2>

      <div className="space-y-3">
        <label className="block text-sm text-gray-300">
          Par
          <select
            className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none"
            value={pair}
            onChange={(e) => setPair(e.target.value)}
          >
            <option>BTCUSDT</option>
            <option>ETHUSDT</option>
            <option>XRPUSDT</option>
            <option>SOLUSDT</option>
            <option>BNBUSDT</option>
          </select>
        </label>

        <label className="block text-sm text-gray-300">
          Quantidade
          <input
            className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none"
            type="number"
            min="0"
            step="0.0001"
            value={qty}
            onChange={(e) =>
              setQty(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="0.0000"
          />
        </label>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium hover:bg-emerald-500">
            Comprar
          </button>
          <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium hover:bg-red-500">
            Vender
          </button>
        </div>

        <button
          className="mt-2 rounded-md border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800"
          onClick={() => setQty("")}
        >
          Resetar
        </button>

        <p className="mt-4 text-xs text-gray-400">Saldo (demo): $10.000</p>
      </div>

      {/* Espaçador para a coluna ficar “cheia” e rolar se preciso */}
      <div className="flex-1" />
    </div>
  );
}
