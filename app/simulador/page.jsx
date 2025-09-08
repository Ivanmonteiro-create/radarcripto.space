"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

/* =========================
   CONFIG
   ========================= */
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

const CURRENCY = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/* =========================
   PAGE
   ========================= */
export default function SimuladorPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [statusMsg, setStatusMsg] = useState("Carregando gráfico...");
  const [chartReady, setChartReady] = useState(false);

  // preço em tempo real
  const [price, setPrice] = useState(0);

  // conta demo / posição
  const [cash, setCash] = useState(10000); // USDT
  const [orderUSDT, setOrderUSDT] = useState(100);
  const [posQty, setPosQty] = useState(0); // quantidade em cripto
  const [avgPrice, setAvgPrice] = useState(0); // preço médio
  const [history, setHistory] = useState([]); // {time, side, qty, price, value}

  // refs TV
  const containerId = useMemo(
    () => `tv_${Math.random().toString(36).slice(2)}`,
    []
  );
  const widgetRef = useRef(null);
  const studiesRef = useRef({});

  /* -------------------------
     TradingView loader
     ------------------------- */
  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled) return;

      // Remove anterior
      if (widgetRef.current?.remove) {
        try { widgetRef.current.remove(); } catch {}
      }

      const create = () => {
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
            studies: [],
            withdateranges: true,
            disabled_features: ["header_saveload"],
          });
          widgetRef.current = w;
          setStatusMsg("");
          w.onChartReady(() => {
            if (cancelled) return;
            setChartReady(true);
          });
        } catch (e) {
          console.error(e);
          setStatusMsg("Não foi possível iniciar o gráfico.");
        }
      };

      if (window.TradingView?.widget) {
        create();
      } else {
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
          .then(() => create())
          .catch(() => setStatusMsg("Falha ao carregar TradingView."));
      }
    };

    init();

    return () => {
      cancelled = true;
      setChartReady(false);
      if (widgetRef.current?.remove) {
        try { widgetRef.current.remove(); } catch {}
      }
    };
  }, [symbol, containerId]);

  /* -------------------------
     Binance miniTicker WebSocket
     ------------------------- */
  useEffect(() => {
    let ws;
    const url = `wss://stream.binance.com:9443/ws/${symbol.stream}@miniTicker`;

    try {
      ws = new WebSocket(url);
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data?.c) setPrice(parseFloat(data.c));
        } catch {}
      };
      ws.onerror = () => {
        // queda de WS não deve quebrar a página
        console.warn("WS Binance erro");
      };
    } catch (e) {
      console.warn("WS Binance não pôde iniciar", e);
    }

    return () => {
      try { ws && ws.close(); } catch {}
    };
  }, [symbol]);

  /* -------------------------
     Indicadores (toggle)
     ------------------------- */
  const toggleIndicator = async (key) => {
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

  /* -------------------------
     Ações: comprar / vender
     ------------------------- */
  const qtyFromUSDT = price > 0 ? orderUSDT / price : 0;

  const buy = () => {
    if (price <= 0 || orderUSDT <= 0 || orderUSDT > cash) return;

    const qty = orderUSDT / price;
    const newQty = posQty + qty;
    const newAvg =
      posQty > 0 ? (avgPrice * posQty + price * qty) / newQty : price;

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
    const realized = (price - avgPrice) * qty;

    setPosQty((q) => q - qty);
    setCash((c) => c + value);
    setHistory((h) => [
      { time: new Date().toLocaleTimeString(), side: "Venda", qty, price, value },
      ...h,
    ]);

    // se zerou posição, zera preço médio
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

  /* -------------------------
     Derivados
     ------------------------- */
  const positionValue = posQty * price;
  const unrealizedPL = posQty > 0 ? (price - avgPrice) * posQty : 0;
  const totalEquity = cash + positionValue;

  /* -------------------------
     UI
     ------------------------- */
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
        {/* Barra do topo */}
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
                  style={{
                    background: "#13203d",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    padding: "8px 10px",
                    fontSize: 13,
                  }}
                >
                  {INDICATOR_NAMES[k]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
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
          {/* Coluna A: Ações */}
          <div
            style={{
              background: "linear-gradient(180deg,#0c1424 0%, #0b1120 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <h4 style={{ margin: "0 0 10px 0" }}>Ações</h4>
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
              Preço atual: <b>{price > 0 ? CURRENCY(price) : "—"}</b>
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
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.2)",
                background: "#0f1830",
                color: "white",
                marginBottom: 10,
              }}
            />

            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
              ≈ {qtyFromUSDT.toFixed(6)} {symbol.label.split(" ")[0]}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={buy}
                disabled={price <= 0 || orderUSDT <= 0 || orderUSDT > cash}
                style={{
                  flex: 1,
                  background: "#17c964",
                  color: "#042312",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: price <= 0 || orderUSDT > cash ? 0.6 : 1,
                }}
              >
                Comprar
              </button>
              <button
                onClick={sell}
                disabled={price <= 0 || posQty <= 0}
                style={{
                  flex: 1,
                  background: "#f31260",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: price <= 0 || posQty <= 0 ? 0.6 : 1,
                }}
              >
                Vender
              </button>
            </div>

            <button
              onClick={resetAll}
              style={{
                marginTop: 10,
                width: "100%",
                background: "#1f2937",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10,
                padding: "10px 12px",
                cursor: "pointer",
              }}
            >
              Resetar
            </button>
          </div>

          {/* Coluna B: Conta / Posição */}
          <div
            style={{
              background: "linear-gradient(180deg,#0c1424 0%, #0b1120 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <h4 style={{ margin: "0 0 10px 0" }}>Sua conta (demo)</h4>
            <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
              <Row label="Saldo" value={CURRENCY(cash)} />
              <Row label="Quantidade" value={posQty.toFixed(6)} />
              <Row label="Valor da posição" value={CURRENCY(positionValue)} />
              <Row
                label="P&L (não realizado)"
                value={CURRENCY(unrealizedPL)}
                valueColor={unrealizedPL >= 0 ? "#17c964" : "#f31260"}
              />
              <div
                style={{
                  height: 8,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: `${Math.max(
                      5,
                      Math.min(95, (Math.abs(unrealizedPL) / (cash + 1)) * 100)
                    )}%`,
                    height: "100%",
                    background: unrealizedPL >= 0 ? "#17c964" : "#f31260",
                  }}
                />
              </div>
              <Row label="Equity total" value={CURRENCY(totalEquity)} />
            </div>
          </div>

          {/* Coluna C: Histórico */}
          <div
            style={{
              background: "linear-gradient(180deg,#0c1424 0%, #0b1120 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: 14,
              minHeight: 160,
              maxHeight: 280,
              overflow: "auto",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0" }}>Histórico de operações</h4>
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
                    <span style={{ color: t.side === "Compra" ? "#17c964" : "#f31260" }}>
                      {t.side}
                    </span>
                    <span>
                      {t.qty.toFixed(6)} @ {CURRENCY(t.price)}
                    </span>
                    <span style={{ opacity: 0.8 }}>{CURRENCY(t.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================
   Helpers UI
   ========================= */
function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <span style={{ opacity: 0.75 }}>{label}</span>
      <span style={{ fontWeight: 700, color: valueColor || "white" }}>{value}</span>
    </div>
  );
}
