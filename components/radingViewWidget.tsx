'use client';

import { useEffect, useRef } from 'react';

type Props = {
  symbol: string;          // ex: 'BTCUSDT'
  interval?: string;       // ex: '5' (minutos)
  hideLegend?: boolean;
};

export default function TradingViewWidget({
  symbol,
  interval = '5',
  hideLegend = true,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // limpa qualquer embed anterior ao trocar o par
    ref.current.innerHTML = '';

    const iframe = document.createElement('iframe');
    const tvSymbol = `${symbol}`; // já vem como 'BTCUSDT'

    // URL do widget avançado
    const url = new URL('https://s.tradingview.com/widgetembed/');
    url.searchParams.set('frameElementId', 'tradingview_advanced');
    url.searchParams.set('symbol', tvSymbol);
    url.searchParams.set('interval', interval);
    url.searchParams.set('locale', 'br');
    url.searchParams.set('timezone', 'Etc/UTC');
    url.searchParams.set('theme', 'dark');
    url.searchParams.set('style', '1'); // candles
    url.searchParams.set('hide_legend', hideLegend ? 'true' : 'false');
    url.searchParams.set('hide_side_toolbar', 'false');
    url.searchParams.set('withdateranges', 'true');
    url.searchParams.set('allow_symbol_change', 'false');

    iframe.src = url.toString();
    iframe.id = 'tradingview_advanced';
    iframe.style.border = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    ref.current.appendChild(iframe);
  }, [symbol, interval, hideLegend]);

  return <div ref={ref} className="w-full h-full" />;
}
