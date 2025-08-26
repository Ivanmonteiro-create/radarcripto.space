"use client";

type Props = {
  symbol: string;     // ex: "BINANCE:BTCUSDT"
  interval: string;   // "1","5","15","60","240","D"
};

export default function TVChart({ symbol, interval }: Props) {
  // usamos o widget embed oficial via iframe com parâmetros
  const src = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
    symbol
  )}&interval=${encodeURIComponent(
    interval
  )}&theme=dark&style=1&locale=br&timezone=Etc%2FUTC&hide_top_toolbar=false&hide_side_toolbar=false&allow_symbol_change=true&withdateranges=true&studies=[]`;

  return (
    <iframe
      title="TradingView"
      src={src}
      style={{
        border: "0",
        width: "100%",
        height: "100%",
        display: "block",
      }}
      allow="fullscreen"
    />
  );
}
