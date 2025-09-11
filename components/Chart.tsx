"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  symbol: string;     // ex.: "BTCUSDT" (vamos prefixar BINANCE:)
  interval?: string;  // ex.: "5", "15", "60"
};

export default function Chart({ symbol, interval = "5" }: Props) {
  const elRef = useRef<HTMLDivElement>(null);

  // id único que o TradingView exige no campo container_id (string)
  const containerId = useMemo(
    () => `tv-${Math.random().toString(36).slice(2)}`,
    []
  );

  useEffect(() => {
    const ensureScript = () =>
      new Promise<void>((resolve) => {
        const id = "tv-widget-script";
        let s = document.getElementById(id) as HTMLScriptElement | null;
        if (s && (window as any).TradingView) return resolve();
        if (!s) {
          s = document.createElement("script");
          s.id = id;
          s.src = "https://s3.tradingview.com/tv.js";
          s.async = true;
          s.onload = () => resolve();
          document.body.appendChild(s);
        } else {
          s.onload = () => resolve();
        }
      });

    let cancelled = false;

    ensureScript().then(() => {
      if (cancelled) return;
      // limpa qualquer instância se houver
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";

      // prefixa o exchange para evitar falhas silenciosas
      const fullSymbol = symbol.includes(":") ? symbol : `BINANCE:${symbol}`;

      // @ts-ignore
      new (window as any).TradingView.widget({
        container_id: containerId,
        symbol: fullSymbol,
        interval,
        autosize: true,          // ocupa 100% do contêiner pai
        theme: "dark",
        timezone: "Etc/UTC",
        allow_symbol_change: true,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        locale: "pt",
      });
    });

    return () => {
      cancelled = true;
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";
    };
  }, [containerId, symbol, interval]);

  // Nada de margens/paddings aqui — autosize depende do 100% real.
  return (
    <div
      id={containerId}
      ref={elRef}
      className="h-full w-full m-0 p-0"
      // fallback duro pra garantir altura mínima em alguns navegadores
      style={{ minHeight: 200 }}
    />
  );
}
