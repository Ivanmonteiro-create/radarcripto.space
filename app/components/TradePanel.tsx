// app/components/TradePanel.tsx
"use client";

import { useMemo, useState } from "react";

type Side = "BUY" | "SELL";

type Fill = {
  id: string;
  time: string; // ISO
  side: Side;
  qty: number;
  price: number;
};

type Position = {
  side: Side;     // direção da posição (BUY = long, SELL = short)
  qty: number;    // quantidade aberta (líquida)
  avgPrice: number; // preço médio da posição
};

export default function TradePanel() {
  // estado de inputs
  const [side, setSide] = useState<Side>("BUY");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(100000);

  // fills executados (ordens simuladas)
  const [fills, setFills] = useState<Fill[]>([]);

  // posição derivada dos fills
  const position: Position | null = useMemo(() => {
    if (fills.length === 0) return null;

    let netQty = 0;
    let longCost = 0;  // soma (qty * price) para BUY
    let shortCost = 0; // soma (qty * price) para SELL

    fills.forEach((f) => {
      if (f.side === "BUY") {
        netQty += f.qty;
        longCost += f.qty * f.price;
      } else {
        netQty -= f.qty;
        shortCost += f.qty * f.price;
      }
    });

    if (netQty === 0) return null;

    // lado da posição e preço médio (método simples: média ponderada dos fills do lado prevalente)
    if (netQty > 0) {
      // posição LONG
      const longQty = fills.filter(f => f.side === "BUY").reduce((s, f) => s + f.qty, 0);
      const longGross = fills.filter(f => f.side === "BUY").reduce((s, f) => s + f.qty * f.price, 0);
      return {
        side: "BUY",
        qty: netQty,
        avgPrice: longQty > 0 ? longGross / longQty : 0,
      };
    } else {
      // posição SHORT
      const shortQty = fills.filter(f => f.side === "SELL").reduce((s, f) => s + f.qty, 0);
      const shortGross = fills.filter(f => f.side === "SELL").reduce((s, f) => s + f.qty * f.price, 0);
      return {
        side: "SELL",
        qty: Math.abs(netQty),
        avgPrice: shortQty > 0 ? shortGross / shortQty : 0,
      };
    }
  }, [fills]);

  // PnL não realizado com base no último preço (input 'price')
  const unrealizedPnl = useMemo(() => {
    if (!position) return 0;
    if (position.side === "BUY") {
      return (price - position.avgPrice) * position.qty;
    }
    // short
    return (position.avgPrice - price) * position.qty;
  }, [position, price]);

  function addFill(fillSide: Side, fillQty: number, fillPrice: number) {
    const newFill: Fill = {
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      side: fillSide,
      qty: Math.max(0, Number(fillQty) || 0),
      price: Math.max(0, Number(fillPrice) || 0),
    };
    setFills((prev) => [...prev, newFill]);
  }

  function resetAll() {
    setFills([]);
    setQty(1);
    // mantém price para referência do gráfico/mercado
  }

  return (
    <div style={panelBox}>
      <h3 style={{ margin: "0 0 8px" }}>Painel de Trade</h3>

      {/* Controles */}
      <div style={row}>
        <label style={lbl}>Lado</label>
        <select value={side} onChange={(e) => setSide(e.target.value as Side)} style={inp}>
          <option value="BUY">BUY (Long)</option>
          <option value="SELL">SELL (Short)</option>
        </select>
      </div>

      <div style={row}>
        <label style={lbl}>Qtd</label>
        <input
          type="number"
          min={0}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          style={inp}
        />
      </div>

      <div style={row}>
        <label style={lbl}>Preço</label>
        <input
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={inp}
        />
      </div>

      <div style={{ display: "flex", gap: 8, margin: "8px 0 12px" }}>
        <button onClick={() => addFill("BUY", qty, price)} style={btnBuy}>Buy</button>
        <button onClick={() => addFill("SELL", qty, price)} style={btnSell}>Sell</button>
        <button onClick={resetAll} style={btnReset}>Reset</button>
      </div>

      {/* Posição atual */}
      <div style={card}>
        <strong>Posição:</strong>{" "}
        {position
          ? `${position.side} ${position.qty} @ ${position.avgPrice.toFixed(2)}`
          : "— (zerado)"}
        <br />
        <strong>PnL não realizado:</strong>{" "}
        {unrealizedPnl >= 0 ? "+" : ""}
        {unrealizedPnl.toFixed(2)}
      </div>

      {/* Fills */}
      <div style={{ ...card, maxHeight: 180, overflow: "auto" }}>
        <strong>Fills</strong>
        <table style={{ width: "100%", fontSize: 12, marginTop: 6 }}>
          <thead>
            <tr>
              <th style={th}>Hora</th>
              <th style={th}>Lado</th>
              <th style={th}>Qtd</th>
              <th style={th}>Preço</th>
            </tr>
          </thead>
          <tbody>
            {fills.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", opacity: 0.7 }}>
                  Nenhum fill ainda
                </td>
              </tr>
            ) : (
              fills.map((f) => (
                <tr key={f.id}>
                  <td style={td}>{new Date(f.time).toLocaleTimeString()}</td>
                  <td style={td}>{f.side}</td>
                  <td style={td}>{f.qty}</td>
                  <td style={td}>{f.price.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ===== estilos inline simples ===== */
const panelBox: React.CSSProperties = {
  border: "1px solid #2b2b2b",
  borderRadius: 8,
  padding: 12,
  background: "#151a21",
  color: "#e8eef6",
  width: "100%",
  boxSizing: "border-box",
};

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: "6px 0",
};

const lbl: React.CSSProperties = { width: 60, opacity: 0.8, fontSize: 12 };

const inp: React.CSSProperties = {
  flex: 1,
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #2b2b2b",
  background: "#0f1216",
  color: "#e8eef6",
};

const btnBase: React.CSSProperties = {
  padding: "8px 12px",
  border: 0,
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
};

const btnBuy: React.CSSProperties = { ...btnBase, background: "#1e824c", color: "#fff" };
const btnSell: React.CSSProperties = { ...btnBase, background: "#c0392b", color: "#fff" };
const btnReset: React.CSSProperties = { ...btnBase, background: "#34495e", color: "#fff" };

const card: React.CSSProperties = {
  border: "1px solid #2b2b2b",
  borderRadius: 8,
  padding: 10,
  marginTop: 8,
  background: "#0f1216",
};

const th: React.CSSProperties = { textAlign: "left", padding: "4px 6px", borderBottom: "1px solid #2b2b2b" };
const td: React.CSSProperties = { padding: "4px 6px", borderBottom: "1px dashed #222" };
