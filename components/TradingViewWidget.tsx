// components/TradingViewWidget.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  symbol?: string;              // ex.: "BINANCE:BTCUSDT"
  interval?: string;            // ex.: "5", "15", "60", "D"
  hideLegend?: boolean;         // ex.: true
  hideTopToolbar?: boolean;     // ex.: false
  allowSymbolChange?: boolean;  // ex.: true
};

export default function TradingViewWidget({
  symbol = "BINANCE:BTCUSDT",
  interval = "5",
  hideLegend = true,
  hideTopToolbar = false,
  allowSymbolChange = true,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // id estável para o container (TradingView espera um id string)
  const containerId = useMemo(
    () => `tv_container_${Math.random().toString(36).slice(2)}`,
    []
  );

  useEffect(() => {
    const scriptId = "tradingview-widget-script";

    function createWidget() {
      // @ts-ignore
      if (window.TradingView && document.getElementById(containerId)) {
        // limpa antes de recriar
        const el = document.getElementById(containerId)!;
        el.innerHTML = "";

        // @ts-ignore
        new window.TradingView.widget({
          autosize: true,
          symbol,
          interval,
          container_id: containerId,
          theme: "dark",
          style: "1",
          locale: "br",
          hide_top_toolbar: hideTopToolbar,
          hide_legend: hideLegend,
          enable_publishing: false,
          allow_symbol_change: allowSymbolChange,
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
  }, [symbol, interval, hideLegend, hideTopToolbar, allowSymbolChange, containerId]);

  return <div id={containerId} ref={containerRef} className="w-full h-full" />;
}
