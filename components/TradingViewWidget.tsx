// components/TradingViewWidget.tsx
'use client';

import { useEffect, useRef } from 'react';

type Props = {
  symbol: string;          // e.g. "BINANCE:BTCUSDT"
  interval?: string;       // "1", "5", "15", "60"...
  hideLegend?: boolean;
  height?: number | string;
};

export default function TradingViewWidget({
  symbol,
  interval = '5',
  hideLegend = true,
  height = '100%',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = 'tradingview-widget-script';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://s3.tradingview.com/tv.js';
      s.async = true;
      document.head.appendChild(s);
    }

    let disposed = false;

    const build = () => {
      if (disposed || !containerRef.current || !(window as any).TradingView) return;
      containerRef.current.innerHTML = '';
      // @ts-ignore
      new (window as any).TradingView.widget({
        autosize: true,
        symbol,
        interval,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        hide_legend: hideLegend,
        container_id: containerRef.current,
      });
    };

    const t = setInterval(() => {
      if ((window as any).TradingView) {
        clearInterval(t);
        build();
      }
    }, 100);

    return () => {
      disposed = true;
      clearInterval(t);
    };
  }, [symbol, interval, hideLegend]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}
