"use client";
import { useEffect, useRef } from "react";

export default function Chart({
  symbol,
  interval = "5",
}: {
  symbol: string;
  interval?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerId = "tv_" + Math.random().toString(36).slice(2);

    // garante 100% no contêiner
    containerRef.current.id = containerId;
    containerRef.current.style.width = "100%";
    containerRef.current.style.height = "100%";
    containerRef.current.style.margin = "0";
    containerRef.current.style.padding = "0";

    // @ts-ignore - widget global do TradingView
    new window.TradingView.widget({
      autosize: true,               // <— crucial para ocupar tudo
      container_id: containerId,
      symbol,                       // ex.: "BINANCE:BTCUSDT"
      interval,                     // "5"
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "br",
      toolbar_bg: "#0b0f12",
      hide_side_toolbar: false,
      withdateranges: true,
      details: false,
      allow_symbol_change: false,
      studies: [],
      // evita sobra por causa de borda/padding default
      custom_css_url: "",
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, interval]);

  return (
    <div className="h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
