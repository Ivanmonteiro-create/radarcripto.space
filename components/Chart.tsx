"use client";

type Props = {
  /** Ex.: "BTCUSDT" */
  symbol: string;
  /** Ex.: "5" (para 5m), "60" (para 1h). Padrão "5". */
  interval?: string;
  className?: string;
};

export default function Chart({ symbol, interval = "5", className = "" }: Props) {
  // IMPORTANTÍSSIMO: interval precisa ser string, não boolean!
  // Se usar <Chart interval /> em JSX, vira true e dá o erro que você viu.

  const params = new URLSearchParams({
    symbol: `BINANCE:${symbol}`,
    interval,
    theme: "dark",
    style: "1",
    locale: "pt_BR",
    hide_side_toolbar: "false",
    hide_top_toolbar: "false",
    enable_publishing: "false",
    allow_symbol_change: "true",
    withdateranges: "true",
    save_image: "false",
    studies: "",
  });

  return (
    <iframe
      src={`https://s.tradingview.com/widgetembed/?${params.toString()}`}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ border: 0 }}
      allow="clipboard-write; fullscreen"
      allowFullScreen
      title="Gráfico TradingView"
    />
  );
}
