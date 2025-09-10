"use client";

import { useState } from "react";
import { useTrades } from "@/store/useTrades";
import { useSettings } from "@/store/useSettings";

export default function TradeControls() {
  const { addTrade, resetTrades } = useTrades();
  const { balance } = useSettings();

  const [pair, setPair] = useState("BTC/USDT");
  const [amount, setAmount] = useState(0);

  const executeTrade = (type: "buy" | "sell") => {
    if (amount <= 0) return;

    const trade = {
      id: Date.now().toString(),
      pair,
      type,
      amount,
      price: Math.random() * 1000, // placeholder
      timestamp: Date.now(),
    };

    addTrade(trade);
    setAmount(0);
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl shadow-md space-y-3">
      <h2 className="text-lg font-semibold">Controles de Trade</h2>

      <div className="space-y-2">
        <label className="block text-sm">Par</label>
        <select
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          className="w-full px-2 py-1 rounded text-black"
        >
          <option>BTC/USDT</option>
          <option>ETH/USDT</option>
          <option>SOL/USDT</option>
          <option>BNB/USDT</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm">Quantidade</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-2 py-1 rounded text-black"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => executeTrade("buy")}
          className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg"
        >
          Comprar
        </button>
        <button
          onClick={() => executeTrade("sell")}
          className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
        >
          Vender
        </button>
      </div>

      <button
        onClick={resetTrades}
        className="w-full bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg"
      >
        Resetar
      </button>

      <p className="text-sm text-gray-300">Saldo atual: ${balance}</p>
    </div>
  );
}
