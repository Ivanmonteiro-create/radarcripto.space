"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  /** Ex: "BINANCE:BTCUSDT" */
  symbol: string;
  /** Ex: "1", "30", "60", "240", "D" */
  interval: "1" | "30" | "60" | "240" | "D";
};

export default function TVChart({ symbol, interval }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // limpa qualquer embed anterior
    container.innerHTML = "";

    // cria o script oficial do TradingView
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    // configuração oficial (JSON em string no innerHTML)
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol, // ex: "BINANCE:BTCUSDT"
      interval, // "1"|"30"|"60"|"240"|"D"
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "br",
      enable_publishing: false,
      backgroundColor: "rgba(15, 23, 42, 0.65)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      studies: ["Volume@tv-basicstudies"],
      save_image: true,
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(script);

    // cleanup
    return () => {
      container.innerHTML = "";
    };
  }, [symbol, interval]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
