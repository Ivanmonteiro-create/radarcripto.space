// app/components/TVChart.tsx
"use client";

import React, { useMemo } from "react";

type Props = {
  exchange: "BINANCE" | "BITSTAMP" | "COINBASE";
  pair: "BTCUSDT" | "ETHUSDT" | "BNBUSDT" | "SOLUSDT" | "XRPUSDT";
  timeframe: "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d";
  height?: number | string;
};

// TradingView embed via widgetembed
export default function TVChart({ exchange, pair, timeframe, height = "100%" }: Props) {
  const tvSymbol = useMemo(() => {
    // Alguns pares em corretoras mudam sufixo; para este simulador vamos padronizar para USDT
    const map: Record<string, string> = {
      BINANCE: `BINANCE:${pair}`,
      BITSTAMP: `BITSTAMP:${pair.replace("USDT", "USD")}`, // bitstamp normalmente usa USD
      COINBASE: `COINBASE:${pair.replace("USDT", "USD")}`,
    };
    return map[exchange] ?? `BINANCE:${pair}`;
  }, [exchange, pair]);

  // timeframe → intervalo do TradingView
  const interval = useMemo(() => {
    const m = { "1m": "1", "5m": "5", "15m": "15", "30m": "30", "1h": "60", "4h": "240", "1d": "D" };
    return m[timeframe] ?? "60";
  }, [timeframe]);

  const src = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_${encodeURIComponent(
    tvSymbol
  )}&symbol=${encodeURIComponent(tvSymbol)}&interval=${interval}&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=rgba(0,0,0,0)&hideideas=1&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC`;

  return (
    <iframe
      title="TradingView"
      src={src}
      style={{ width: "100%", height, border: 0, borderRadius: 12, background: "#0b1220" }}
      allow="fullscreen"
    />
  );
}
