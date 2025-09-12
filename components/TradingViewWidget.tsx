// components/TradingViewWidget.tsx
"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbol?: string;   // ex.: "BINANCE:BTCUSDT"
  interval?: string; // ex.: "5", "15", "60", "D"
};

export default function TradingViewWidget({
  symbol = "BINANCE:BTCUSDT",
  interval = "5",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "tradingview-widget-script";

    function createWidget() {
      // @ts-ignore
      if (window.TradingView && containerRef.current) {
        // Limpa o container antes de recriar (evita widgets empilhados)
        containerRef.current.innerHTML = "";

        // @ts-ignore
        new window.TradingView.widget({
          autosize: true,
          symbol,
          interval,
          container_id: containerRef.current,
          theme: "dark",
          style: "1",
          locale: "br",
          hide_top_toolbar: false,
          hide_legend: true,
          enable_publishing: false,
          allow_symbol_change: true,
          studies: [],
          withdateranges: true,
          toolbar_bg: "rgba(0,0,0,0)",
        });
      }
    }

    // carrega script uma única vez
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      document.head.appendChild(script);
    } else {
      createWidget();
    }

    // Recria ao mudar símbolo/intervalo
  }, [symbol, interval]);

  return (
    <div className="w-full h-full" ref={containerRef} />
  );
}
