// /components/MarketTicker.js
import { useEffect, useState } from "react";

const base = [
  { pair: "BTC/USDT", price: 60250, change: +0.4 },
  { pair: "ETH/USDT", price: 2450, change: -0.2 },
  { pair: "SOL/USDT", price: 142.2, change: +1.1 },
  { pair: "BNB/USDT", price: 562.8, change: +0.3 },
  { pair: "ADA/USDT", price: 0.58, change: -0.6 },
];

export default function MarketTicker() {
  const [rows, setRows] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const drift = r.price * (Math.random() - 0.5) * 0.0008;
          const price = Math.max(0.0001, r.price + drift);
          const change = ((price - r.price) / r.price) * 100;
          return { ...r, price: Number(price.toFixed(2)), change: Number(change.toFixed(2)) };
        })
      );
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ margin: "18px auto 0", maxWidth: 1180, padding: "0 16px" }}>
      <div
        style={{
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          {rows.map((r, i) => (
            <div
              key={r.pair}
              style={{
                padding: "12px 14px",
                borderRight: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 6 }}>{r.pair}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <div style={{ fontWeight: 700, color: "#e2e8f0" }}>${r.price}</div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: r.change >= 0 ? "#22c55e" : "#ef4444",
                  }}
                >
                  {r.change >= 0 ? "▲" : "▼"} {Math.abs(r.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", opacity: 0.8, marginTop: 8 }}>
        * Dados simulados para demonstração — sem conexão a mercado ainda.
      </div>
    </div>
  );
}
