"use client";

import { useEffect, useRef } from "react";

type ChartProps = {
  symbol: string;          // ex.: "BINANCE:BTCUSDT"
  interval?: "1" | "3" | "5" | "15" | "30" | "60" | "120" | "240" | "D" | "W";
  theme?: "dark" | "light";
  autosize?: boolean;
  hideTopToolbar?: boolean;
  hideLegend?: boolean;
  // altura/largura são controladas pelo CSS do contêiner; sem attrs inválidos no DOM
};

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function Chart({
  symbol,
  interval = "5",
  theme = "dark",
  autosize = true,
  hideTopToolbar = false,
  hideLegend = false,
}: ChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // garante script do TV
    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (window.TradingView?.widget) return resolve();
        const id = "tv-script";
        if (document.getElementById(id)) {
          const check = () => {
            if (window.TradingView?.widget) resolve();
            else setTimeout(check, 80);
          };
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

    let destroyed = false;

    ensureScript().then(() => {
      if (destroyed || !containerRef.current) return;

      // limpa widget anterior
      if (widgetRef.current?.remove) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }

      widgetRef.current = new window.TradingView.widget({
        autosize,
        symbol,                // << aqui vai o par
        interval,              // << aqui vai o interval (não no DOM)
        theme,
        style: "1",
        timezone: "Etc/UTC",
        container_id: containerRef.current,
        allow_symbol_change: true,
        hide_top_toolbar: hideTopToolbar,
        hide_legend: hideLegend,
        withdateranges: true,
        studies: [],
        toolbar_bg: "rgba(0,0,0,0)",
        // bordas transparentes; o card/section do pai define o visual
        backgroundColor: "rgba(0,0,0,0)",
      });
    });

    return () => {
      destroyed = true;
      if (widgetRef.current?.remove) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [symbol, interval, theme, autosize, hideTopToolbar, hideLegend]);

  // o tamanho é 100% do contêiner — controlado via CSS na página
  return <div ref={containerRef} className="h-full w-full" />;
}
