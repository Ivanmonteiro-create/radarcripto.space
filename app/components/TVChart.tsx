'use client';

import React, { useEffect, useRef } from 'react';

export default function TVChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if ((window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT",
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "br",
          toolbar_bg: "#0b1222",
          enable_publishing: false,
          hide_side_toolbar: false,
          container_id: container.current!.id,
          studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies"], // indicadores ativos por padrão
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return <div id="tv_chart_container" ref={container} style={{ width: "100%", height: "100%" }} />;
}
