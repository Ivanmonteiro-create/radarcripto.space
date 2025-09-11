"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbol: string;          // ex: "BTCUSDT"
  interval?: "1" | "3" | "5" | "15" | "30" | "60" | "240" | "D" | "W" | "M";
};

export default function Chart({ symbol, interval = "5" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef("tv-" + Math.random().toString(36).slice(2));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.id = idRef.current;
    el.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // @ts-ignore - lib global do TradingView
      new TradingView.widget({
        autosize: true,
        symbol: `BINANCE:${symbol}`,
        interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "br",
        container_id: idRef.current,
        hide_top_toolbar: false,
        hide_legend: false,
        withdateranges: true,
        allow_symbol_change: true,
        save_image: false,
        details: false,
        calendar: false,
      });
    };
    el.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, interval]);

  return <div ref={containerRef} className="h-full w-full" />;
}
