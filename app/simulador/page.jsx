"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

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
  bb: "Bollinger Bands",
  ema: "Moving Average Exponential",
};

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function SimuladorPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [statusMsg, setStatusMsg] = useState("Carregando gráfico...");
  const [chartReady, setChartReady] = useState(false);
  const [useIframe, setUseIframe] = useState(false); // Fallback definitivo

  // preço em tempo real
  const [price, setPrice] = useState(0);

  // conta demo / posição
  const [cash, setCash] = useState(10000);
  const [orderUSDT, setOrderUSDT] = useState(100);
  const [posQty, setPosQty] = useState(0);
  const [avgPrice, setAvgPrice] = useState(0);
  const [history, setHistory] = useState([]);

  // TradingView
  const containerId = useMemo(
    () => `tv_${Math.random().toString(36).slice(2)}`,
    []
  );
  const widgetRef = useRef(null);
  const studiesRef = useRef({});

  // carrega TradingView; se falhar, ativa IFRAME
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
        setUseIframe(true); // ativa fallback
      }
    };

    const start = () => {
      if (cancelled) return;
      // se já estamos em IFRAME, não tenta script
      if (useIframe) return;

      // se lib já está no window
      if (window.TradingView?.widget) {
        tryCreateWidget();
        return;
      }
      // carrega script uma vez globalmente
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

      // segunda tentativa em 1,2s (caso onload não dispare)
      setTimeout(() => {
        if (!window.TradingView?.widget && !useIframe && !cancelled) {
          console.warn("tv.js não disponível, ativando fallback IFRAME.");
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

  // WebSocket Binance — preço em tempo real
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

  // Indicadores (TV Widget apenas)
  const toggleIndicator = async (key) => {
    if (useIframe) return; // indicadores só no widget
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
    // estudos default só no iframe (opcional)
    u.searchParams.set(
      "studies",
      encodeURIComponent("RSI@tv-basicstudies,MACD@tv-basicstudies,BB@tv-basicstudies,EMA@tv-basicstudies")
    );
    return u.toString();
  }, [symbol]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 14,
        background:
          "radial-gradient(1200px 600px at 50% -10%, rgba(66,153,255,0.12), transparent 60%), #0a1020",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <strong style={{ fontSize: 18, letterSpacing: 0.3 }}>Simulador de Trading</strong>

            <select
              aria-label="Escolher ativo"
              value={symbol.tv}
              onChange={(e) => {
                const next = SYMBOLS.find((s) => s.tv === e.target.value) || SYMBOLS[0];
                setSymbol(next);
              }}
              style={{
                background: "#0f1830",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "8px 12px",
              }}
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
                  title={useIframe ? "Indicadores editáveis só no gráfico embutido (não-IFRAME)" : ""}
                  style={{
                    background: "#13203d",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 13,
                    opacity: useIframe ? 0.6 : 1,
                    cursor: useIframe ? "not-allowed" : "pointer",
                  }}
                >
                  {INDICATOR_NAMES[k]}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/"
            style={{
              background: "#14b45c",
              color: "#05130b",
              border: "none",
              borderRadius: 12,
              padding: "10px 14px",
              fontWeight: 700,
            }}
          >
            Voltar ao Início
          </Link>
        </div>

        {/* Gráfico */}
        <section
          style={{
            position: "relative",
            height: "clamp(420px, 62vh, 74vh)",
            width: "100%",
            borderRadius: 14,
            overflow: "hidden",
            background: "#0c1424",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
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
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 14,
                  }}
                >
                  {statusMsg}
                </div>
              )}
            </>
          )}
        </section>

        {/* Painel de Trader */}
        <section
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr",
            gap: 12,
          }}
        >
          {/* Ações */}
          <Card title="Ações">
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
              Preço atual: <b>{price > 0 ? money(price) : "—"}</b>
            </div>

            <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
              Tamanho da ordem (USDT)
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={orderUSDT}
              onChange={(e) => setOrderUSDT(Math.max(1, Number(e.target.value || 1)))}
              style={inputStyle}
            />

            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
              ≈ {(price > 0 ? orderUSDT / price : 0).toFixed(6)} {symbol.label.split(" ")[0]}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
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

            <button onClick={resetAll} style={btnReset}>
              Resetar
            </button>
          </Card>

          {/* Conta/Posição */}
          <Card title="Sua conta (demo)">
            <Row label="Saldo" value={money(cash)} />
            <Row label="Quantidade" value={posQty.toFixed(6)} />
            <Row label="Valor da posição" value={money(posQty * price)} />
            <Row
              label="P&L (não realizado)"
              value={money(posQty > 0 ? (price - avgPrice) * posQty : 0)}
              valueColor={posQty > 0 && price - avgPrice >= 0 ? "#17c964" : "#f31260"}
            />
            <Progress
              valuePct={Math.max(
                5,
                Math.min(95, (Math.abs(posQty > 0 ? (price - avgPrice) * posQty : 0) / (cash + 1)) * 100)
              )}
              color={posQty > 0 && price - avgPrice >= 0 ? "#17c964" : "#f31260"}
            />
            <Row label="Equity total" value={money(cash + posQty * price)} />
          </Card>

          {/* Histórico */}
          <Card title="Histórico de operações">
            {history.length === 0 ? (
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                Sem operações por enquanto. Faça uma compra ou venda para começar.
              </div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                {history.map((t, i) => (
                  <li
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto auto 1fr auto",
                      gap: 8,
                      fontSize: 13,
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.6 }}>{t.time}</span>
                    <span style={{ color: t.side === "Compra" ? "#17c964" : "#f31260" }}>{t.side}</span>
                    <span>
                      {t.qty.toFixed(6)} @ {money(t.price)}
                    </span>
                    <span style={{ opacity: 0.8 }}>{money(t.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}

/* ------- UI helpers ------- */
function Card({ title, children }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg,#0c1424 0%, #0b1120 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: 14,
      }}
    >
      <h4 style={{ margin: "0 0 10px 0" }}>{title}</h4>
      {children}
    </div>
  );
}

function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
      <span style={{ opacity: 0.75 }}>{label}</span>
      <span style={{ fontWeight: 700, color: valueColor || "white" }}>{value}</span>
    </div>
  );
}

function Progress({ valuePct, color }) {
  return (
    <div
      style={{
        height: 8,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 999,
        overflow: "hidden",
        margin: "4px 0 8px",
      }}
    >
      <div style={{ width: `${valuePct}%`, height: "100%", background: color }} />
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "#0f1830",
  color: "white",
  marginBottom: 10,
};

const btnBuy = (disabled) => ({
  flex: 1,
  background: "#17c964",
  color: "#042312",
  border: "none",
  borderRadius: 12,
  padding: "12px 14px",
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
});

const btnSell = (disabled) => ({
  flex: 1,
  background: "#f31260",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 14px",
  fontWeight: 700,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.6 : 1,
});

const btnReset = {
  marginTop: 10,
  width: "100%",
  background: "#1f2937",
  color: "white",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "10px 12px",
  cursor: "pointer",
};
