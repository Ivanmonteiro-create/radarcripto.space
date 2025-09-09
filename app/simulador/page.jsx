"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* ---------- Ativos disponíveis ---------- */
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
  /* ---------- estado base ---------- */
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [statusMsg, setStatusMsg] = useState("Carregando gráfico...");
  const [chartReady, setChartReady] = useState(false);
  const [useIframe, setUseIframe] = useState(false);

  const [price, setPrice] = useState(0);
  const [cash, setCash] = useState(10000);
  const [orderUSDT, setOrderUSDT] = useState(100);
  const [posQty, setPosQty] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [history, setHistory] = useState([]);

  /* ---------- TradingView refs ---------- */
  const containerId = useMemo(() => `tv_${Math.random().toString(36).slice(2)}`, []);
  const widgetRef = useRef(null);
  const chartShellRef = useRef(null);

  /* ---------- Fullscreen ---------- */
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
      const k = e.key.toLowerCase();
      if (k === "f") toggleFull();
      if (k === "x" && document.fullscreenElement) document.exitFullscreen();
      if (k === "escape" && document.fullscreenElement) document.exitFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- Monta TradingView; se falhar, cai para IFRAME ---------- */
  useEffect(() => {
    let cancelled = false;

    const cleanup = () => {
      setChartReady(false);
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
      window.__tvScriptLoading
        .then(startWidget)
        .catch(() => {
          setStatusMsg("Não foi possível iniciar o gráfico.");
          setUseIframe(true);
        });

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

  /* ---------- WebSocket preço ---------- */
  useEffect(() => {
    let ws;
    try {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.stream}@miniTicker`);
      ws.onmessage = (ev) => {
        try { const d = JSON.parse(ev.data); if (d?.c) setPrice(parseFloat(d.c)); } catch {}
      };
    } catch {}
    return () => { try { ws && ws.close(); } catch {} };
  }, [symbol]);

  /* ---------- Trader simples ---------- */
  const buy = () => {
    if (price <= 0 || orderUSDT <= 0 || orderUSDT > cash) return;
    const qty = orderUSDT / price;
    const newQty = posQty + qty;
    const newAvg = posQty > 0 ? (avgPrice * posQty + price * qty) / newQty : price;
    setPosQty(newQty);
    setAvgPrice(newAvg);
    setCash((c) => c - orderUSDT);
    setHistory((h) => [{ time: new Date().toLocaleTimeString(), side: "Compra", qty, price, value: orderUSDT }, ...h]);
  };
  const sell = () => {
    if (price <= 0 || orderUSDT <= 0 || posQty <= 0) return;
    const qty = Math.min(posQty, orderUSDT / price);
    const value = qty * price;
    setPosQty((q) => q - qty);
    setCash((c) => c + value);
    setHistory((h) => [{ time: new Date().toLocaleTimeString(), side: "Venda", qty, price, value }, ...h]);
    setAvgPrice((prev) => (posQty - qty > 0 ? prev : 0));
  };
  const resetAll = () => {
    setCash(10000); setOrderUSDT(100); setPosQty(0); setAvgPrice(0); setHistory([]);
  };

  const positionValue = posQty * price;
  const unrealizedPL = posQty > 0 ? (price - avgPrice) * posQty : 0;
  const totalEquity = cash + positionValue;

  /* ---------- URL do fallback IFRAME ---------- */
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

  /* ---------- UI ---------- */
  return (
    <main style={pageBg}>
      {/* grid com altura de viewport para alinhar fundos na mesma linha do rodapé */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 12, height: "calc(100vh - 24px)" }}>
        <div style={gridWrap}>
          {/* ======== GRÁFICO ======== */}
          <section ref={chartShellRef} style={chartShell}>
            {/* seletor de ativo fora da barra do TradingView (não cobre a área do topo) */}
            <div style={symbolDock}>
              <label style={{ fontSize: 11, opacity: 0.7 }}>Gráfico —</label>
              <select
                value={symbol.tv}
                onChange={(e) => {
                  const next = SYMBOLS.find((s) => s.tv === e.target.value) || SYMBOLS[0];
                  setSymbol(next);
                }}
                style={selectStyle}
                aria-label="Escolher ativo"
              >
                {SYMBOLS.map((s) => (
                  <option key={s.tv} value={s.tv}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* ações rápidas (não cobre a barra superior do TV) */}
            <div style={floatingActions}>
              <button onClick={toggleFull} style={chipPrimary} className="no-outline">
                {isFull ? "Sair Tela Cheia (X/Esc)" : "Tela Cheia (F)"}
              </button>
              <Link href="/" style={chipSuccess} className="no-outline">Voltar ao Início</Link>
            </div>

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

          {/* ======== PAINEL DIREITO (vai até o rodapé) ======== */}
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
                <button onClick={buy} disabled={price <= 0 || orderUSDT <= 0 || orderUSDT > cash} style={btnBuy(price <= 0 || orderUSDT > cash)} className="no-outline">Comprar</button>
                <button onClick={sell} disabled={price <= 0 || posQty <= 0} style={btnSell(price <= 0 || posQty <= 0)} className="no-outline">Vender</button>
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

            {/* ocupa o espaço restante para “colar” o histórico no rodapé */}
            <div style={{ flex: 1 }} />

            <Card title="Histórico">
              {history.length === 0 ? (
                <div style={muted}>Sem operações por enquanto.</div>
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

      {/* remove “bolinha branca” de foco em botões/inputs (apenas aqui) */}
      <style jsx global>{`
        .no-outline { outline: none !important; box-shadow: none !important; }
        button.no-outline:focus, select.no-outline:focus, input.no-outline:focus { outline: none !important; box-shadow: none !important; }
      `}</style>
    </main>
  );
}

/* ---------- componentes pequenos ---------- */
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

/* ---------- estilos ---------- */
const pageBg = {
  minHeight: "100vh",
  background:
    "radial-gradient(1200px 600px at 50% -10%, rgba(66,153,255,0.12), transparent 60%), #0a1020",
  color: "rgba(255,255,255,0.92)",
};
const gridWrap = {
  display: "grid",
  gridTemplateColumns: "1fr 320px",
  gap: 12,
  height: "100%", // força as colunas a terem a mesma altura
};
const chartShell = {
  position: "relative",
  background: "#0c1424",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  overflow: "hidden",
  height: "100%", // ocupa toda a altura da linha
};
const chartArea = { position: "absolute", inset: 0 };
const chartStatus = {
  position: "absolute", inset: 0, display: "grid", placeItems: "center",
  color: "rgba(255,255,255,0.7)", fontSize: 14,
};
/* seletor de símbolo ancorado no canto superior ESQUERDO do gráfico,
   pequeno e transparente para não cobrir a barra do TradingView */
const symbolDock = {
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 3,
  display: "flex",
  gap: 8,
  alignItems: "center",
  padding: "6px 8px",
  background: "rgba(8,12,26,0.45)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  backdropFilter: "blur(4px)",
  pointerEvents: "auto",
};
/* ações flutuantes encostadas à direita, centralizadas verticalmente */
const floatingActions = {
  position: "absolute",
  top: "50%",
  right: 10,
  transform: "translateY(-50%)",
  zIndex: 3,
  display: "grid",
  gap: 8,
};
const rightCol = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  height: "100%",      // ocupa a mesma altura do gráfico
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
const chipPrimary = {
  background: "#0e6bff",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "8px 10px",
  fontSize: 12,
  cursor: "pointer",
};
const chipSuccess = {
  background: "#14b45c",
  color: "#04170c",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "8px 10px",
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
