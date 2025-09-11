"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbol: string;          // ex.: "BINANCE:BTCUSDT"
  interval?: string;       // ex.: "5"
  height?: number | string;
};

export default function Chart({ symbol, interval = "5", height = 520 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // @ts-ignore - script externo do TradingView
    const tv = new (window as any).TradingView.widget({
      autosize: true,
      symbol,
      interval,
      container_id: ref.current.id,
      theme: "dark",
      style: "1",
      locale: "br",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: [],
    });

    return () => {
      try {
        // alguns widgets expõem remove()
        tv?.remove?.();
      } catch {}
    };
  }, [symbol, interval]);

  return (
    <div
      id="tv-container"
      ref={ref}
      style={{ width: "100%", height: typeof height === "number" ? `${height}px` : height }}
      className="rounded-xl border border-gray-800 bg-black/40"
    />
  );
}
