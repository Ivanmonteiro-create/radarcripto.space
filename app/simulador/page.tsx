"use client";

import { useState } from "react";
import TradePanel from "@/components/TradePanel";
import IframeChart from "@/components/IframeChart";

type Pair = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";
type TVInterval = "1" | "5" | "15" | "60" | "240";

export default function Page() {
  const [symbol, setSymbol] = useState<Pair>("BTCUSDT");
  const [interval, setInterval] = useState<TVInterval>("60");

  return (
    <div style={{ padding: 16 }}>
      {/* selo pequeno só para confirmar que esta é a versão nova */}
      <div
        style={{
          position: "fixed",
          top: 8,
          left: 8,
          opacity: 0.6,
          fontSize: 12,
          padding: "2px 6px",
          border: "1px solid #444",
          borderRadius: 6,
          background: "#111",
        }}
      >
        simulador • build OK
      </div>

      {/* seletor de par e timeframe */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {(["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"] as Pair[]).map((p) => (
          <button
            key={p}
            onClick={() => setSymbol(p)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #2a2a2a",
              background: symbol === p ? "#1f2937" : "#0f1216",
              cursor: "pointer",
            }}
          >
            {p}
          </button>
        ))}

        <span style={{ width: 12 }} />

        {(["1", "5", "15", "60", "240"] as TVInterval[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setInterval(tf)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #2a2a2a",
              background: interval === tf ? "#1f2937" : "#0f1216",
              cursor: "pointer",
            }}
          >
            {tf}m
          </button>
        ))}
      </div>

      {/* painel de trade (simulado) */}
      <TradePanel
        symbol={symbol}
        onBuy={(qty) => console.log("BUY", symbol, qty)}
        onSell={(qty) => console.log("SELL", symbol, qty)}
        onCloseAll={() => console.log("CLOSE ALL")}
      />

      {/* gráfico (TradingView via iframe) */}
      <div style={{ marginTop: 12 }}>
        <IframeChart symbol={symbol} interval={interval} height={680} />
      </div>
    </div>
  );
}
