"use client";

import { useMemo, useState } from "react";
import TVChart from "../components/TVChart";
import TradePanel from "../components/TradePanel";

/* ===== catálogo simples de exchanges e pares ===== */
const EXCHANGES = ["BINANCE", "BITSTAMP"] as const;
type Exchange = (typeof EXCHANGES)[number];

const PAIRS: Record<Exchange, string[]> = {
  BINANCE: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "SOLUSDT"],
  BITSTAMP: ["BTCUSD", "ETHUSD"], // Bitstamp não usa *USDT*
};

/* intervalos aceitos pelo embed do TradingView */
const INTERVALS = [
  { label: "1m", v: "1" },
  { label: "5m", v: "5" },
  { label: "15m", v: "15" },
  { label: "1h", v: "60" },
  { label: "4h", v: "240" },
  { label: "1D", v: "D" },
];

export default function SimuladorPage() {
  const [exchange, setExchange] = useState<Exchange>("BINANCE");
  const [pair, setPair] = useState<string>(PAIRS.BINANCE[0]);
  const [interval, setInterval] = useState<string>("60");
  const [panelLeft, setPanelLeft] = useState<boolean>(false); // false = painel à direita

  // quando muda a exchange, garante que o par exista
  const pairsForExchange = PAIRS[exchange];
  const fullSymbol = useMemo(() => `${exchange}:${pair}`, [exchange, pair]);

  return (
    <main style={container(panelLeft)}>
      {/* CABEÇALHO DE CONTROLES (fica acima do gráfico) */}
      <div style={controlsBar}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Exchange */}
          <label style={label}>
            Exchange
            <select
              value={exchange}
              onChange={(e) => {
                const ex = e.target.value as Exchange;
                setExchange(ex);
                setPair(PAIRS[ex][0]); // troca para o 1º par daquela exchange
              }}
              style={select}
            >
              {EXCHANGES.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </label>

          {/* Par */}
          <label style={label}>
            Par
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              style={select}
            >
              {pairsForExchange.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          {/* Intervalo */}
          <label style={label}>
            Tempo
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              style={select}
            >
              {INTERVALS.map((i) => (
                <option key={i.v} value={i.v}>
                  {i.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Toggle lado do painel */}
        <button style={btn} onClick={() => setPanelLeft((v) => !v)}>
          {panelLeft ? "Painel → direita" : "Painel ← esquerda"}
        </button>
      </div>

      {/* PAINEL + GRÁFICO (ordem depende do toggle) */}
      {panelLeft ? (
        <>
          <aside style={aside}>
            <h2 style={{ margin: "0 0 8px" }}>Painel de Trade</h2>
            <TradePanel />
          </aside>
          <section style={chartBox}>
            <TVChart symbol={fullSymbol} interval={interval} />
          </section>
        </>
      ) : (
        <>
          <section style={chartBox}>
            <TVChart symbol={fullSymbol} interval={interval} />
          </section>
          <aside style={aside}>
            <h2 style={{ margin: "0 0 8px" }}>Painel de Trade</h2>
            <TradePanel />
          </aside>
        </>
      )}
    </main>
  );
}

/* ================= estilos inline simples ================= */
const container = (panelLeft: boolean): React.CSSProperties => ({
  display: "grid",
  gridTemplateColumns: panelLeft ? "360px 1fr" : "1fr 360px",
  gridTemplateRows: "auto 1fr",
  gap: 12,
  height: "calc(100vh - 24px)",
  padding: 12,
  boxSizing: "border-box",
  alignItems: "stretch",
});

const controlsBar: React.CSSProperties = {
  gridColumn: "1 / -1",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  background: "#0f1216",
  border: "1px solid #2b2b2b",
  borderRadius: 8,
  padding: "10px 12px",
};

const label: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  fontSize: 12,
};

const select: React.CSSProperties = {
  background: "#151a21",
  border: "1px solid #2b2b2b",
  color: "#e8eef6",
  borderRadius: 6,
  padding: "8px 10px",
  minWidth: 120,
};

const btn: React.CSSProperties = {
  background: "#1f6feb",
  border: 0,
  color: "white",
  borderRadius: 8,
  padding: "10px 14px",
  cursor: "pointer",
};

const aside: React.CSSProperties = {
  height: "100%",
  overflow: "auto",
  background: "#0f1216",
  border: "1px solid #2b2b2b",
  borderRadius: 8,
  padding: 12,
};

const chartBox: React.CSSProperties = {
  background: "#0f1216",
  border: "1px solid #2b2b2b",
  borderRadius: 8,
  overflow: "hidden",
};
