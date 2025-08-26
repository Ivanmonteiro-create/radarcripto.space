"use client";

import { useMemo, useState } from "react";
import TVChart from "../components/TVChart";
import TradePanel from "../components/TradePanel";

const EXCHANGES = ["BINANCE", "BITSTAMP"] as const;
type Exchange = (typeof EXCHANGES)[number];

const PAIRS: Record<Exchange, string[]> = {
  BINANCE: ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"],
  BITSTAMP: ["BTCUSD", "ETHUSD", "XRPUSD"],
};

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
  const [panelLeft, setPanelLeft] = useState<boolean>(false);

  const pairsForExchange = PAIRS[exchange];
  const fullSymbol = useMemo(() => `${exchange}:${pair}`, [exchange, pair]);

  return (
    <main style={container(panelLeft)}>
      {panelLeft ? (
        <>
          <aside style={aside}>
            <h2 style={panelTitle}>Painel de Trade</h2>
            <TradePanel />
          </aside>

          <section style={chartBox}>
            {/* wrapper relativo para sobrepor os controles sem roubar altura */}
            <div style={chartWrap}>
              <TVChart symbol={fullSymbol} interval={interval} />

              <div style={overlayControls}>
                <div style={controlsRow}>
                  <Select
                    label="Exchange"
                    value={exchange}
                    onChange={(v) => {
                      const ex = v as Exchange;
                      setExchange(ex);
                      setPair(PAIRS[ex][0]);
                    }}
                    options={EXCHANGES.map((ex) => ({ label: ex, value: ex }))}
                  />
                  <Select
                    label="Par"
                    value={pair}
                    onChange={setPair}
                    options={pairsForExchange.map((p) => ({ label: p, value: p }))}
                  />
                  <Select
                    label="Tempo"
                    value={interval}
                    onChange={setInterval}
                    options={INTERVALS.map((i) => ({ label: i.label, value: i.v }))}
                  />
                </div>

                <button style={btnPrimary} onClick={() => setPanelLeft((v) => !v)}>
                  {panelLeft ? "Painel → direita" : "Painel ← esquerda"}
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section style={chartBox}>
            <div style={chartWrap}>
              <TVChart symbol={fullSymbol} interval={interval} />

              <div style={overlayControls}>
                <div style={controlsRow}>
                  <Select
                    label="Exchange"
                    value={exchange}
                    onChange={(v) => {
                      const ex = v as Exchange;
                      setExchange(ex);
                      setPair(PAIRS[ex][0]);
                    }}
                    options={EXCHANGES.map((ex) => ({ label: ex, value: ex }))}
                  />
                  <Select
                    label="Par"
                    value={pair}
                    onChange={setPair}
                    options={pairsForExchange.map((p) => ({ label: p, value: p }))}
                  />
                  <Select
                    label="Tempo"
                    value={interval}
                    onChange={setInterval}
                    options={INTERVALS.map((i) => ({ label: i.label, value: i.v }))}
                  />
                </div>

                <button style={btnPrimary} onClick={() => setPanelLeft((v) => !v)}>
                  {panelLeft ? "Painel → direita" : "Painel ← esquerda"}
                </button>
              </div>
            </div>
          </section>

          <aside style={aside}>
            <h2 style={panelTitle}>Painel de Trade</h2>
            <TradePanel />
          </aside>
        </>
      )}
    </main>
  );
}

/* ---------- componentes auxiliares ---------- */

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label style={selectLabel}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectInput}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------- estilos ---------- */

const container = (panelLeft: boolean): React.CSSProperties => ({
  height: "100vh",
  display: "grid",
  gridTemplateRows: "1fr",                 // sem linha extra (ganha altura)
  gridTemplateColumns: panelLeft ? "560px 1fr" : "1fr 560px",
  gap: 12,
  padding: 12,
  boxSizing: "border-box",
  background: "#0b0f14",
});

const aside: React.CSSProperties = {
  height: "100%",
  overflow: "auto",
  background: "linear-gradient(180deg,#0e141c 0%,#0b1118 100%)",
  border: "1px solid #29313a",
  borderRadius: 12,
  padding: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,.4)",
};

const panelTitle: React.CSSProperties = {
  margin: "0 0 10px",
  color: "#d6e5ff",
  letterSpacing: 0.3,
};

const chartBox: React.CSSProperties = {
  minHeight: 0,
  height: "100%",
  background: "#0f1216",
  border: "1px solid #29313a",
  borderRadius: 12,
  overflow: "hidden",
};

const chartWrap: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
};

const overlayControls: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  display: "flex",
  alignItems: "center",
  gap: 12,
  background: "rgba(9,13,20,.65)",
  backdropFilter: "blur(4px)",
  border: "1px solid #2a3852",
  borderRadius: 12,
  padding: "8px 10px",
};

const controlsRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const selectLabel: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontSize: 12,
  color: "#a8c1ff",
  gap: 6,
};

const selectInput: React.CSSProperties = {
  background: "linear-gradient(180deg,#121822 0%,#0f141c 100%)",
  border: "1px solid #31518d",
  color: "#e8eef6",
  borderRadius: 10,
  padding: "8px 10px",
  minWidth: 120,
  outline: "none",
  boxShadow: "inset 0 0 0 1px rgba(49,81,141,.25)",
};

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(180deg,#3697ff 0%, #1f6feb 100%)",
  border: "1px solid #1f6feb",
  color: "#fff",
  borderRadius: 10,
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 6px 16px rgba(31,111,235,.35)",
};
