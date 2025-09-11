"use client";

import { useEffect, useState } from "react";

interface Ticker {
  symbol: string;
  price: number;
  change: number;
}

const mockData: Ticker[] = [
  { symbol: "BTC", price: 68000, change: 1.2 },
  { symbol: "ETH", price: 3500, change: -0.5 },
  { symbol: "SOL", price: 150, change: 0.8 },
  { symbol: "BNB", price: 600, change: 0.3 },
  { symbol: "ADA", price: 0.45, change: -1.1 },
  { symbol: "XRP", price: 0.55, change: 2.0 },
  { symbol: "LINK", price: 14, change: 0.4 },
  { symbol: "DOGE", price: 0.1, change: -0.2 },
];

export default function TickerMarquee() {
  const [tickers, setTickers] = useState<Ticker[]>([]);

  useEffect(() => {
    setTickers(mockData);
  }, []);

  return (
    <div className="border-y border-gray-800 bg-black/90 text-white">
      <div className="mx-auto max-w-6xl px-4 py-2 overflow-x-auto">
        <div className="flex gap-6 text-xs md:text-sm min-w-max">
          {tickers.map((t) => (
            <span key={t.symbol} className="flex items-center gap-2">
              <strong>{t.symbol}:</strong> ${t.price.toLocaleString()}
              <span className={t.change >= 0 ? "text-emerald-400" : "text-red-400"}>
                {t.change}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
