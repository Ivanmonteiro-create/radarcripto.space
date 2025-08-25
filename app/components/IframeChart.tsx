"use client";

type Symbol = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";
type TvInterval = "1" | "5" | "15" | "60" | "240";

const TV_SYMBOL: Record<Symbol, string> = {
  BTCUSDT: "BINANCE:BTCUSDT",
  ETHUSDT: "BINANCE:ETHUSDT",
  SOLUSDT: "BINANCE:SOLUSDT",
  BNBUSDT: "BINANCE:BNBUSDT",
};

const TV_INTERVAL: Record<TvInterval, string> = {
  "1": "1",
  "5": "5",
  "15": "15",
  "60": "60",
  "240": "240",
};

export default function IframeChart({
  symbol,
  interval,
  height = 680,
}: {
  symbol: Symbol;
  interval: TvInterval;
  height?: number;
}) {
  const tvSym = TV_SYMBOL[symbol];
  const tvInt = TV_INTERVAL[interval];

  // iframe oficial (embed widget TV)
  const src =
    "https://s.tradingview.com/widgetembed/?" +
    `symbol=${encodeURIComponent(tvSym)}` +
    `&interval=${encodeURIComponent(tvInt)}` +
    "&theme=dark&style=1&timezone=Etc/UTC" +
    "&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=1&saveimage=0";

  return (
    <iframe
      title="TradingView Chart"
      src={src}
      style={{
        width: "100%",
        height,
        border: "1px solid #27272a",
        borderRadius: 12,
      }}
      frameBorder={0}
      allow="clipboard-write; fullscreen; autoplay; encrypted-media"
    />
  );
}
