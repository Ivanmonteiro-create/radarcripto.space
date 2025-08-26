"use client";

import { useMemo, useState } from "react";

type Fill = { time: string; side: "BUY" | "SELL"; qty: number; price: number };

export default function TradePanel() {
  const [credits, setCredits] = useState<number>(100000); // créditos da “conta demo”
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(10000);
  const [fills, setFills] = useState<Fill[]>([]);
  const [pos, setPos] = useState<number>(0); // positivo comprado, negativo vendido
  const [avg, setAvg] = useState<number>(0);

  const realized = useMemo(() => {
    // lucro realizado é resultado de fills que fecharam posição
    // para simples demo, vamos usar a diferença entre créditos atuais e créditos iniciais
    return credits - 100000;
  }, [credits]);

  function now() {
    return new Date().toLocaleTimeString("pt-BR", { hour12: false });
  }

  function addFill(f: Fill) {
    setFills((prev) => [f, ...prev].slice(0, 100));
  }

  function buy() {
    if (qty <= 0 || price <= 0) return;
    const cost = qty * price;
    if (credits < cost) return; // sem saldo

    // se posição negativa (short), primeiro fecha até zerar
    let remaining = qty;
    if (pos < 0) {
      const closeQty = Math.min(remaining, Math.abs(pos));
      // fechar short: lucros/perdas entram nos créditos
      const pnl = (avg - price) * closeQty;
      setCredits((c) => c + pnl);
      setPos((p) => p + closeQty);
      remaining -= closeQty;
      addFill({ time: now(), side: "BUY", qty: closeQty, price });
    }

    // qualquer resto abre/expande long
    if (remaining > 0) {
      const newCost = avg * Math.max(pos, 0) + price * remaining;
      const newQty = Math.max(pos, 0) + remaining;
      setAvg(newCost / newQty);
      setPos((p) => p + remaining);
      setCredits((c) => c - remaining * price);
      addFill({ time: now(), side: "BUY", qty: remaining, price });
    }
  }

  function sell() {
    if (qty <= 0 || price <= 0) return;

    // se posição positiva (long), primeiro fecha até zerar
    let remaining = qty;
    if (pos > 0) {
      const closeQty = Math.min(remaining, pos);
      const pnl = (price - avg) * closeQty;
      setCredits((c) => c + pnl);
      setPos((p) => p - closeQty);
      remaining -= closeQty;
      addFill({ time: now(), side: "SELL", qty: closeQty, price });
    }

    // resto abre/expande short
    if (remaining > 0) {
      const newCost = avg * Math.max(-pos, 0) + price * remaining;
      const newQty = Math.max(-pos, 0) + remaining;
      setAvg(newCost / newQty);
      setPos((p) => p - remaining);
      // vender a descoberto “injeta” créditos como resultado da venda
      setCredits((c) => c + remaining * price);
      addFill({ time: now(), side: "SELL", qty: remaining, price });
    }
  }

  function resetAll() {
    setCredits(100000);
    setSide("BUY");
    setQty(1);
    setPrice(10000);
    setFills([]);
    setPos(0);
    setAvg(0);
  }

  return (
    <div style={panel}>

      {/* saldo / créditos */}
      <div style={cardWide}>
        <div style={rowSpace}>
          <div>
            <div style={label}>Créditos</div>
            <div style={money}>{credits.toLocaleString("pt-BR", { style: "currency", currency: "USD" })}</div>
          </div>
          <button style={btnSoft} onClick={resetAll}>Resetar Conta</button>
        </div>
      </div>

      {/* ordem */}
      <div style={card}>
        <div style={grid2}>
          <label style={field}>
            <span style={label}>Lado</span>
            <select value={side} onChange={(e) => setSide(e.target.value as "BUY" | "SELL")} style={input}>
              <option value="BUY">BUY (Long)</option>
              <option value="SELL">SELL (Short)</option>
            </select>
          </label>
          <label style={field}>
            <span style={label}>Qtd</span>
            <input type="number" value={qty} min={0} onChange={(e) => setQty(parseFloat(e.target.value))} style={input} />
          </label>
          <label style={field}>
            <span style={label}>Preço</span>
            <input type="number" value={price} min={0} onChange={(e) => setPrice(parseFloat(e.target.value))} style={input} />
          </label>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button style={btnBuy} onClick={buy}>Buy</button>
          <button style={btnSell} onClick={sell}>Sell</button>
          <button style={btnSoft} onClick={() => { setQty(1); setPrice(10000); }}>Reset</button>
        </div>
      </div>

      {/* posição atual */}
      <div style={card}>
        <div style={label}>Posição</div>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
          <span style={{ fontSize: 22, color: "#e8f1ff", fontWeight: 700 }}>
            {pos} {pos === 0 ? "" : pos > 0 ? "(Long)" : "(Short)"}
          </span>
          <span style={{ color: "#87a6ff" }}>Preço Médio: {avg ? avg.toFixed(2) : "-"}</span>
          <span style={{ color: realized >= 0 ? "#42d392" : "#ff6b6b" }}>
            PnL Realizado: {realized.toFixed(2)}
          </span>
        </div>
      </div>

      {/* fills */}
      <div style={card}>
        <div style={label}>Fills</div>
        <div style={fillsHead}>
          <span>Hora</span><span>Lado</span><span>Qtd</span><span>Preço</span>
        </div>
        <div style={{ maxHeight: 220, overflow: "auto" }}>
          {fills.length === 0 ? (
            <div style={{ opacity: .7, padding: "6px 2px" }}>Nenhum fill ainda</div>
          ) : (
            fills.map((f, i) => (
              <div key={i} style={fillRow}>
                <span>{f.time}</span>
                <span style={{ color: f.side === "BUY" ? "#34d399" : "#fb7185" }}>{f.side}</span>
                <span>{f.qty}</span>
                <span>{f.price.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== estilos ===== */

const panel: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 12,
};

const card: React.CSSProperties = {
  background: "linear-gradient(180deg,#0d131b 0%,#0a1017 100%)",
  border: "1px solid #2a3340",
  borderRadius: 12,
  padding: 12,
};

const cardWide: React.CSSProperties = {
  ...card,
  padding: "14px 16px",
};

const rowSpace: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 10,
};

const field: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };

const label: React.CSSProperties = { fontSize: 12, color: "#93b1ff" };

const input: React.CSSProperties = {
  background: "#0f1622",
  border: "1px solid #31476b",
  color: "#e6eefb",
  borderRadius: 10,
  padding: "10px 12px",
  outline: "none",
};

const money: React.CSSProperties = { fontSize: 22, fontWeight: 800, color: "#e8f1ff" };

const btnBase: React.CSSProperties = {
  borderRadius: 10,
  padding: "10px 14px",
  fontWeight: 700,
  border: "1px solid transparent",
  cursor: "pointer",
};

const btnBuy: React.CSSProperties = {
  ...btnBase,
  background: "linear-gradient(180deg,#34d399 0%,#16a34a 100%)",
  borderColor: "#16a34a",
  color: "#06210e",
};

const btnSell: React.CSSProperties = {
  ...btnBase,
  background: "linear-gradient(180deg,#fb7185 0%,#ef4444 100%)",
  borderColor: "#ef4444",
  color: "#2a060b",
};

const btnSoft: React.CSSProperties = {
  ...btnBase,
  background: "linear-gradient(180deg,#202a3a 0%,#161e2b 100%)",
  borderColor: "#334155",
  color: "#dbe7ff",
};

const fillsHead: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gap: 8,
  fontSize: 12,
  color: "#89a6ff",
  borderBottom: "1px solid #263244",
  paddingBottom: 6,
  marginBottom: 6,
};

const fillRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gap: 8,
  padding: "6px 2px",
  borderBottom: "1px dashed #1f2a3a",
};
