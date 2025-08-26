"use client";

type Props = {
  symbol: string;   // exemplo: "BINANCE:BTCUSDT" ou "BITSTAMP:BTCUSD"
  interval: string; // "1","5","15","60","240","D"
  height?: number | string;
};

export default function TVChart({ symbol, interval, height = "100%" }: Props) {
  // URL oficial do widget embed do TradingView
  const src = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_e&symbol=${encodeURIComponent(
    symbol
  )}&interval=${encodeURIComponent(
    interval
  )}&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=rgba(0,0,0,0)&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1&hideideas=1`;

  return (
    <iframe
      title="TradingView"
      src={src}
      style={{ width: "100%", height, border: "0" }}
      allowFullScreen
    />
  );
}
