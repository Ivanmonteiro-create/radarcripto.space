// app/components/TradePanel.tsx
"use client";

import React, { useMemo, useState } from "react";

type Side = "BUY" | "SELL";

export default function TradePanel() {
  // estado da “carteira” do aluno
  const [credits, setCredits] = useState(100_000);
  const [realized, setRealized] = useState(0);

  // ordem atual
  const [side, setSide] = useState<Side>("BUY");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(10_000);

  // posição aberta (simples: 1 posição por vez)
  const [posQty, setPosQty] = useState(0);
  const [avgPrice, setAvgPrice] = useState<number | null>(null);

  // fills (histórico)
  const [fills, setFills] = useState<
    { time: string; side: Side; qty: number; price: number }[]
  >([]);

  const markPrice = price; // usamos o preço do input como mark para o PnL não realizado
  const unrealized = useMemo(() => {
    if (!avgPrice || posQty === 0) return 0;
    const diff = side === "BUY" ? markPrice - avgPrice : avgPrice - markPrice;
    // Para PnL da posição, sempre use sinal em função do sentido da posição:
    const signedDiff = (markPrice - (avgPrice ?? markPrice)) * (posQty >= 0 ? 1 : -1);
    return Math.round(signedDiff * Math.abs(posQty));
  }, [avgPrice, markPrice, posQty, side]);

  function addFill(s: Side, q: number, p: number) {
    const time = new Date().toLocaleTimeString();
    setFills((f) => [{ time, side: s, qty: q, price: p }, ...f].slice(0, 20));
  }

  function buy() {
    // abrir / aumentar posição comprada
    const cost = qty * price;
    if (credits < cost) return; // sem saldo
    setCredits((c) => c - cost);

    // média de preço
    const newQty = posQty + qty;
    const newAvg =
      avgPrice == null ? price : (posQty * (avgPrice as number) + qty * price) / (posQty + qty);

    setPosQty(newQty);
    setAvgPrice(newAvg);
    addFill("BUY", qty, price);
  }

  function sell() {
    if (posQty <= 0) {
      // abertura de short simples
      const proceeds = qty * price;
      setCredits((c) => c + proceeds);
      setPosQty((q) => q - qty);
      setAvgPrice((a) => (a == null ? price : a));
      addFill("SELL", qty, price);
      return;
    }

    // reduzir/fechar long
    const closeQty = Math.min(qty, posQty);
    const realizedPnL = (price - (avgPrice ?? price)) * closeQty;
    setRealized((r) => r + Math.round(realizedPnL));
    setCredits((c) => c + closeQty * price);
    const remaining = posQty - closeQty;
    setPosQty(remaining);
    if (remaining === 0) setAvgPrice(null);
    addFill("SELL", closeQty, price);
  }

  function resetAll() {
    setCredits(100_000);
    setRealized(0);
    setSide("BUY");
    setQty(1);
    setPrice(10_000);
    setPosQty(0);
    setAvgPrice(null);
    setFills([]);
  }

  return (
    <div style={panelStyle}>
      <div style={panelHeader}>
        <h2 style={{ margin: 0 }}>Painel de Trade</h2>
        <button style={buyBtnYellow} onClick={() => alert("Plano: em breve 😉")}>
          Comprar Plano
        </button>
      </div>

      <div style={kpisRow}>
        <div style={kpiCard}>
          <div style={kpiLabel}>Créditos</div>
          <div style={kpiValue}>US$ {credits.toLocaleString()}</div>
        </div>
        <div style={kpiCard}>
          <div style={kpiLabel}>Lucro Realizado</div>
          <div style={{ ...kpiValue, color: realized >= 0 ? "#22c55e" : "#ef4444" }}>
            US$ {realized.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={row}>
        <div style={{ ...field, flex: 1 }}>
          <label style={label}>Lado</label>
          <select value={side} onChange={(e) => setSide(e.target.value as Side)} style={input}>
            <option value="BUY">BUY (Long)</option>
            <option value="SELL">SELL (Short)</option>
          </select>
        </div>
        <div style={{ ...field, width: 90 }}>
          <label style={label}>Qtd</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            style={input}
          />
        </div>
        <div style={{ ...field, width: 120 }}>
          <label style={label}>Preço</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value || 0))}
            style={input}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, margin: "6px 0 12px" }}>
        <button onClick={buy} style={buyBtn}>
          Buy
        </button>
        <button onClick={sell} style={sellBtn}>
          Sell
        </button>
        <button onClick={resetAll} style={resetBtn}>
          Reset
        </button>
      </div>

      <div style={box}>
        <div style={smallTitle}>Posição</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
          {posQty === 0 ? (
            <>— Fechado</>
          ) : (
            <>
              {posQty > 0 ? "Long" : "Short"} • Qtd: {Math.abs(posQty)} • Preço Médio:{" "}
              {avgPrice?.toLocaleString()}
            </>
          )}
        </div>
        <div style={{ fontWeight: 600, color: unrealized >= 0 ? "#22c55e" : "#ef4444" }}>
          PNL não realizado (mark={price.toLocaleString()}): US$ {unrealized.toLocaleString()}
        </div>
      </div>

      <div style={box}>
        <div style={smallTitle}>Fills</div>
        {fills.length === 0 ? (
          <div style={{ opacity: 0.7, fontSize: 12 }}>Nenhum ainda</div>
        ) : (
          <table style={{ width: "100%", fontSize: 12 }}>
            <thead>
              <tr style={{ opacity: 0.7 }}>
                <th style={th}>Hora</th>
                <th style={th}>Lado</th>
                <th style={th}>Qtd</th>
                <th style={th}>Preço</th>
              </tr>
            </thead>
            <tbody>
              {fills.map((f, i) => (
                <tr key={i}>
                  <td style={td}>{f.time}</td>
                  <td style={{ ...td, color: f.side === "BUY" ? "#22c55e" : "#ef4444" }}>{f.side}</td>
                  <td style={td}>{f.qty}</td>
                  <td style={td}>{f.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* estilos inline (rápido) */
const panelStyle: React.CSSProperties = {
  width: 360,
  minWidth: 320,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: 12,
  borderRadius: 12,
  background: "linear-gradient(180deg,#0f1a2b,#0b1220)",
  border: "1px solid rgba(255,255,255,0.08)",
};
const panelHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
};
const kpisRow: React.CSSProperties = { display: "flex", gap: 8 };
const kpiCard: React.CSSProperties = {
  flex: 1,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 10,
  padding: "8px 10px",
};
const kpiLabel: React.CSSProperties = { fontSize: 11, opacity: 0.7, marginBottom: 4 };
const kpiValue: React.CSSProperties = { fontSize: 16, fontWeight: 700 };
const row: React.CSSProperties = { display: "flex", gap: 8 };
const field: React.CSSProperties = { display: "flex", flexDirection: "column" };
const label: React.CSSProperties = { fontSize: 11, opacity: 0.7, marginBottom: 4 };
const input: React.CSSProperties = {
  height: 34,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "white",
  padding: "0 10px",
  outline: "none",
};
const buyBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(34,197,94,0.25)",
  background: "#16a34a",
  color: "white",
  fontWeight: 700,
};
const sellBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(239,68,68,0.25)",
  background: "#ef4444",
  color: "white",
  fontWeight: 700,
};
const resetBtn: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(148,163,184,0.25)",
  background: "rgba(148,163,184,0.2)",
  color: "white",
  fontWeight: 700,
};
const buyBtnYellow: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid rgba(234,179,8,0.35)",
  background: "#f59e0b",
  color: "#0b1220",
  fontWeight: 800,
};
const box: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 10,
  padding: 10,
};
const smallTitle: React.CSSProperties = { fontSize: 12, fontWeight: 700, marginBottom: 6 };
const th: React.CSSProperties = { textAlign: "left", padding: "4px 6px", borderBottom: "1px solid rgba(255,255,255,0.06)" };
const td: React.CSSProperties = { padding: "6px 6px" };
