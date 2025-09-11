"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbol?: string; // ex: "BINANCE:BTCUSDT"
  interval?: string; // ex: "5"
  studies?: string[]; // indicadores
};

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart({
  symbol = "BINANCE:BTCUSDT",
  interval = "5",
  studies = [],
}: Props) {
  const containerId = useRef(`tv_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    // carrega o script apenas no cliente
    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (window.TradingView) return resolve();
        const s = document.createElement("script");
        s.src = "https://s3.tradingview.com/tv.js";
        s.async = true;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    ensureScript().then(() => {
      // limpa instância anterior, se houver
      const el = document.getElementById(containerId.current);
      if (!el) return;
      el.innerHTML = "";

      // cria widget
      /* eslint-disable new-cap */
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "br",
        enable_publishing: false,
        hide_legend: false,
        hide_side_toolbar: false,
        save_image: false,
        container_id: containerId.current,
        studies,
        allow_symbol_change: true,
        withdateranges: true,
        details: false,
        calendar: false,
      });
      /* eslint-enable */
    });

    // nada para desmontar — o TV gerencia internamente
  }, [symbol, interval, studies]);

  return <div id={containerId.current} className="h-full w-full" />;
}
