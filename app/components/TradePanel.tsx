"use client";

// app/components/TradePanel.tsx
import { useState } from "react";

export type Pair = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";

type Props = {
  symbol: Pair;
  onChangeSymbol?: (pair: Pair) => void;
  onBuy?: (qty: number) => void;
  onSell?: (qty: number) => void;
  onCloseAll?: () => void;
  onReset?: () => void;
};

export default function TradePanel({
  symbol,
  onChangeSymbol,
  onBuy,
  onSell,
  onCloseAll,
  onReset,
}: Props) {
  const [qty, setQty] = useState(0.1);

  const pairs: Pair[] = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];

  return (
    <div className="card">
      <div className="row" style={{ alignItems: "center" }}>
        <div className="col">
          <strong>Par:</strong>
          <div className="tabs" style={{ marginTop: 8 }}>
            {pairs.map((p) => (
              <button
                key={p}
                className={`tab ${symbol === p ? "active" : ""}`}
                onClick={() => onChangeSymbol?.(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="col">
          <strong>Quantidade</strong>
          <div className="tabs" style={{ marginTop: 8 }}>
            {[0.1, 0.5, 1, 5].map((v) => (
              <button key={v} className="tab" onClick={() => setQty(v)}>{v}</button>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <input
              type="number"
              step="0.1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{
                width: 120, padding: 8, background: "#0b1219", color: "#e8eef6",
                border: "1px solid #2a3440", borderRadius: 8,
              }}
            />
          </div>
        </div>

        <div className="col" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button className="btn btn-green" onClick={() => onBuy?.(qty)}>Comprar</button>
          <button className="btn btn-red" onClick={() => onSell?.(qty)}>Vender</button>
          <button className="btn btn-gray" onClick={() => onCloseAll?.()}>Fechar posição</button>
          <button className="btn btn-gray" onClick={() => onReset?.()}>Resetar</button>
        </div>
      </div>
    </div>
  );
}
