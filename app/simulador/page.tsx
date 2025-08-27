"use client";

import React, { useMemo, useState } from "react";
import TradePanel from "../components/TradePanel";

type Pair = "BTCUSDT" | "ETHUSDT" | "BNBUSDT" | "SOLUSDT" | "XRPUSDT";
type Interval = "1" | "5" | "60" | "240" | "D"; // TradingView: 1m, 5m, 1h, 4h, 1D
type Exchange = "BINANCE" | "BITSTAMP" | "COINBASE";

export default function SimuladorPage() {
  const [exchange, setExchange] = useState<Exchange>("BINANCE");
  const [pair, setPair] = useState<Pair>("BTCUSDT");
  const [interval, setInterval] = useState<Interval>("60"); // 60 = 1h
  const [panelRight, setPanelRight] = useState<boolean>(true);

  const tvSrc = useMemo(() => {
    const sym = `${exchange}:${pair}`;
    const url = new URL("https://s.tradingview.com/widgetembed/");
    url.searchParams.set("symbol", sym);
    url.searchParams.set("interval", interval);
    url.searchParams.set("hidesidetoolbar", "0");
    url.searchParams.set("hideideas", "1");
    url.searchParams.set("theme", "dark");
    url.searchParams.set("style", "1");
    url.searchParams.set("withdateranges", "1");
    url.searchParams.set("allow_symbol_change", "1");
    url.searchParams.set("saveimage", "1");
    url.searchParams.set("studies", "");
    return url.toString();
  }, [exchange, pair, interval]);

  return (
    <main style={page}>
      {/* toolbar superior */}
      <div style={toolbar}>
        <div style={leftGroup}>
          <label style={tbLabel}>Exchange</label>
          <select value={exchange} onChange={(e) => setExchange(e.target.value as Exchange)} style={tbSelect}>
            <option>BINANCE</option>
            <option>BITSTAMP</option>
            <option>COINBASE</option>
          </select>

          <label style={tbLabel}>Par</label>
          <select value={pair} onChange={(e) => setPair(e.target.value as Pair)} style={tbSelect}>
            <option>BTCUSDT</option>
            <option>ETHUSDT</option>
            <option>BNBUSDT</option>
            <option>SOLUSDT</option>
            <option>XRPUSDT</option>
          </select>

          <label style={tbLabel}>Tempo</label>
          <select value={interval} onChange={(e) => setInterval(e.target.value as Interval)} style={tbSelect}>
            <option value="1">1m</option>
            <option value="5">5m</option>
            <option value="60">1h</option>
            <option value="240">4h</option>
            <option value="D">1D</option>
          </select>
        </div>

        <button style={swapBtn} onClick={() => setPanelRight((v) => !v)}>
          Painel ↔ {panelRight ? "direita" : "esquerda"}
        </button>
      </div>

      {/* grade principal */}
      <div
        style={{
          ...grid,
          gridTemplateColumns: panelRight ? "1fr 380px" : "380px 1fr",
        }}
      >
        {/* gráfico — ocupa quase a tela toda */}
        {panelRight ? <Chart tvSrc={tvSrc} /> : <TradePanel />}
        {panelRight ? <TradePanel /> : <Chart tvSrc={tvSrc} />}
      </div>
    </main>
  );
}

/* subcomponente do gráfico (iframe) */
function Chart({ tvSrc }: { tvSrc: string }) {
  return (
    <section style={chartBox}>
      <iframe
        title="TradingView"
        src={tvSrc}
        style={iframe}
        frameBorder="0"
        allowTransparency
        allowFullScreen
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </section>
  );
}

/* ================ styles ================= */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0a1020",
  color: "#e6eef8",
  padding: "14px 12px",
  boxSizing: "border-box",
};

const toolbar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 10,
};

const leftGroup: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" };

const tbLabel: React.CSSProperties = { fontSize: 12, opacity: .8 };
const tbSelect: React.CSSProperties = {
  background: "#0e172b",
  color: "#e6eef8",
  border: "1px solid #1f2a44",
  borderRadius: 8,
  padding: "8px 10px",
};

const swapBtn: React.CSSProperties = {
  background: "#0ea5e9",
  border: "none",
  color: "#081018",
  padding: "10px 14px",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const grid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  // altura total menos a barra superior
  gridAutoRows: "1fr",
};

const chartBox: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  background: "#0b1220",
  border: "1px solid #1f2a44",
  borderRadius: 12,
  overflow: "hidden",
  // ocupa quase a tela toda
  height: "calc(100vh - 110px)",
  minHeight: 480,
};

const iframe: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: "none",
};
