"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbol?: string;       // ex: "BINANCE:BTCUSDT"
  interval?: string;     // ex: "5"
  studies?: string[];    // indicadores
  height?: number | string; // opcional: força altura
  width?: number | string;  // opcional: força largura
  className?: string;       // opcional: classes extras
};

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart({
  symbol = "BINANCE:BTCUSDT",
  interval = "5",
  studies = [],
  height,
  width,
  className = "",
}: Props) {
  const containerId = useRef(`tv_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (typeof window !== "undefined" && window.TradingView) return resolve();
        const existing = document.querySelector<HTMLScriptElement>('script[src="https://s3.tradingview.com/tv.js"]');
        if (existing) {
          existing.onload = () => resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = "https://s3.tradingview.com/tv.js";
        s.async = true;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    ensureScript().then(() => {
      const el = document.getElementById(containerId.current);
      if (!el || !window.TradingView) return;
      el.innerHTML = ""; // limpa instância anterior

      /* eslint-disable new-cap */
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "br",
        enable_publishing: false,
        hide_legend: false,
        hide_side_toolbar: false,
        save_image: false,
        container_id: containerId.current,
        studies,
        allow_symbol_change: true,
        withdateranges: true,
        details: false,
        calendar: false,
      });
      /* eslint-enable */
    });
  }, [symbol, interval, studies]);

  return (
    <div
      id={containerId.current}
      className={`w-full h-full ${className}`}
      style={{
        height: height ?? "100%",
        width: width ?? "100%",
      }}
    />
  );
}
