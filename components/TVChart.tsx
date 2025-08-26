// components/TVChart.tsx
type Props = {
  symbol?: string;
  interval?: string; // ex: "60" (1h), "D", "W"
};

export default function TVChart({
  symbol = "BINANCE:BTCUSDT",
  interval = "60"
}: Props) {
  const src = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
    symbol
  )}&interval=${encodeURIComponent(
    interval
  )}&hidesidetoolbar=1&symboledit=1&saveimage=0&theme=dark&style=1&timezone=Etc%2FUTC&studies=&hide_legend=1&enable_publishing=0&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=1&details=0&hotlist=0&calendar=0`;

  return (
    <iframe
      title="TradingView"
      src={src}
      width="100%"
      height="640"
      style={{ border: "1px solid #27272a", borderRadius: 12 }}
      loading="lazy"
      allowFullScreen
    />
  );
}
