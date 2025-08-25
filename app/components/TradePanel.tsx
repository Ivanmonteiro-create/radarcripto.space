"use client";

import { useState, useMemo } from "react";

export type Symbol = "BTCUSDT" | "ETHUSDT" | "SOLUSDT" | "BNBUSDT";

type Props = {
  symbol: Symbol;
  onBuy?: (qty: number) => void;
  onSell?: (qty: number) => void;
  onCloseAll?: () => void;
};

export default function TradePanel({
  symbol,
  onBuy,
  onSell,
  onCloseAll,
}: Props) {
  const [qty, setQty] = useState<number>(0.1);

  const title = useMemo(() => {
    const mapName: Record<Symbol, string> = {
      BTCUSDT: "Bitcoin",
      ETHUSDT: "Ethereum",
      SOLUSDT: "Solana",
      BNBUSDT: "BNB",
    };
    return `${mapName[symbol]} (${symbol})`;
  }, [symbol]);

  function buy() {
    onBuy ? onBuy(qty) : console.log("BUY", symbol, qty);
  }
  function sell() {
    onSell ? onSell(qty) : console.log("SELL", symbol, qty);
  }
  function closeAll() {
    onCloseAll ? onCloseAll() : console.log("CLOSE ALL", symbol);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 8,
        gridTemplateColumns: "repeat(12, 1fr)",
        alignItems: "center",
        background: "#12151a",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div style={{ gridColumn: "span 12", fontWeight: 600, color: "#e8eef6" }}>
        {title}
      </div>

      {/* quantidade */}
      <label style={{ gridColumn: "span 2", fontSize: 14, color: "#a1a1aa" }}>
        Quantidade
      </label>
      <input
        value={qty}
        onChange={(e) => setQty(Number(e.target.value) || 0)}
        type="number"
        step="0.1"
        min="0"
        style={{
          gridColumn: "span 3",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #2a2a2a",
          background: "#0f1216",
          color: "#e8eef6",
          outline: "none",
        }}
      />

      {/* presets */}
      <div style={{ gridColumn: "span 7", display: "flex", gap: 6 }}>
        {[0.1, 0.5, 1, 5].map((v) => (
          <button
            key={v}
            onClick={() => setQty(v)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #2a2a2a",
              background: qty === v ? "#1f2937" : "#0f1216",
              cursor: "pointer",
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* ações */}
      <div style={{ gridColumn: "span 12", display: "flex", gap: 8, marginTop: 4 }}>
        <button
          onClick={buy}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #064e3b",
            background: "#065f46",
            color: "#e8eef6",
            cursor: "pointer",
          }}
        >
          Comprar
        </button>
        <button
          onClick={sell}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #7f1d1d",
            background: "#991b1b",
            color: "#e8eef6",
            cursor: "pointer",
          }}
        >
          Vender
        </button>
        <button
          onClick={closeAll}
          style={{
            width: 160,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #2a2a2a",
            background: "#0f1216",
            color: "#e8eef6",
            cursor: "pointer",
          }}
        >
          Fechar posição
        </button>
      </div>
    </div>
  );
}
