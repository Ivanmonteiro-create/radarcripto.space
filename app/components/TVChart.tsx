// app/components/TVChart.tsx
// Componente simples para incorporar o gráfico do TradingView via <iframe>

type TVChartProps = {
  symbol?: string;   // ex.: "BTCUSD", "ETHUSD"
  interval?: string; // ex.: "60", "240", "D"
  style?: React.CSSProperties;
};

export default function TVChart({
  symbol = "BTCUSD",
  interval = "60",
  style,
}: TVChartProps) {
  const src = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
    symbol
  )}&interval=${encodeURIComponent(
    interval
  )}&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=[]&hideideas=1&theme=dark`;

  return (
    <iframe
      title="TradingView"
      src={src}
      style={{
        width: "100%",
        height: "100%",
        border: 0,
        ...style,
      }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
