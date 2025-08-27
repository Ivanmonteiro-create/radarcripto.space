"use client";

import React, { useMemo, useState } from "react";
import TradePanel from "../components/TradePanel";

/** ====== Estilos básicos (inline) ====== */
const pageWrap: React.CSSProperties = {
  // ocupa a janela toda (abaixo da barra do navegador)
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
  // área de conteúdo ocupa todo o restante da altura
  flex: 1,
  display: "grid",
  gap: 12,
  padding: 12,
  minHeight: 0, // para o grid respeitar 100vh sem overflow
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

/** ====== Opções simples ====== */
const EXCHANGES = ["BINANCE", "BITSTAMP", "COINBASE"];
const PAIRS: Record<string, string[]> = {
  BINANCE: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"],
  BITSTAMP: ["BTCUSD", "ETHUSD", "BNBUSD", "SOLUSD", "XRPUSD"],
  COINBASE: ["BTCUSD", "ETHUSD", "SOLUSD"],
};
const INTERVALS = ["1m", "30m", "1h", "4h", "1D"];

/** Constrói a URL do widget do TradingView (modo embed) */
function buildTVUrl(exchange: string, pair: string, interval: string) {
  // Ex.: BINANCE:BTCUSDT  |  BITSTAMP:BTCUSD
  const symbol = `${exchange}:${pair}`;
  const params = new URLSearchParams({
    symbol,
    interval,
    theme: "dark",
    style: "1",
    locale: "br",
    toolbarbg: "rgba(0,0,0,0)",
    hide_top_toolbar: "0",
    hide_legend: "0",
    support_host: "https://www.tradingview.com",
    // aumenta o espaço útil do gráfico
    autosize: "true",
  });
  return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
}

export default function SimuladorPage() {
  // estado dos controles
  const [exchange, setExchange] = useState<string>("BINANCE");
  const [pair, setPair] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1h");

  const [panelSide, setPanelSide] = useState<"left" | "right">("left");
  const [panelVisible, setPanelVisible] = useState<boolean>(true);
  const [fullTall, setFullTall] = useState<boolean>(true); // mantém 100vh sempre

  // URL do iframe do TradingView
  const tvUrl = useMemo(
    () => buildTVUrl(exchange, pair, interval),
    [exchange, pair, interval]
  );

  // grid template conforme posição/visibilidade do painel
  const gridTemplate = useMemo(() => {
    const panelWidth = 360;
    if (!panelVisible) {
      return { gridTemplateColumns: "1fr" };
    }
    return panelSide === "left"
      ? { gridTemplateColumns: `${panelWidth}px 1fr` }
      : { gridTemplateColumns: `1fr ${panelWidth}px` };
  }, [panelSide, panelVisible]);

  // pares por exchange
  const pairOptions = PAIRS[exchange] ?? [];

  // sincroniza par quando troca de exchange (garante par válido)
  React.useEffect(() => {
    if (!pairOptions.includes(pair)) setPair(pairOptions[0] || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchange]);

  return (
    <div style={{ ...pageWrap, height: fullTall ? "100vh" : "100vh" }}>
      {/* Barra de controles */}
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

        {/* Botões utilitários (mantidos) */}
        <button
          style={btn}
          onClick={() =>
            setPanelSide((s) => (s === "left" ? "right" : "left"))
          }
          title="Mover painel"
        >
          {panelSide === "left" ? "Painel → direita" : "Painel → esquerda"}
        </button>

        <button
          style={{ ...btn, background: "#334155" }}
          onClick={() => setPanelVisible((v) => !v)}
          title="Ocultar/Mostrar painel"
        >
          {panelVisible ? "Ocultar painel" : "Mostrar painel"}
        </button>

        <button
          style={{ ...btn, background: "#0ea5e9" }}
          onClick={() => setFullTall((f) => !f)}
          title="Tela cheia (altura 100%)"
        >
          Tela cheia
        </button>
      </div>

      {/* Área principal (grid) */}
      <div style={{ ...layout, ...gridTemplate }}>
        {/* Painel de trade (opcionalmente visível) */}
        {panelVisible && panelSide === "left" && (
          <div style={panelCol}>
            <TradePanel />
          </div>
        )}

        {/* Gráfico TradingView */}
        <div style={chartWrap}>
          <iframe
            title="TradingView"
            src={tvUrl}
            style={iframeStyle}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        </div>

        {/* Painel do lado direito, se escolhido */}
        {panelVisible && panelSide === "right" && (
          <div style={panelCol}>
            <TradePanel />
          </div>
        )}
      </div>
    </div>
  );
}
