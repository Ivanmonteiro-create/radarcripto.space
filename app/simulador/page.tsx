"use client";

import React, { useMemo, useState, useEffect } from "react";
import TradePanel from "../components/TradePanel";

/* ===== Estilos ===== */
const pageWrap: React.CSSProperties = {
  height: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: "#0b1220",
};

const toolbar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 12px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(13, 21, 35, 0.8)",
  position: "sticky",
  top: 0,
  zIndex: 5,
};

const selectStyle: React.CSSProperties = {
  background: "#0f172a",
  color: "#e2e8f0",
  border: "1px solid #1f2a44",
  borderRadius: 8,
  padding: "6px 10px",
  outline: "none",
};

const btn: React.CSSProperties = {
  background: "#0ea5e9",
  color: "white",
  border: 0,
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 600,
  cursor: "pointer",
};

const layout: React.CSSProperties = {
  flex: 1,
  display: "grid",
  gap: 12,
  padding: 12,
  minHeight: 0,
};

const panelCol: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.65)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  overflow: "hidden",
  minWidth: 320,
};

const chartWrap: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.65)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  position: "relative",
  minWidth: 320,
  minHeight: 0,
  overflow: "hidden",
};

const iframeStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  border: 0,
};

/* ===== Opções ===== */
const EXCHANGES = ["BINANCE", "BITSTAMP", "COINBASE"];
const PAIRS: Record<string, string[]> = {
  BINANCE: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"],
  BITSTAMP: ["BTCUSD", "ETHUSD", "BNBUSD", "SOLUSD", "XRPUSD"],
  COINBASE: ["BTCUSD", "ETHUSD", "SOLUSD"],
};
const INTERVALS = ["1m", "30m", "1h", "4h", "1D"];

/* Mapeia intervalo para o formato aceito no Advanced Chart */
const TV_INTERVAL_MAP: Record<string, string> = {
  "1m": "1",
  "30m": "30",
  "1h": "60",
  "4h": "240",
  "1D": "D",
};

/** Construção da URL estável do TradingView (Advanced Chart) */
function buildTVUrl(exchange: string, pair: string, interval: string) {
  const symbol = `${exchange}:${pair}`;
  const tvInterval = TV_INTERVAL_MAP[interval] ?? "60";

  const config = {
    symbol,
    interval: tvInterval,
    theme: "dark",
    hide_top_toolbar: false,
    hide_legend: false,
    allow_symbol_change: true,
    save_image: true,
    calendar: false,
    studies: ["Volume@tv-basicstudies"],
    support_host: "https://www.tradingview.com",
    autosize: true,
    locale: "br",
  };

  // JSON no hash (#) e codificado
  const cfg = encodeURIComponent(JSON.stringify(config));
  return `https://s.tradingview.com/embed-widget-advanced-chart/?locale=br#${cfg}`;
}

export default function SimuladorPage() {
  const [exchange, setExchange] = useState<string>("BINANCE");
  const [pair, setPair] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1h");

  const [panelSide, setPanelSide] = useState<"left" | "right">("left");
  const [panelVisible, setPanelVisible] = useState<boolean>(true);
  const [fullTall, setFullTall] = useState<boolean>(true);

  const tvUrl = useMemo(
    () => buildTVUrl(exchange, pair, interval),
    [exchange, pair, interval]
  );

  const pairOptions = PAIRS[exchange] ?? [];

  // Garante par válido quando troca a exchange
  useEffect(() => {
    if (!pairOptions.includes(pair)) setPair(pairOptions[0] || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchange]);

  const gridTemplate = useMemo(() => {
    const panelWidth = 360;
    if (!panelVisible) return { gridTemplateColumns: "1fr" };
    return panelSide === "left"
      ? { gridTemplateColumns: `${panelWidth}px 1fr` }
      : { gridTemplateColumns: `1fr ${panelWidth}px` };
  }, [panelSide, panelVisible]);

  return (
    <div style={{ ...pageWrap, height: fullTall ? "100vh" : "100vh" }}>
      {/* Toolbar */}
      <div style={toolbar}>
        <label style={{ color: "#94a3b8", fontSize: 13 }}>Exchange</label>
        <select
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
          style={selectStyle}
        >
          {EXCHANGES.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </select>

        <label style={{ color: "#94a3b8", fontSize: 13 }}>Par</label>
        <select
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          style={selectStyle}
        >
          {pairOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <label style={{ color: "#94a3b8", fontSize: 13 }}>Tempo</label>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          style={selectStyle}
        >
          {INTERVALS.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <div style={{ flex: 1 }} />

        <button
          style={btn}
          onClick={() =>
            setPanelSide((s) => (s === "left" ? "right" : "left"))
          }
        >
          {panelSide === "left" ? "Painel → direita" : "Painel → esquerda"}
        </button>

        <button
          style={{ ...btn, background: "#334155" }}
          onClick={() => setPanelVisible((v) => !v)}
        >
          {panelVisible ? "Ocultar painel" : "Mostrar painel"}
        </button>

        <button
          style={{ ...btn, background: "#0ea5e9" }}
          onClick={() => setFullTall((f) => !f)}
        >
          Tela cheia
        </button>
      </div>

      {/* Grid principal */}
      <div style={{ ...layout, ...gridTemplate }}>
        {panelVisible && panelSide === "left" && (
          <div style={panelCol}>
            <TradePanel />
          </div>
        )}

        <div style={chartWrap}>
          {/* AVISO: sem sandbox para evitar “Algo deu errado…” */}
          <iframe
            title="TradingView Advanced Chart"
            src={tvUrl}
            style={iframeStyle}
            loading="eager"
            allow="fullscreen; clipboard-write; encrypted-media; autoplay"
            allowFullScreen
          />
        </div>

        {panelVisible && panelSide === "right" && (
          <div style={panelCol}>
            <TradePanel />
          </div>
        )}
      </div>
    </div>
  );
}
