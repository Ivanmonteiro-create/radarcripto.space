"use client";

// app/simulador/page.tsx
import { useState } from "react";
import TradePanel, { type Pair } from "../components/TradePanel";
import IframeChart from "../components/IframeChart";

type TVInterval = "1m" | "5m" | "15m" | "1h" | "4h";

export default function Page() {
  const [symbol, setSymbol] = useState<Pair>("BTCUSDT");
  const [interval, setInterval] = useState<TVInterval>("60" as TVInterval); // vamos normalizar abaixo

  // normaliza valores aceitos pelo IframeChart
  const normalizedInterval: TVInterval =
    (["1m", "5m", "15m", "1h", "4h"] as TVInterval[]).includes(interval)
      ? interval
      : "1h";

  return (
    <main className="container" style={{ display: "grid", gap: 16 }}>
      <h2>Simulador</h2>

      <TradePanel
        symbol={symbol}
        onChangeSymbol={setSymbol}
        onBuy={(q) => console.log("BUY", symbol, q)}
        onSell={(q) => console.log("SELL", symbol, q)}
        onCloseAll={() => console.log("CLOSE ALL")}
        onReset={() => console.log("RESET")}
      />

      <div className="card">
        <div className="tabs" style={{ marginBottom: 12 }}>
          {(["1m", "5m", "15m", "1h", "4h"] as TVInterval[]).map((i) => (
            <button
              key={i}
              className={`tab ${normalizedInterval === i ? "active" : ""}`}
              onClick={() => setInterval(i)}
            >
              {i}
            </button>
          ))}
        </div>

        <IframeChart symbol={symbol} interval={normalizedInterval} height={620} />
      </div>
    </main>
  );
}
