"use client";

import { useState } from "react";

type TradePanelProps = {
  /** ex: "BTCUSDT" */
  pair: string;
};

export default function TradePanel({ pair }: TradePanelProps) {
  const [qty, setQty] = useState<number>(0);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
      <h2 className="mb-3 text-lg font-semibold">Controles de Trade</h2>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-gray-300">Par</label>
        <div className="rounded-md border border-gray-700 bg-gray-900 px-2 py-2 text-sm">{pair.replace("USDT", "/USDT")}</div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm text-gray-300">Quantidade</label>
        <input
          inputMode="decimal"
          value={qty}
          onChange={(e) => setQty(Number(e.target.value || 0))}
          className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 outline-none"
          placeholder="0"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold hover:bg-emerald-700">Comprar</button>
        <button className="rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-700">Vender</button>
        <button className="rounded-md border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800">Resetar</button>
      </div>

      <p className="mt-4 text-xs text-gray-400">Saldo (demo): $10 000</p>
    </div>
  );
}
