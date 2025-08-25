"use client";

import { useState } from "react";
// IMPORTS CORRETOS (sem alias @ e sem subir diretórios demais)
import TradePanel from "../../components/TradePanel";
import IframeChart from "../../components/IframeChart";

// Tipos simples para o estado local
type Pair = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";
type TVInterval = "1" | "5" | "15" | "60" | "240";

export default function Page() {
  const [symbol, setSymbol] = useState<Pair>("BTCUSDT");
  const [interval, setInterval] = useState<TVInterval>("60");

  return (
    <div style={{ height: "100vh", boxSizing: "border-box" }}>
      {/* selo visual só para conferência de versão */}
      <div
        style={{
          position: "fixed",
          top: 8,
          left: 8,
          opacity: 0.5,
          fontSize: 12,
          background: "#000",
          color: "#fff",
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        simulador /page.tsx (imports ../../components)
      </div>

      {/* Painel acima (botões etc.) */}
      <div
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 16,
        }}
      >
        <div>
          <TradePanel
            symbol={symbol}
            onBuy={(qty) => console.log("buy", qty)}
            onSell={(qty) => console.log("sell", qty)}
            onCloseAll={() => console.log("close all")}
          />
        </div>

        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {/* troca de par */}
            {(["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"] as Pair[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setSymbol(p)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #333",
                    background: symbol === p ? "#1f7" : "#222",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {p}
                </button>
              )
            )}
            {/* troca de timeframe */}
            {(["1", "5", "15", "60", "240"] as TVInterval[]).map((i) => (
              <button
                key={i}
                onClick={() => setInterval(i)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #333",
                  background: interval === i ? "#17f" : "#222",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {i}m
              </button>
            ))}
          </div>

          {/* Gráfico */}
          <div style={{ height: "70vh" }}>
            <IframeChart symbol={symbol} interval={interval} />
          </div>
        </div>
      </div>
    </div>
  );
}
