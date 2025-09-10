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
  const [tickers, setTickers] = useState<Ticker[]>(mockData);

  // no futuro aqui puxaremos da API real
  useEffect(() => {
    setTickers(mockData);
  }, []);

  return (
    <div className="bg-black text-white overflow-hidden whitespace-nowrap py-2">
      <div className="animate-marquee flex gap-6 px-4">
        {tickers.map((ticker) => (
          <span key={ticker.symbol} className="flex items-center gap-2">
            <strong>{ticker.symbol}:</strong> ${ticker.price.toLocaleString()}{" "}
            <span
              className={`${
                ticker.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {ticker.change}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
