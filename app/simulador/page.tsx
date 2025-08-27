"use client";

import React, { useMemo, useRef, useState } from "react";
import TVChart from "../components/TVChart";

/* ========= Opções do topo ========= */
const EXCHANGES = ["BINANCE", "COINBASE"] as const;
const PAIRS_BY_EXCHANGE: Record<(typeof EXCHANGES)[number], string[]> = {
  BINANCE: ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"],
  COINBASE: ["BTCUSD", "ETHUSD", "SOLUSD"],
};
const INTERVALS: Array<"1m" | "30m" | "1h" | "4h" | "1D"> = [
  "1m",
  "30m",
  "1h",
  "4h",
  "1D",
];

/* Map para o widget do TradingView */
const TV_INTERVAL_MAP: Record<string, "1" | "30" | "60" | "240" | "D"> = {
  "1m": "1",
  "30m": "30",
  "1h": "60",
  "4h": "240",
  "1D": "D",
};

/* ========= Tipos simples ========= */
type Side = "BUY" | "SELL";
type Fill = { time: string; side: Side; qty: number; price: number };

/* ========= Estilos reutilizáveis ========= */
const container: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "360px 1fr",
  gap: "14px",
  height: "var(--vh, 100vh)", // permite ocupar até o rodapé
  padding: "12px",
  boxSizing: "border-box",
};

const topBar: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 8,
  flexWrap: "wrap",
};

const selectStyle: React.CSSProperties = {
  background: "#0b1324",
  color: "#e8eef7",
  border: "1px solid #1f2a44",
  borderRadius: 8,
  padding: "6px 10px",
};

const btn: React.CSSProperties = {
  background: "#0b1324",
  color: "#e8eef7",
  border: "1px solid #1f2a44",
  borderRadius: 10,
  padding: "8px 10px",
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: "#1261ff",
  borderColor: "#1261ff",
};

const card: React.CSSProperties = {
  background: "linear-gradient(180deg,#0b1324 0%, #0a142a 100%)",
  border: "1px solid #1f2a44",
  borderRadius: 14,
  padding: 12,
  color: "#d9e4ff",
};

const label: React.CSSProperties = { fontSize: 12, opacity: 0.85, marginBottom: 6 };
const value: React.CSSProperties = { fontWeight: 700, fontSize: 16 };

/* ========= Página ========= */
export default function SimuladorPage() {
  /* --- Topo --- */
  const [exchange, setExchange] = useState<(typeof EXCHANGES)[number]>("BINANCE");
  const [pair, setPair] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<(typeof INTERVALS)[number]>("1h");

  /* --- Painel lateral --- */
  const [panelOnRight, setPanelOnRight] = useState(false);
  const [panelHidden, setPanelHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* --- Trade simples (mock local, mantendo seus botões) --- */
  const [credits, setCredits] = useState(100_000);
  const [realized, setRealized] = useState(0);
  const [side, setSide] = useState<Side>("BUY");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(10_000);
  const [avgPrice, setAvgPrice] = useState<number | null>(null);
  const [positionQty, setPositionQty] = useState(0);
  const [fills, setFills] = useState<Fill[]>([]);
  const [activeTab, setActiveTab] = useState<"fills" | "historico" | "notas" | "dicas" | "atalhos">("fills");

  // markPrice “manual” (mantemos como referência local para PnL não realizado)
  const markPrice = price;

  const pnlUnrealized = useMemo(() => {
    if (!avgPrice || positionQty === 0) return 0;
    const dir = positionQty > 0 ? 1 : -1; // long vs short
    const diff = (markPrice - avgPrice) * dir;
    return diff * Math.abs(positionQty);
  }, [avgPrice, positionQty, markPrice]);

  const tvSymbol = `${exchange}:${pair}`;
  const tvInterval = TV_INTERVAL_MAP[interval] ?? "60";

  function addFill(s: Side, q: number, p: number) {
    const time = new Date().toLocaleTimeString();
    setFills((f) => [{ time, side: s, qty: q, price: p }, ...f]);
  }

  function onBuy() {
    // abre/aduza long; se estava short, fecha parcial e realiza
    if (positionQty < 0) {
      const closing = Math.min(Math.abs(positionQty), qty);
      const realizedPart = (avgPrice! - price) * closing; // short: ganha se cai
      setRealized((r) => r + realizedPart);
      setPositionQty(positionQty + closing);
    }
    const rest = qty - Math.max(0, -positionQty);
    if (rest > 0) {
      // média de preço
      const newQty = positionQty + rest;
      const newAvg =
        avgPrice === null || positionQty <= 0
          ? price
          : (avgPrice * positionQty + price * rest) / newQty;
      setAvgPrice(newAvg);
      setPositionQty(newQty);
    }
    addFill("BUY", qty, price);
  }

  function onSell() {
    // abre/aduza short; se estava long, fecha parcial e realiza
    if (positionQty > 0) {
      const closing = Math.min(positionQty, qty);
      const realizedPart = (price - avgPrice!) * closing; // long: ganha se sobe
      setRealized((r) => r + realizedPart);
      setPositionQty(positionQty - closing);
    }
    const rest = qty - Math.max(0, positionQty);
    if (rest > 0) {
      const newQty = positionQty - rest;
      const newAvg =
        avgPrice === null || positionQty >= 0
          ? price
          : (avgPrice * Math.abs(positionQty) + price * rest) / Math.abs(newQty);
      setAvgPrice(newAvg);
      setPositionQty(newQty);
    }
    addFill("SELL", qty, price);
  }

  function onReset() {
    setCredits(100_000);
    setRealized(0);
    setSide("BUY");
    setQty(1);
    setPrice(10_000);
    setAvgPrice(null);
    setPositionQty(0);
    setFills([]);
  }

  /* --- Fullscreen via CSS class --- */
  const pageRef = useRef<HTMLDivElement>(null);
  const rootStyles: React.CSSProperties = useMemo(() => {
    const grid = panelHidden ? "0px 1fr" : panelOnRight ? "1fr 360px" : "360px 1fr";
    return {
      ...container,
      gridTemplateColumns: grid,
      height: "100vh",
    };
  }, [panelOnRight, panelHidden]);

  // garante altura útil no mobile iOS/Android
  React.useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh * 100}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);

  return (
    <div ref={pageRef} style={{ height: "100vh", background: "#0a1222" }}>
      {/* Barra do topo */}
      <div style={{ ...topBar, padding: "10px 12px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ ...label, margin: 0 }}>Exchange</span>
          <select
            style={selectStyle}
            value={exchange}
            onChange={(e) => {
              const ex = e.target.value as (typeof EXCHANGES)[number];
              setExchange(ex);
              const firstPair = PAIRS_BY_EXCHANGE[ex][0];
              setPair(firstPair);
            }}
          >
            {EXCHANGES.map((ex) => (
              <option key={ex} value={ex}>
                {ex}
              </option>
            ))}
          </select>

          <span style={{ ...label, margin: 0 }}>Par</span>
          <select
            style={selectStyle}
            value={pair}
            onChange={(e) => setPair(e.target.value)}
          >
            {PAIRS_BY_EXCHANGE[exchange].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <span style={{ ...label, margin: 0 }}>Tempo</span>
          <select
            style={selectStyle}
            value={interval}
            onChange={(e) => setInterval(e.target.value as any)}
          >
            {INTERVALS.map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            style={btn}
            onClick={() => setPanelOnRight((v) => !v)}
            title="Mover painel"
          >
            Painel → {panelOnRight ? "esquerda" : "direita"}
          </button>
          <button
            style={btn}
            onClick={() => setPanelHidden((v) => !v)}
            title="Ocultar/mostrar painel"
          >
            {panelHidden ? "Mostrar painel" : "Ocultar painel"}
          </button>
          <button
            style={btn}
            onClick={() => setIsFullscreen((v) => !v)}
            title="Tela cheia"
          >
            {isFullscreen ? "Sair tela cheia" : "Tela cheia"}
          </button>
        </div>
      </div>

      {/* Grade principal (painel + gráfico) */}
      <div
        style={{
          ...rootStyles,
          paddingTop: 0,
        }}
      >
        {/* Painel de Trade */}
        {!panelHidden && (
          <aside
            style={{
              ...card,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              height: "calc(100vh - 62px)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
              Painel de Trade
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ ...card, padding: 10 }}>
                <div style={label}>Créditos</div>
                <div style={value}>US$ {credits.toLocaleString()}</div>
              </div>
              <div style={{ ...card, padding: 10 }}>
                <div style={label}>Lucro Realizado</div>
                <div style={{ ...value, color: realized >= 0 ? "#29e58e" : "#ff6b6b" }}>
                  US$ {realized.toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <div style={label}>Lado</div>
                <select
                  style={selectStyle}
                  value={side}
                  onChange={(e) => setSide(e.target.value as Side)}
                >
                  <option value="BUY">BUY (Long)</option>
                  <option value="SELL">SELL (Short)</option>
                </select>
              </div>
              <div>
                <div style={label}>Qtd</div>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  style={{ ...selectStyle, width: "100%" }}
                />
              </div>
              <div>
                <div style={label}>Preço</div>
                <input
                  type="number"
                  step={1}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={{ ...selectStyle, width: "100%" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{ ...btn, background: "#29e58e", borderColor: "#29e58e", color: "#0b1324" }}
                onClick={() => (side === "BUY" ? onBuy() : onSell())}
              >
                {side === "BUY" ? "Buy" : "Sell"}
              </button>
              <button
                style={{ ...btn, background: "#ff6b6b", borderColor: "#ff6b6b", color: "#0b1324" }}
                onClick={() => (side === "BUY" ? onSell() : onBuy())}
              >
                {side === "BUY" ? "Sell" : "Buy"}
              </button>
              <button style={btn} onClick={onReset}>
                Reset
              </button>
            </div>

            <div style={{ ...card, padding: 10 }}>
              <div style={label}>Posição</div>
              <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                Lote: <b>{positionQty}</b>{" "}
                {avgPrice ? (
                  <>
                    | Preço Médio: <b>{avgPrice.toFixed(2)}</b>
                  </>
                ) : (
                  "| Preço Médio: —"
                )}
                <br />
                <span>
                  PNL não realizado (mark={markPrice.toLocaleString()}):{" "}
                  <b style={{ color: pnlUnrealized >= 0 ? "#29e58e" : "#ff6b6b" }}>
                    US$ {pnlUnrealized.toFixed(2)}
                  </b>
                </span>
              </div>
            </div>

            {/* Abas simples */}
            <div style={{ ...card, padding: 10, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {(["fills", "historico", "notas", "dicas", "atalhos"] as const).map((tab) => (
                  <button
                    key={tab}
                    style={{
                      ...btn,
                      padding: "6px 10px",
                      background: activeTab === tab ? "#1b2744" : "#0b1324",
                    }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflow: "auto" }}>
                {activeTab === "fills" && (
                  <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", opacity: 0.7 }}>
                        <th>Hora</th>
                        <th>Lado</th>
                        <th>Qtd</th>
                        <th>Preço</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fills.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ paddingTop: 6, opacity: 0.8 }}>
                            (Nenhum ainda)
                          </td>
                        </tr>
                      ) : (
                        fills.map((f, i) => (
                          <tr key={i}>
                            <td>{f.time}</td>
                            <td>{f.side}</td>
                            <td>{f.qty}</td>
                            <td>{f.price}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
                {activeTab !== "fills" && (
                  <div style={{ opacity: 0.8, fontSize: 13 }}>(Em breve)</div>
                )}
              </div>
            </div>

            <button
              style={{
                ...btnPrimary,
                width: "100%",
                marginTop: 2,
                background:
                  "linear-gradient(90deg, #ffc107 0%, #ff9800 100%)",
                borderColor: "#ff9800",
                color: "#141b2d",
                fontWeight: 800,
              }}
              onClick={() => (window.location.href = "/planos")}
              title="Ir para os planos pagos"
            >
              Comprar Plano
            </button>
          </aside>
        )}

        {/* Área do gráfico (preenche até o rodapé) */}
        <section
          style={{
            position: "relative",
            height: "calc(100vh - 62px)",
            border: "1px solid #1f2a44",
            borderRadius: 14,
            overflow: "hidden",
            background: "linear-gradient(180deg,#0b1324 0%, #0a142a 100%)",
          }}
        >
          {/* O componente do TradingView */}
          <TVChart symbol={tvSymbol} interval={tvInterval} />
        </section>
      </div>
    </div>
  );
}
