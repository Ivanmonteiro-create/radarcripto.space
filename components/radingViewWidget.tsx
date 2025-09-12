'use client';

type Props = {
  /** Ex.: 'BTCUSDT' */
  symbol: string;
  /** Ex.: '5m' (opcional) */
  interval?: string;
  /** Ocultar legenda do TradingView (opcional) */
  hideLegend?: boolean;
  className?: string;
};

export default function TradingViewWidget({
  symbol,
  interval = '5m',
  hideLegend = true,
  className = '',
}: Props) {
  // Embed simples do TradingView: não precisa de libs externas, funciona em qualquer build
  const src = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
    `BINANCE:${symbol}`
  )}&interval=${encodeURIComponent(
    interval
  )}&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=1&saveimage=0&theme=dark&studies=[]&hidelegend=${
    hideLegend ? 1 : 0
  }`;

  return (
    <iframe
      title="TradingView Chart"
      className={`w-full h-full rounded-xl ${className}`}
      src={src}
      frameBorder="0"
      allow="clipboard-read; clipboard-write; fullscreen; web-share"
    />
  );
}
