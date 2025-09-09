"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/** ====== Configurações ====== */
const SYMBOLS = [
  { tv: "BINANCE:BTCUSDT", stream: "btcusdt", label: "Bitcoin (BTC)" },
  { tv: "BINANCE:ETHUSDT", stream: "ethusdt", label: "Ethereum (ETH)" },
  { tv: "BINANCE:SOLUSDT", stream: "solusdt", label: "Solana (SOL)" },
  { tv: "BINANCE:XRPUSDT", stream: "xrpusdt", label: "XRP (XRP)" },
  { tv: "BINANCE:ADAUSDT", stream: "adausdt", label: "Cardano (ADA)" },
  { tv: "BINANCE:LINKUSDT", stream: "linkusdt", label: "Chainlink (LINK)" },
  { tv: "BINANCE:DOGEUSDT", stream: "dogeusdt", label: "Dogecoin (DOGE)" },
  { tv: "BINANCE:BNBUSDT", stream: "bnbusdt", label: "BNB (BNB)" },
];

const INDICATOR_NAMES = {
  rsi: "RSI",
  macd: "MACD",
  ema: "Moving Average Exponential",
  bb: "Bollinger Bands",
};

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/** ====== Página ====== */
export default function SimuladorPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [statusMsg, setStatusMsg] = useState("Carregando gráfico...");
  const [chartReady, setChartReady] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  // Preço em tempo real
  const [price, setPrice] = useState(0);

  // Conta demo / posição
  const [cash, setCash] = useState(10000);
  const [orderUSDT, setOrderUSDT] = useState(100);
  const [posQty, setPosQty] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [history, setHistory] = useState([]);

  // TradingView
  const containerId = useMemo(() => `tv_${Math.random().toString(36).slice(2)}`, []);
  const widgetRef = useRef(null);
  const studiesRef = useRef({});
  const chartShellRef = useRef(null); // container do gráfico (para fullscreen)

  // Fullscreen
  const [isFull, setIsFull] = useState(false);
  const toggleFull = async () => {
    const el = chartShellRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFull(true);
      } else {
        await document.exitFullscreen();
        setIsFull(false);
      }
    } catch {}
  };
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() === "f") toggleFull();
      if (e.key === "Escape" && document.fullscreenElement) document.exitFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // carrega TradingView; se falhar, ativa fallback IFRAME
  useEffect(() => {
    let cancelled = false;

    const cleanup = () => {
      setChartReady(false);
      if (widgetRef.current?.remove) {
        try { widgetRef.current.remove(); } catch {}
      }
      widgetRef.current = null;
      studiesRef.current = {};
    };

    const tryCreateWidget = () => {
      try {
        const w = new window.TradingView.widget({
          container_id: containerId,
          symbol: symbol.tv,
          interval: "5",
          autosize: true,
          theme: "dark",
          timezone: "Etc/UTC",
          style: "1",
          locale: "br",
          hide_side_toolbar: false,
          hide_top_toolbar: false,
          allow_symbol_change: false,
          withdateranges: true,
          studies: [],
          disabled_features: ["header_saveload"],
        });
        widgetRef.current = w;
        setStatusMsg("");
        w.onChartReady(() => {
          if (cancelled) return;
          setChartReady(true);
        });
      } catch (e) {
        console.error("TV widget error:", e);
        setStatusMsg("Não foi possível iniciar o gráfico.");
        setUseIframe(true);
      }
    };

    const start = () => {
      if (cancelled) return;
      if (useIframe) return;

      if (window.TradingView?.widget) {
        tryCreateWidget();
        return;
      }
      if (!window.__tvScriptLoading) {
        window.__tvScriptLoading = new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://s3.tradingview.com/tv.js";
          s.async = true;
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      window.__tvScriptLoading
        .then(() => tryCreateWidget())
        .catch((err) => {
          console.warn("Falha ao carregar tv.js", err);
          setStatusMsg("Não foi possível iniciar o gráfico.");
          setUseIframe(true);
        });

      setTimeout(() => {
        if (!window.TradingView?.widget && !useIframe && !cancelled) {
          console.warn("tv.js não disponível, fallback IFRAME.");
          setUseIframe(true);
          setStatusMsg("");
        }
      }, 1200);
    };

    cleanup();
    setUseIframe(false);
    setStatusMsg("Carregando gráfico...");
    start();

    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, containerId]);

  // WebSocket Binance
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.stream}@miniTicker`);
      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data);
          if (d?.c) setPrice(parseFloat(d.c));
        } catch {}
      };
    } catch {}
    return () => { try { ws && ws.close(); } catch {} };
  }, [symbol]);

  // Indicadores (apenas widget, não no IFRAME)
  const toggleIndicator = async (key) => {
    if (useIframe) return;
    const w = widgetRef.current;
    if (!w || !chartReady) return;
    try {
      const chart = w.activeChart();
      if (!chart) return;
      if (studiesRef.current[key]) {
        chart.removeEntity(studiesRef.current[key]);
        studiesRef.current[key] = null;
      } else {
        const id = chart.createStudy(INDICATOR_NAMES[key], false, false);
        studiesRef.current[key] = id;
      }
    } catch (e) {
      console.warn("Indicador indisponível:", key, e);
    }
  };

  // Trader — buy/sell/reset
  const qtyFromUSDT = price > 0 ? orderUSDT / price : 0;

  const buy = () => {
    if (price <= 0 || orderUSDT <= 0 || orderUSDT > cash) return;
    const qty = orderUSDT / price;
    const newQty = posQty + qty;
    const newAvg = posQty > 0 ? (avgPrice * posQty + price * qty) / newQty : price;
    setPosQty(newQty);
    setAvgPrice(newAvg);
    setCash((c) => c - orderUSDT);
    setHistory((h) => [
      { time: new Date().toLocaleTimeString(), side: "Compra", qty, price, value: orderUSDT },
      ...h,
    ]);
  };

  const sell = () => {
    if (price <= 0 || orderUSDT <= 0 || posQty <= 0) return;
    const qty = Math.min(posQty, orderUSDT / price);
    const value = qty * price;
    setPosQty((q) => q - qty);
    setCash((c) => c + value);
    setHistory((h) => [
      { time: new Date().toLocaleTimeString(), side: "Venda", qty, price, value },
      ...h,
    ]);
    setAvgPrice((prev) => {
      const q = posQty - qty;
      return q > 0 ? prev : 0;
    });
  };

  const resetAll = () => {
    setCash(10000);
    setOrderUSDT(100);
    setPosQty(0);
    setAvgPrice(0);
    setHistory([]);
  };

  const positionValue = posQty * price;
  const unrealizedPL = posQty > 0 ? (price - avgPrice) * posQty : 0;
  const totalEquity = cash + positionValue;

  // URL do fallback IFRAME
  const iframeURL = useMemo(() => {
    const u = new URL("https://s.tradingview.com/widgetembed/");
    u.searchParams.set("symbol", symbol.tv);
    u.searchParams.set("interval", "5");
    u.searchParams.set("theme", "dark");
    u.searchParams.set("hide_top_toolbar", "0");
    u.searchParams.set("hide_side_toolbar", "0");
    u.searchParams.set("allow_symbol_change", "0");
    u.searchParams.set("withdateranges", "1");
    u.searchParams.set("locale", "br");
    u.searchParams.set(
      "studies",
      encodeURIComponent("RSI@tv-basicstudies,MACD@tv-basicstudies,BB@tv-basicstudies,EMA@tv-basicstudies")
    );
    return u.toString();
  }, [symbol]);

  return (
    <main style={pageBg}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 12 }}>
        {/* ===== Grid 2 colunas: gráfico (flexível) + painel direito estreito ===== */}
        <div style={gridWrap}>
          {/* ===== Coluna do gráfico ===== */}
          <section ref={chartShellRef} style={chartShell}>
            {/* Top bar flutuante dentro do gráfico */}
            <div style={chartTopbar}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <strong style={{ fontSize: 14, letterSpacing: 0.3, opacity: 0.9 }}>
                  Simulador de Trading
                </strong>

                <select
                  aria-label="Escolher ativo"
                  value={symbol.tv}
                  onChange={(e) => {
                    const next = SYMBOLS.find((s) => s.tv === e.target.value) || SYMBOLS[0];
                    setSymbol(next);
                  }}
                  style={selectStyle}
                >
                  {SYMBOLS.map((s) => (
                    <option key={s.tv} value={s.tv}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <div style={{ display: "flex", gap: 6 }}>
                  {["rsi", "macd", "ema", "bb"].map((k) => (
                    <button
                      key={k}
                      onClick={() => toggleIndicator(k)}
                      disabled={useIframe}
                      title={useIframe ? "Indicadores editáveis só no modo widget" : ""}
                      style={{
                        ...chipBtn,
                        opacity: useIframe ? 0.6 : 1,
                        cursor: useIframe ? "not-allowed" : "pointer",
                      }}
                    >
                      {INDICATOR_NAMES[k]}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={toggleFull} style={chipPrimary}>
                  {isFull ? "Sair da Tela Cheia (X/Esc)" : "Tela Cheia (F)"}
                </button>
                <Link href="/" style={chipSuccess}>Voltar ao Início</Link>
              </div>
            </div>

            {/* Área do gráfico (widget ou iframe) */}
            <div style={chartArea}>
              {useIframe ? (
                <iframe
                  title={`Chart ${symbol.tv}`}
                  src={iframeURL}
                  style={{ border: 0, width: "100%", height: "100%" }}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <>
                  <div id={containerId} style={{ width: "100%", height: "100%" }} />
                  {!!statusMsg && (
                    <div style={chartStatus}>{statusMsg}</div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* ===== Coluna direita: painel compacto ===== */}
          <aside style={rightCol}>
            {/* Ações */}
            <Card title="Ações">
              <div style={muted}>
                Preço atual: <b>{price > 0 ? money(price) : "—"}</b>
              </div>

              <label style={label}>Tamanho da ordem (USDT)</label>
              <input
                type="number"
                min={1}
                step={1}
                value={orderUSDT}
                onChange={(e) => setOrderUSDT(Math.max(1, Number(e.target.value || 1)))}
                style={inputStyle}
              />
              <div style={tiny}>
                ≈ {(price > 0 ? orderUSDT / price : 0).toFixed(6)}{" "}
                {symbol.label.split(" ")[0]}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={buy}
                  disabled={price <= 0 || orderUSDT <= 0 || orderUSDT > cash}
                  style={btnBuy(price <= 0 || orderUSDT > cash)}
                >
                  Comprar
                </button>
                <button
                  onClick={sell}
                  disabled={price <= 0 || posQty <= 0}
                  style={btnSell(price <= 0 || posQty <= 0)}
                >
                  Vender
                </button>
              </div>

              <button onClick={resetAll} style={btnReset}>Resetar</button>
            </Card>

            {/* Conta/Posição */}
            <Card title="Sua conta (demo)">
              <Row label="Saldo" value={money(cash)} />
              <Row label="Quantidade" value={posQty.toFixed(6)} />
              <Row label="Valor da posição" value={money(positionValue)} />
              <Row
                label="P&L (não realizado)"
                value={money(unrealizedPL)}
                valueColor={unrealizedPL >= 0 ? "#17c964" : "#f31260"}
              />
              <Row label="Equity total" value={money(totalEquity)} />
            </Card>

            {/* Histórico */}
            <Card title="Histórico">
              {history.length === 0 ? (
                <div style={muted}>Sem operações por enquanto.</div>
              ) : (
                <ul style={histList}>
                  {history.map((t, i) => (
                    <li key={i} style={histItem}>
                      <span style={muted}>{t.time}</span>
                      <span style={{ color: t.side === "Compra" ? "#17c964" : "#f31260" }}>
                        {t.side}
                      </span>
                      <span>{t.qty.toFixed(6)} @ {money(t.price)}</span>
                      <span style={muted}>{money(t.value)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

/** ====== UI Helpers ====== */
function Card({ title, children }) {
  return (
    <div style={card}>
      <h4 style={{ margin: "0 0 8px 0", fontSize: 14 }}>{title}</h4>
      {children}
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div style={row}>
      <span style={muted}>{label}</span>
      <span style={{ fontWeight: 700, color: valueColor || "white" }}>{value}</span>
    </div>
  );
}

/** ====== Styles (inline) ====== */
const pageBg = {
  minHeight: "100vh",
  background:
    "radial-gradient(1200px 600px at 50% -10%, rgba(66,153,255,0.12), transparent 60%), #0a1020",
  color: "rgba(255,255,255,0.92)",
};

const gridWrap = {
  display: "grid",
  gridTemplateColumns: "1fr 320px", // gráfico ocupa todo o resto; direita ~320px
  gap: 12,
};

const chartShell = {
  position: "relative",
  background: "#0c1424",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  overflow: "hidden",
  minHeight: "min(78vh, 860px)",
};

const chartTopbar = {
  position: "absolute",
  top: 10,
  right: 10,
  left: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "8px 10px",
  background: "rgba(8,12,26,0.55)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  zIndex: 3,
  backdropFilter: "blur(6px)",
};

const chartArea = {
  position: "absolute",
  inset: 0,
};

const chartStatus = {
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  color: "rgba(255,255,255,0.7)",
  fontSize: 14,
};

const rightCol = {
  display: "grid",
  gridAutoRows: "min-content",
  gap: 12,
};

const card = {
  background: "linear-gradient(180deg,#0c1424 0%, #0b1120 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  padding: 12,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 6,
};

const label = { display: "block", fontSize: 12, margin: "8px 0 6px" };
const tiny = { fontSize: 12, opacity: 0.7, marginBottom: 8 };
const muted = { opacity: 0.75, fontSize: 13 };

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "#0f1830",
  color: "white",
};

const btnBuy = (disabled) => ({
  flex: 1,
  background: "#17c964",
  color: "#042312",
  border: "none",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
});

const btnSell = (disabled) => ({
  flex: 1,
  background: "#f31260",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
});

const btnReset = {
  marginTop: 8,
  width: "100%",
  background: "#1f2937",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "10px 12px",
  cursor: "pointer",
};

const chipBtn = {
  background: "#13203d",
  color: "white",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "8px 10px",
  fontSize: 12,
};

const chipPrimary = {
  ...chipBtn,
  background: "#0e6bff",
  borderColor: "rgba(255,255,255,0.15)",
};

const chipSuccess = {
  ...chipBtn,
  background: "#14b45c",
  color: "#04170c",
  fontWeight: 700,
};

const selectStyle = {
  background: "#0f1830",
  color: "white",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "8px 12px",
};

const histList = { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 };
const histItem = {
  display: "grid",
  gridTemplateColumns: "auto auto 1fr auto",
  gap: 8,
  fontSize: 12,
  alignItems: "center",
};
