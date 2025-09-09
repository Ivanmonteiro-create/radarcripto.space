"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* ===== Ativos ===== */
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

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function SimuladorPage() {
  /* ===== Estado principal ===== */
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [statusMsg, setStatusMsg] = useState("Carregando gráfico...");
  const [useIframe, setUseIframe] = useState(false);

  const [price, setPrice] = useState(0);
  const [cash, setCash] = useState(10000);
  const [orderUSDT, setOrderUSDT] = useState(100);
  const [posQty, setPosQty] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [history, setHistory] = useState([]);

  const containerId = useMemo(() => `tv_${Math.random().toString(36).slice(2)}`, []);
  const widgetRef = useRef(null);
  const shellRef = useRef(null);

  /* ===== Tela cheia ===== */
  const [isFull, setIsFull] = useState(false);
  const toggleFull = async () => {
    const el = shellRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      setIsFull(true);
    } else {
      await document.exitFullscreen();
      setIsFull(false);
    }
  };
  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (k === "f") toggleFull();
      if ((k === "x" || k === "escape") && document.fullscreenElement) document.exitFullscreen();
    };
    document.addEventListener("fullscreenchange", onChange);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ===== TradingView ===== */
  useEffect(() => {
    let cancelled = false;

    const cleanup = () => {
      if (widgetRef.current?.remove) { try { widgetRef.current.remove(); } catch {} }
      widgetRef.current = null;
    };

    const startWidget = () => {
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
          hide_top_toolbar: false, // toolbar SEMPRE visível
          allow_symbol_change: false,
          withdateranges: true,
          studies: [],
          disabled_features: ["header_saveload"],
        });
        widgetRef.current = w;
        setStatusMsg("");
      } catch (e) {
        console.error("TV widget error:", e);
        setUseIframe(true);
        setStatusMsg("");
      }
    };

    const init = () => {
      if (useIframe) return;
      if (window.TradingView?.widget) {
        startWidget();
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
      window.__tvScriptLoading.then(startWidget).catch(() => {
        setUseIframe(true);
        setStatusMsg("");
      });

      // fallback defensivo
      setTimeout(() => {
        if (!window.TradingView?.widget && !useIframe && !cancelled) {
          setUseIframe(true);
          setStatusMsg("");
        }
      }, 1200);
    };

    cleanup();
    setUseIframe(false);
    setStatusMsg("Carregando gráfico...");
    init();

    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, containerId]);

  /* ===== Preço (WebSocket Binance) ===== */
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

  /* ===== Ações ===== */
  const positionValue = posQty * price;
  const unrealizedPL = posQty > 0 ? (price - avgPrice) * posQty : 0;
  const totalEquity = cash + positionValue;

  const tryBuy = () => {
    if (price <= 0) return alert("Aguarde o preço carregar.");
    if (orderUSDT <= 0) return alert("Informe um tamanho de ordem válido.");
    if (orderUSDT > cash) return alert("Saldo insuficiente.");
    const qty = orderUSDT / price;
    const newQty = posQty + qty;
    const newAvg = posQty > 0 ? (avgPrice * posQty + price * qty) / newQty : price;
    setPosQty(newQty);
    setAvgPrice(newAvg);
    setCash((c) => c - orderUSDT);
    setHistory((h) => [{ time: new Date().toLocaleTimeString(), side: "Compra", qty, price, value: orderUSDT }, ...h]);
  };
  const trySell = () => {
    if (price <= 0) return alert("Aguarde o preço carregar.");
    if (orderUSDT <= 0) return alert("Informe um tamanho de ordem válido.");
    if (posQty <= 0) return alert("Você não tem posição para vender.");
    const qty = Math.min(posQty, orderUSDT / price);
    const value = qty * price;
    setPosQty((q) => q - qty);
    setCash((c) => c + value);
    setHistory((h) => [{ time: new Date().toLocaleTimeString(), side: "Venda", qty, price, value }, ...h]);
    setAvgPrice((prev) => (posQty - qty > 0 ? prev : 0));
  };
  const resetAll = () => { setCash(10000); setOrderUSDT(100); setPosQty(0); setAvgPrice(0); setHistory([]); };

  /* ===== Atalhos “que ficavam atrás” ===== */
  const openIndicators = () => {
    try { widgetRef.current?.chart?.executeActionById?.("insertIndicator"); } catch {}
  };
  const setIntervalTV = (i) => {
    try { widgetRef.current?.chart?.setResolution?.(i); } catch {}
  };
  const openCompare = () => {
    try { widgetRef.current?.chart?.executeActionById?.("insertCompare"); } catch {}
  };

  /* ===== IFRAME fallback ===== */
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
    return u.toString();
  }, [symbol]);

  return (
    <main style={pageBg}>
      <div style={wrap}>
        <div style={grid}>
          {/* ===== GRÁFICO ===== */}
          <section ref={shellRef} style={chartShell}>
            {/* Barra super fina (apenas seletor de ativo) */}
            <div style={thinBar}>
              <span style={{ fontSize: 12, opacity: 0.7, marginRight: 8 }}>Ativo</span>
              <select
                value={symbol.tv}
                onChange={(e) => setSymbol(SYMBOLS.find((s) => s.tv === e.target.value) || SYMBOLS[0])}
                style={selectStyle}
                className="no-outline"
                aria-label="Escolher ativo"
              >
                {SYMBOLS.map((s) => (
                  <option key={s.tv} value={s.tv}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Dock de controles visíveis (o que ficava “atrás”) */}
            <div style={controlDock}>
              <button onClick={openIndicators} style={chip} className="no-outline">Indicadores</button>
              <div style={chipGroup}>
                <button onClick={() => setIntervalTV("1")} style={chipSoft} className="no-outline">1m</button>
                <button onClick={() => setIntervalTV("5")} style={chipSoft} className="no-outline">5m</button>
                <button onClick={() => setIntervalTV("60")} style={chipSoft} className="no-outline">1h</button>
              </div>
              <button onClick={openCompare} style={chip} className="no-outline">Comparar</button>
              <button onClick={toggleFull} style={chipPrimary} className="no-outline">
                {isFull ? "Sair Tela Cheia (X/Esc)" : "Tela Cheia (F)"}
              </button>
              <Link href="/" style={chipSuccess} className="no-outline">Voltar ao Início</Link>
            </div>

            {/* Área do gráfico */}
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
                  {!!statusMsg && <div style={chartStatus}>{statusMsg}</div>}
                </>
              )}
            </div>
          </section>

          {/* ===== PAINEL DIREITO ===== */}
          <aside style={rightCol}>
            <Card title="Ações">
              <div style={muted}>Preço atual: <b>{price > 0 ? money(price) : "—"}</b></div>
              <label style={label}>Tamanho da ordem (USDT)</label>
              <input
                type="number"
                min={1}
                step={1}
                value={orderUSDT}
                onChange={(e) => setOrderUSDT(Math.max(1, Number(e.target.value || 1)))}
                style={inputStyle}
                className="no-outline"
              />
              <div style={tiny}>≈ {(price > 0 ? orderUSDT / price : 0).toFixed(6)} {symbol.label.split(" ")[0]}</div>
              <div style={{ display: "flex", gap: 8 }}>
                {/* SEM disabled nativo: cursor sempre pointer; validação no clique */}
                <button onClick={tryBuy} style={btnBuy} className="no-outline">Comprar</button>
                <button onClick={trySell} style={btnSell} className="no-outline">Vender</button>
              </div>
              <button onClick={resetAll} style={btnReset} className="no-outline">Resetar</button>
            </Card>

            <Card title="Sua conta (demo)">
              <Row label="Saldo" value={money(cash)} />
              <Row label="Quantidade" value={posQty.toFixed(6)} />
              <Row label="Valor da posição" value={money(posQty * price)} />
              <Row label="P&L (não realizado)" value={money(unrealizedPL)} valueColor={unrealizedPL >= 0 ? "#17c964" : "#f31260"} />
              <Row label="Equity total" value={money(totalEquity)} />
            </Card>

            <div style={{ flex: 1 }} />

            <Card title="Histórico">
              {history.length === 0 ? (
                <div style={muted}>Sem operações por enquanto. Faça uma compra ou venda para começar.</div>
              ) : (
                <ul style={histList}>
                  {history.map((t, i) => (
                    <li key={i} style={histItem}>
                      <span style={muted}>{t.time}</span>
                      <span style={{ color: t.side === "Compra" ? "#17c964" : "#f31260" }}>{t.side}</span>
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

      {/* remove “bolinha branca” e toques azuis */}
      <style jsx global>{`
        html, body { height: 100%; }
        * { -webkit-tap-highlight-color: transparent; }
        .no-outline { outline: none !important; box-shadow: none !important; }
        button.no-outline:focus, select.no-outline:focus, input.no-outline:focus { outline: none !important; box-shadow: none !important; }
      `}</style>
    </main>
  );
}

/* ===== componentes ===== */
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

/* ===== estilos ===== */
const pageBg = {
  minHeight: "100vh",
  background:
    "radial-gradient(1200px 600px at 50% -10%, rgba(66,153,255,0.12), transparent 60%), #0a1020",
  color: "rgba(255,255,255,0.92)",
};
/* zera respiro lateral para não sobrar faixa preta */
const wrap = { maxWidth: "100%", margin: 0, padding: 8 };

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 340px",
  gap: 8,
  height: "calc(100vh - 16px)", // ocupa a viewport inteira
  position: "relative",
};

const chartShell = {
  position: "relative",
  background: "#0c1424",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  overflow: "hidden",
  height: "100%",
  zIndex: 1, // abaixo da coluna direita
};

const thinBar = {
  position: "absolute",
  left: 10,
  top: 8,
  zIndex: 3,
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const controlDock = {
  position: "absolute",
  right: 10,
  top: 8,
  zIndex: 3,
  display: "flex",
  gap: 8,
  alignItems: "center",
  flexWrap: "wrap",
};

const chartArea = {
  position: "absolute",
  inset: 0, // ocupa 100% (sem folgas)
};

const chartStatus = {
  position: "absolute", inset: 0, display: "grid", placeItems: "center",
  color: "rgba(255,255,255,0.7)", fontSize: 14,
};

const rightCol = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  height: "100%",
  position: "relative",
  zIndex: 5, // acima do gráfico para receber cliques
};

const card = {
  background: "linear-gradient(180deg,#0c1424 0%, #0b1120 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  padding: 12,
};

const row = { display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 };
const label = { display: "block", fontSize: 12, margin: "8px 0 6px" };
const tiny = { fontSize: 12, opacity: 0.7, marginBottom: 8 };
const muted = { opacity: 0.75, fontSize: 13 };

const selectStyle = {
  background: "#0f1830",
  color: "white",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "6px 10px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "#0f1830",
  color: "white",
};

const btnBuy = {
  flex: 1,
  background: "#17c964",
  color: "#042312",
  border: "none",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: "pointer",
};
const btnSell = {
  flex: 1,
  background: "#f31260",
  color: "white",
  border: "none",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 700,
  cursor: "pointer",
};
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

const chip = {
  background: "rgba(255,255,255,0.08)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "6px 10px",
  fontSize: 12,
  cursor: "pointer",
};
const chipSoft = {
  ...chip,
  background: "rgba(255,255,255,0.06)",
};
const chipGroup = { display: "flex", gap: 6 };
const chipPrimary = {
  background: "#0e6bff",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "6px 10px",
  fontSize: 12,
  cursor: "pointer",
};
const chipSuccess = {
  background: "#14b45c",
  color: "#04170c",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const histList = { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 };
const histItem = {
  display: "grid",
  gridTemplateColumns: "auto auto 1fr auto",
  gap: 8,
  fontSize: 12,
  alignItems: "center",
};
