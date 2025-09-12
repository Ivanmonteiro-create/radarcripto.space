// components/TradingViewWidget.tsx
'use client';

import { useEffect, useRef } from 'react';

type Props = {
  symbol: string;          // ex: "BINANCE:BTCUSDT"
  interval?: string;       // ex: "5" (5m), "60" (1h)
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
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      document.head.appendChild(script);
    }

    let cancelled = false;

    function createWidget() {
      if (cancelled || !containerRef.current || !(window as any).TradingView) return;

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
        toolbar_bg: '#000000',
        hide_top_toolbar: false,
        hide_legend: hideLegend,
        container_id: containerRef.current,
      });
    }

    const timer = setInterval(() => {
      if ((window as any).TradingView) {
        clearInterval(timer);
        createWidget();
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [symbol, interval, hideLegend]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}
