"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewWidget({ symbol = "BTCUSDT", interval = "5" }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current && window.TradingView) {
      new window.TradingView.widget({
        autosize: true,
        symbol: `BINANCE:${symbol}`,
        interval: interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "br",
        enable_publishing: false,
        hide_top_toolbar: false,
        container_id: container.current.id,
      });
    }
  }, [symbol, interval]);

  return <div id="tradingview_chart" ref={container} className="w-full h-full" />;
}
