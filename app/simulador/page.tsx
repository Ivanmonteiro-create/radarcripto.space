// app/simulador/page.tsx
"use client";

import React, { useState } from "react";
import TVChart from "../components/TVChart";
import TradePanel from "../components/TradePanel";

type Ex = "BINANCE" | "BITSTAMP" | "COINBASE";
type Pair = "BTCUSDT" | "ETHUSDT" | "BNBUSDT" | "SOLUSDT" | "XRPUSDT";
type TF = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d";

export default function SimuladorPage() {
  const [exchange, setExchange] = useState<Ex>("BINANCE");
  const [pair, setPair] = useState<Pair>("BTCUSDT");
  const [timeframe, setTimeframe] = useState<TF>("1h");
  const [panelRight, setPanelRight] = useState(false);

  return (
    <main style={container}>
      {/* barra de controles no topo do gráfico */}
      <div style={topBar}>
        <div style={selectors}>
          <div style={selectBox}>
            <label style={label}>Exchange</label>
            <select value={exchange} onChange={(e) => setExchange(e.target.value as Ex)} style={select}>
              <option>BINANCE</option>
              <option>BITSTAMP</option>
              <option>COINBASE</option>
            </select>
          </div>

          <div style={selectBox}>
            <label style={label}>Par</label>
            <select value={pair} onChange={(e) => setPair(e.target.value as Pair)} style={select}>
              <option>BTCUSDT</option>
              <option>ETHUSDT</option>
              <option>BNBUSDT</option>
              <option>SOLUSDT</option>
              <option>XRPUSDT</option>
            </select>
          </div>

          <div style={selectBox}>
            <label style={label}>Tempo</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as TF)} style={select}>
              <option>1m</option><option>5m</option><option>15m</option>
              <option>30m</option><option>1h</option><option>4h</option><option>1d</option>
            </select>
          </div>
        </div>

        <button style={toggleBtn} onClick={() => setPanelRight((v) => !v)}>
          Painel → {panelRight ? "esquerda" : "direita"}
        </button>
      </div>

      {/* grid principal */}
      <div style={{ ...grid, gridTemplateColumns: panelRight ? "1fr 360px" : "360px 1fr" }}>
        {!panelRight && <TradePanel />}
        <div style={chartWrap}>
          <TVChart exchange={exchange} pair={pair} timeframe={timeframe} />
        </div>
        {panelRight && <TradePanel />}
      </div>
    </main>
  );
}

/* estilos */

const container: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0a0f1a",
  color: "white",
  padding: 12,
};

const topBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 8,
};

const selectors: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };
const selectBox: React.CSSProperties = { display: "flex", flexDirection: "column" };
const label: React.CSSProperties = { fontSize: 11, opacity: 0.7, marginBottom: 4 };
const select: React.CSSProperties = {
  height: 36,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(0,0,0,0.25)",
  color: "white",
  padding: "0 10px",
  outline: "none",
};

const toggleBtn: React.CSSProperties = {
  background: "#0ea5e9",
  border: "1px solid rgba(14,165,233,0.5)",
  color: "#071018",
  padding: "8px 12px",
  borderRadius: 10,
  fontWeight: 800,
};

const grid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  alignItems: "stretch",
  gridTemplateColumns: "360px 1fr",
  // ocupar altura inteira, deixando um respiro inferior pequeno
  minHeight: "calc(100vh - 80px)",
};

const chartWrap: React.CSSProperties = {
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0b1220",
};
