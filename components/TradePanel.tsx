"use client";

import { useState } from "react";

type Pair = { label: string; symbol: string };
type Props = {
  pairs: Pair[];
  selected: string;
  onChangePair: (symbol: string) => void;
};

export default function TradePanel({ pairs, selected, onChangePair }: Props) {
  const [qty, setQty] = useState<number | "">("");

  return (
    <aside className="side-panel rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-100">Controles de Trade</h2>

      <label className="mb-1 block text-sm text-gray-300">Par</label>
      <select
        value={selected}
        onChange={(e) => onChangePair(e.target.value)}
        className="mb-4 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100"
      >
        {pairs.map((p) => (
          <option key={p.symbol} value={p.symbol}>
            {p.label}
          </option>
        ))}
      </select>

      <label className="mb-1 block text-sm text-gray-300">Quantidade</label>
      <input
        type="number"
        inputMode="decimal"
        value={qty}
        onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder="0"
        className="mb-4 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-gray-100"
      />

      <div className="flex gap-2">
        <button className="flex-1 rounded-md bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-500">
          Comprar
        </button>
        <button className="flex-1 rounded-md bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-500">
          Vender
        </button>
      </div>

      <button
        onClick={() => setQty("")}
        className="mt-3 w-full rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
      >
        Resetar
      </button>

      <p className="mt-4 text-xs text-gray-400">Saldo (demo): $10 000</p>
    </aside>
  );
}
