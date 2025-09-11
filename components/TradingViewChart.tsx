"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView?: any;
  }
}

type Props = {
  symbol?: string;   // ex: "BINANCE:BTCUSDT"
  interval?: string; // ex: "60" (1h), "5" (5m)
  locale?: string;   // ex: "br"
  height?: number;
};

export default function TradingViewChart({
  symbol = "BINANCE:BTCUSDT",
  interval = "60",
  locale = "br",
  height = 460,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = () =>
      new Promise<void>((resolve) => {
        if (window.TradingView) return resolve();
        const s = document.createElement("script");
        s.src = "https://s3.tradingview.com/tv.js";
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

    let cancelled = false;
    load().then(() => {
      if (cancelled || !containerRef.current || !window.TradingView) return;
      // Limpa render anterior
      containerRef.current.innerHTML = "";
      // Cria widget
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale,
        container_id: containerRef.current,
        withdateranges: true,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        studies: [],
      });
    });
    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, interval, locale]);

  return (
    <div
      ref={containerRef as any}
      style={{ height }}
      className="w-full rounded-lg border border-gray-800 bg-gray-950"
    />
  );
}
