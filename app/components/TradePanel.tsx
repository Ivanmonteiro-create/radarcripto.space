"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

/**
 * Painel de Trade “mock” para simulação local
 * - créditos: saldo virtual inicial
 * - realized: PnL realizado
 * - qty/price: controles básicos
 * - fills: tabela com execuções simuladas
 *
 * OBS: É um simulador local, sem backend.
 */

type FillSide = "BUY" | "SELL";

type Fill = {
  time: string;     // HH:mm:ss
  side: FillSide;
  qty: number;
  price: number;
};

export default function TradePanel() {
  // estado base
  const [credits, setCredits] = useState<number>(100_000);
  const [realized, setRealized] = useState<number>(0);
  const [side, setSide] = useState<FillSide>("BUY");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(10_000);
  const [fills, setFills] = useState<Fill[]>([]);

  // posição líquida e preço médio
  const { net, avgPrice, unrealized } = useMemo(() => {
    let position = 0;
    let cost = 0;

    for (const f of fills) {
      if (f.side === "BUY") {
        position += f.qty;
        cost += f.qty * f.price;
      } else {
        // venda reduz posição; se estiver positivo, realiza PnL
        const closing = Math.min(Math.max(position, 0), f.qty);
        const avg = position > 0 ? cost / Math.max(position, 1) : 0;
        const realizedNow = closing * (f.price - avg);
        setTimeout(() => setRealized((r) => r + realizedNow), 0);

        position -= f.qty;
        if (position >= 0) {
          cost -= closing * avg;
        } else {
          // virou short: custo passa a ser preço da venda excedente
          cost = -position * f.price;
        }
      }
    }

    const avg = position !== 0 ? cost / Math.abs(position) : 0;

    // PnL não realizado sobre “price” atual do input, só pra referência
    const mark = price;
    let u = 0;
    if (position > 0) u = (mark - avg) * position;
    else if (position < 0) u = (avg - mark) * Math.abs(position);

    return { net: position, avgPrice: avg, unrealized: u };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fills, price]);

  function addFill(s: FillSide) {
    const f: Fill = {
      time: new Date().toLocaleTimeString("pt-BR", { hour12: false }),
      side: s,
      qty: Math.max(0, Math.floor(qty)),
      price: Math.max(0, Math.floor(price)),
    };
    if (!f.qty || !f.price) return;
    setFills((arr) => [f, ...arr.slice(0, 99)]);
  }

  function resetAll() {
    setFills([]);
    setRealized(0);
    setQty(1);
    setPrice(10_000);
  }

  return (
    <div style={panelShell}>
      {/* topo com CTA */}
      <div style={headerRow}>
        <h2 style={title}>Painel de Trade</h2>
        <Link href="/planos">
          <button style={ctaBtn}>Comprar Plano</button>
        </Link>
      </div>

      {/* saldo e pnl */}
      <div style={statRow}>
        <div style={statBox}>
          <span style={label}>Créditos</span>
          <strong style={value}>US$ {credits.toLocaleString()}</strong>
        </div>
        <div style={statBox}>
          <span style={label}>Lucro Realizado</span>
          <strong style={{ ...value, color: realized >= 0 ? "#22c55e" : "#ef4444" }}>
            US$ {realized.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* controles */}
      <div style={controlsRow}>
        <div style={controlCol}>
          <span style={smallLabel}>Lado</span>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as FillSide)}
            style={select}
          >
            <option value="BUY">BUY (Long)</option>
            <option value="SELL">SELL (Short)</option>
          </select>
        </div>
        <div style={controlCol}>
          <span style={smallLabel}>Qtd</span>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            style={input}
          />
        </div>
        <div style={controlCol}>
          <span style={smallLabel}>Preço</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={input}
          />
        </div>
        <div style={buttonsCol}>
          <button onClick={() => addFill("BUY")} style={buyBtn}>Buy</button>
          <button onClick={() => addFill("SELL")} style={sellBtn}>Sell</button>
          <button onClick={resetAll} style={resetBtn}>Reset</button>
        </div>
      </div>

      {/* posição */}
      <div style={positionBox}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div><b>Posição:</b> {net >= 0 ? "Long" : "Short"} {Math.abs(net)}</div>
          <div><b>Preço Médio:</b> {avgPrice ? `US$ ${avgPrice.toFixed(2)}` : "—"}</div>
          <div>
            <b>PNL não realizado (mark={price.toLocaleString()}):</b>{" "}
            <span style={{ color: unrealized >= 0 ? "#22c55e" : "#ef4444" }}>
              US$ {unrealized.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* fills */}
      <div style={fillsBox}>
        <div style={{ marginBottom: 6, fontWeight: 700 }}>Fills</div>
        <div style={fillsHead}>
          <span>Hora</span><span>Lado</span><span>Qtd</span><span>Preço</span>
        </div>
        <div style={{ maxHeight: 180, overflow: "auto" }}>
          {fills.length === 0 ? (
            <div style={{ opacity: .7, padding: "8px 0" }}>Nenhum ainda</div>
          ) : (
            fills.map((f, i) => (
              <div key={i} style={fillsRow}>
                <span>{f.time}</span>
                <span style={{ color: f.side === "BUY" ? "#22c55e" : "#ef4444" }}>{f.side}</span>
                <span>{f.qty}</span>
                <span>{f.price.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= styles ================= */

const panelShell: React.CSSProperties = {
  position: "relative",
  zIndex: 5,                 // garante ficar acima do iframe
  background: "#0b1220",
  border: "1px solid #1f2a44",
  borderRadius: 12,
  padding: "12px 12px 16px",
  color: "#e6eef8",
  width: 360,
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 8,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  letterSpacing: .4,
};

const ctaBtn: React.CSSProperties = {
  background: "#f59e0b",
  color: "#1b1b1b",
  border: "none",
  padding: "10px 14px",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const statRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginBottom: 10,
};

const statBox: React.CSSProperties = {
  background: "#0e172b",
  border: "1px solid #1f2a44",
  borderRadius: 10,
  padding: 10,
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  opacity: .75,
  marginBottom: 2,
};

const value: React.CSSProperties = {
  fontSize: 16,
};

const controlsRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gap: 10,
  marginBottom: 10,
};

const controlCol: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };
const smallLabel: React.CSSProperties = { fontSize: 12, opacity: .8 };

const select: React.CSSProperties = {
  background: "#0e172b",
  color: "#e6eef8",
  border: "1px solid #1f2a44",
  borderRadius: 8,
  padding: "8px 10px",
};

const input: React.CSSProperties = {
  background: "#0e172b",
  color: "#e6eef8",
  border: "1px solid #1f2a44",
  borderRadius: 8,
  padding: "8px 10px",
};

const buttonsCol: React.CSSProperties = { display: "flex", gap: 8, alignItems: "end" };

const buyBtn: React.CSSProperties = {
  background: "#22c55e",
  border: "none",
  color: "#071017",
  padding: "8px 10px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
};
const sellBtn: React.CSSProperties = {
  ...buyBtn,
  background: "#ef4444",
};
const resetBtn: React.CSSProperties = {
  ...buyBtn,
  background: "#475569",
  color: "#e6eef8",
};

const positionBox: React.CSSProperties = {
  background: "#0e172b",
  border: "1px solid #1f2a44",
  borderRadius: 10,
  padding: 10,
  marginBottom: 10,
  fontSize: 14,
};

const fillsBox: React.CSSProperties = {
  background: "#0e172b",
  border: "1px solid #1f2a44",
  borderRadius: 10,
  padding: 10,
};

const fillsHead: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  opacity: .8,
  fontSize: 12,
  gap: 8,
  borderBottom: "1px solid #1f2a44",
  paddingBottom: 6,
};

const fillsRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gap: 8,
  padding: "8px 0",
  borderBottom: "1px dashed #13223a",
};
