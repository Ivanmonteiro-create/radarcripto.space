"use client";

// app/components/IframeChart.tsx
type Symbol = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";
type TvInterval = "1m" | "5m" | "15m" | "1h" | "4h";

const TV_SYMBOL: Record<Symbol, string> = {
  BTCUSDT: "BINANCE:BTCUSDT",
  ETHUSDT: "BINANCE:ETHUSDT",
  SOLUSDT: "BINANCE:SOLUSDT",
  BNBUSDT: "BINANCE:BNBUSDT",
};

const TV_INTERVAL: Record<TvInterval, string> = {
  "1m": "1",
  "5m": "5",
  "15m": "15",
  "1h": "60",
  "4h": "240",
};

export default function IframeChart({
  symbol,
  interval,
  height = 600,
}: {
  symbol: Symbol;
  interval: TvInterval;
  height?: number;
}) {
  const s = encodeURIComponent(TV_SYMBOL[symbol]);
  const i = TV_INTERVAL[interval];

  const src =
    "https://s.tradingview.com/widgetembed/?frameElementId=tradingview_"
    + "&symbol=" + s
    + "&interval=" + i
    + "&hide_top_toolbar=1&hide_legend=0&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&allow_symbol_change=1&saveimage=0";

  return (
    <iframe
      title="TradingView Chart"
      src={src}
      style={{ width: "100%", height, border: "1px solid #27303a", borderRadius: 12 }}
      allowFullScreen
    />
  );
}
