"use client";
import { useEffect, useRef } from "react";

type ChartProps = {
  symbol: string;  // ex.: "BINANCE:BTCUSDT"
  interval?: "1" | "3" | "5" | "15" | "30" | "60" | "120" | "240" | "D" | "W";
  theme?: "dark" | "light";
  autosize?: boolean;
  hideTopToolbar?: boolean;
  hideLegend?: boolean;
};

declare global { interface Window { TradingView: any } }

export default function Chart({
  symbol,
  interval = "5",
  theme = "dark",
  autosize = true,
  hideTopToolbar = false,
  hideLegend = true,
}: ChartProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const ensure = () =>
      new Promise<void>((resolve) => {
        if (window.TradingView?.widget) return resolve();
        const id = "tv-script";
        if (document.getElementById(id)) {
          const check = () => (window.TradingView?.widget ? resolve() : setTimeout(check, 60));
          check();
          return;
        }
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://s3.tradingview.com/tv.js";
        s.async = true;
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

    let disposed = false;
    ensure().then(() => {
      if (disposed || !elRef.current) return;
      if (widgetRef.current?.remove) widgetRef.current.remove();

      widgetRef.current = new window.TradingView.widget({
        container_id: elRef.current,
        symbol,
        interval,
        autosize,
        theme,
        hide_top_toolbar: hideTopToolbar,
        hide_legend: hideLegend,
        timezone: "Etc/UTC",
        style: "1",
        backgroundColor: "rgba(0,0,0,0)",
        toolbar_bg: "rgba(0,0,0,0)",
      });
    });

    return () => {
      disposed = true;
      if (widgetRef.current?.remove) widgetRef.current.remove();
    };
  }, [symbol, interval, theme, autosize, hideTopToolbar, hideLegend]);

  return <div ref={elRef} className="h-full w-full" />;
}
