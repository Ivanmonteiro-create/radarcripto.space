"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbol: string;
  interval?: string; // ex.: "5", "15", "60"
};

export default function Chart({ symbol, interval = "5" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // carrega script do TradingView uma única vez
    const scriptId = "tv-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    const init = () => {
      // @ts-ignore
      if (typeof TradingView === "undefined") return;
      // limpa instância anterior
      containerRef.current!.innerHTML = "";

      // @ts-ignore
      new TradingView.widget({
        container_id: containerRef.current!,
        symbol,                  // ex.: "BTCUSDT"
        interval,                // ex.: "5"
        autosize: true,          // ocupa 100% do contêiner
        theme: "dark",
        timezone: "Etc/UTC",
        allow_symbol_change: true,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        locale: "pt",
        studies: [],
      });
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }

    return () => {
      // desmonta gráfico ao trocar rota/parâmetros
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, interval]);

  // NENHUMA margem/padding: o autosize usa 100% desse contêiner
  return <div ref={containerRef} className="h-full w-full m-0 p-0" />;
}
