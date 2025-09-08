"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SYMBOLS = [
  { code: "BINANCE:BTCUSDT", label: "Bitcoin (BTC)" },
  { code: "BINANCE:ETHUSDT", label: "Ethereum (ETH)" },
  { code: "BINANCE:SOLUSDT", label: "Solana (SOL)" },
  { code: "BINANCE:XRPUSDT", label: "XRP (XRP)" },
  { code: "BINANCE:ADAUSDT", label: "Cardano (ADA)" },
  { code: "BINANCE:LINKUSDT", label: "Chainlink (LINK)" },
  { code: "BINANCE:DOGEUSDT", label: "Dogecoin (DOGE)" },
  { code: "BINANCE:BNBUSDT", label: "BNB (BNB)" },
];

const INDICATOR_NAMES = {
  rsi: "RSI",
  macd: "MACD",
  bb: "Bollinger Bands",
  ema: "Moving Average Exponential",
};

export default function SimuladorPage() {
  const [symbol, setSymbol] = useState(SYMBOLS[0].code);
  const [statusMsg, setStatusMsg] = useState("Carregando gráfico...");
  const [chartReady, setChartReady] = useState(false);

  const wrapperRef = useRef(null);
  const chartBoxRef = useRef(null);
  const containerIdRef = useRef(`tv_chart_${Math.random().toString(36).slice(2)}`);
  const widgetRef = useRef(null);
  const studiesRef = useRef({}); // guarda ids dos indicadores ativos

  // Alturas responsivas sem precisar mexer em CSS global
  const chartStyles = {
    height: "clamp(420px, 62vh, 74vh)", // garante grande e sem ultrapassar viewport
    width: "100%",
    borderRadius: "14px",
    overflow: "hidden",
    background: "#0c1424",
    border: "1px solid rgba(255,255,255,0.06)",
  };

  const panelStyles = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "12px",
  };

  // carrega TradingView e instancia o widget
  useEffect(() => {
    let cancelled = false;

    function initWidget() {
      if (cancelled) return;
      if (!chartBoxRef.current) return;

      // remove widget anterior (troca de símbolo)
      if (widgetRef.current?.remove) {
        try { widgetRef.current.remove(); } catch {}
      }

      const create = () => {
        try {
          const w = new window.TradingView.widget({
            container_id: containerIdRef.current,
            symbol,
            interval: "5",
            autosize: true,             // faz ocupar 100% do box
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "br",
            allow_symbol_change: false,
            hide_top_toolbar: false,
            hide_side_toolbar: false,
            studies: [],
            withdateranges: true,
            details: false,
            hotlist: false,
            calendar: false,
            disabled_features: ["header_saveload"], // reduz ruído
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
    }

    initWidget();

    return () => {
      cancelled = true;
      if (widgetRef.current?.remove) {
        try { widgetRef.current.remove(); } catch {}
      }
      setChartReady(false);
    };
  }, [symbol]);

  // toggle de indicadores com fallback seguro
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

  return (
    <main
      ref={wrapperRef}
      style={{
        minHeight: "100vh",
        padding: "14px",
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
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              style={{
                background: "#0f1830",
                color: "white",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "8px 12px",
              }}
            >
              {SYMBOLS.map((s) => (
                <option key={s.code} value={s.code}>
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

        {/* CHART */}
        <section ref={chartBoxRef} style={chartStyles}>
          <div id={containerIdRef.current} style={{ width: "100%", height: "100%" }} />
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

        {/* PAINEL DE AÇÕES (sem mudar sua lógica atual) */}
        <section
          style={{
            marginTop: 14,
            padding: 14,
            background: "linear-gradient(180deg,#0c1424 0%, #0b1120 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
          }}
        >
          <div style={panelStyles}>
            {/* Coloque aqui seus elementos atuais do painel (saldo, P&L, tamanho da ordem, comprar/vender etc.) 
                Mantive em branco para não conflitar com sua lógica; o importante aqui é o gráfico ocupar bem o topo. */}
            <div style={{ gridColumn: "1 / -1", opacity: 0.7, textAlign: "center" }}>
              Painel de ações — mantenha seu conteúdo atual aqui (comprar, vender, P&L, etc.).
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
