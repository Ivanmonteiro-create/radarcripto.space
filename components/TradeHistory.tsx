"use client";

import { useTrades } from "@/store/useTrades";

export default function TradeHistory() {
  const { trades } = useTrades();

  if (trades.length === 0) {
    return <p className="text-gray-400">Nenhum trade ainda.</p>;
  }

  return (
    <div className="mt-4 bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Histórico de Trades</h2>
      <ul className="space-y-2">
        {trades.map((trade) => (
          <li
            key={trade.id}
            className="flex justify-between items-center border-b last:border-none py-2"
          >
            <span>{trade.pair}</span>
            <span
              className={`${
                trade.type === "buy" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trade.type.toUpperCase()}
            </span>
            <span>{trade.amount}</span>
            <span>${trade.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
