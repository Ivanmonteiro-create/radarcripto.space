"use client";

type Props = {
  symbol: string;       // ex.: "BTCUSDT"
  interval?: string;    // "1", "5", "15", "60", etc (opcional)
};

export default function Chart({ symbol, interval = "5" }: Props) {
  // TradingView embed via iframe. Ajuste de corretora “BINANCE:<PAR>”
  const params = new URLSearchParams({
    symbol: `BINANCE:${symbol}`,
    interval,         // timeframe inicial; os botões do TV continuam funcionando
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
      className="absolute inset-0 w-full h-full"
      style={{ border: 0 }}
      allow="clipboard-write; fullscreen"
      allowFullScreen
      title="Gráfico TradingView"
    />
  );
}
