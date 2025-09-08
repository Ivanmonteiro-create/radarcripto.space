// app/simulador/page.jsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   SIMULADOR PRO (sem sidebar)
   - Topo com botão "Voltar ao Início"
   - Gráfico TradingView maior ao centro
   - Conta demo + Comprar/Vender + P&L + Histórico
   - Estilos escopados (.pro-sim) -> Home não é afetada
========================================================= */

const COINS = [
  { id: "bitcoin", label: "Bitcoin (BTC)" },
  { id: "ethereum", label: "Ethereum (ETH)" },
  { id: "solana", label: "Solana (SOL)" },
  { id: "binancecoin", label: "BNB" },
  { id: "cardano", label: "Cardano (ADA)" },
  { id: "ripple", label: "XRP" },
  { id: "chainlink", label: "Chainlink (LINK)" },
  { id: "dogecoin", label: "Dogecoin (DOGE)" },
];

const TV_SYMBOLS = {
  bitcoin: "BINANCE:BTCUSDT",
  ethereum: "BINANCE:ETHUSDT",
  solana: "BINANCE:SOLUSDT",
  binancecoin: "BINANCE:BNBUSDT",
  cardano: "BINANCE:ADAUSDT",
  ripple: "BINANCE:XRPUSDT",
  chainlink: "BINANCE:LINKUSDT",
  dogecoin: "BINANCE:DOGEUSDT",
};

const fmtUSD = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
    .format(Number.isFinite(v) ? v : 0);

export default function SimuladorPro() {
  const [moeda, setMoeda] = useState("bitcoin");
  const [preco, setPreco] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [saldo, setSaldo] = useState(10000);
  const [qtd, setQtd] = useState(0);
  const [tamanhoOrdem, setTamanhoOrdem] = useState(100);
  const [historico, setHistorico] = useState([]);

  // ===== preço ao vivo (CoinGecko) =====
  useEffect(() => {
    let off = false;
    async function fetchPreco() {
      setCarregando(true);
      setErro("");
      try {
        const r = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${moeda}&vs_currencies=usd`,
          { cache: "no-store" }
        );
        if (!r.ok) throw new Error("Falha ao buscar preço");
        const d = await r.json();
        if (!off) setPreco(d[moeda]?.usd ?? 0);
      } catch (e) {
        if (!off) setErro("Não foi possível atualizar o preço agora.");
        console.error(e);
      } finally {
        if (!off) setCarregando(false);
      }
    }
    fetchPreco();
    const id = setInterval(fetchPreco, 15000);
    return () => {
      off = true;
      clearInterval(id);
    };
  }, [moeda]);

  const valorPosicao = useMemo(() => qtd * preco, [qtd, preco]);
  const pnl = useMemo(() => valorPosicao, [valorPosicao]);

  // ===== ordens =====
  function comprar() {
    if (preco <= 0 || tamanhoOrdem <= 0 || tamanhoOrdem > saldo) return;
    const q = tamanhoOrdem / preco;
    setQtd((x) => x + q);
    setSaldo((s) => s - tamanhoOrdem);
    setHistorico((h) => [
      { tipo: "Compra", preco, qtd: q, data: new Date().toISOString(), moeda },
      ...h,
    ]);
  }
  function vender() {
    if (qtd <= 0 || preco <= 0) return;
    const valor = qtd * preco;
    setSaldo((s) => s + valor);
    setHistorico((h) => [
      { tipo: "Venda", preco, qtd, data: new Date().toISOString(), moeda },
      ...h,
    ]);
    setQtd(0);
  }
  function resetar() {
    if (!confirm("Deseja resetar saldo, posição e histórico?")) return;
    setSaldo(10000);
    setQtd(0);
    setHistorico([]);
  }

  // ===== TradingView =====
  const chartRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/tv.js";
    s.onload = () => {
      scriptLoadedRef.current = true;
      renderWidget();
    };
    document.body.appendChild(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scriptLoadedRef.current) renderWidget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moeda]);

  function renderWidget() {
    if (!window.TradingView || !chartRef.current) return;
    chartRef.current.innerHTML = "";
    /* global TradingView */
    new window.TradingView.widget({
      autosize: true,
      symbol: TV_SYMBOLS[moeda] || "BINANCE:BTCUSDT",
      interval: "1",             // 1m para dinâmica
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",                // candles
      locale: "br",
      toolbar_bg: "#0b1220",
      hide_top_toolbar: false,
      hide_legend: false,
      container_id: chartRef.current.id,
      studies: ["STD;EMA", "STD;RSI"], // EMA + RSI
    });
  }

  // ===== UI =====
  return (
    <div className="pro-sim min-h-screen w-full">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        {/* topo */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="btn secondary" style={{ width: "auto", padding: ".55rem .9rem" }}>
              Voltar ao Início
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Simulador de Trading
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select value={moeda} onChange={(e) => setMoeda(e.target.value)}>
              {COINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <button className="btn secondary" onClick={resetar}>
              Resetar
            </button>
          </div>
        </div>

        {/* grid principal: gráfico grande | painel */}
        <div
          className="sim-grid"
          style={{
            // força 2 colunas em telas grandes (gráfico | painel)
            gridTemplateColumns: "1fr",
          }}
        >
          {/* em >=1024px vira 2 colunas */}
          <style jsx>{`
            @media (min-width: 1024px) {
              .sim-grid {
                grid-template-columns: 1fr 360px !important;
              }
            }
          `}</style>

          {/* gráfico (MAIOR) */}
          <section className="card chart-wrap">
            <div className="chart-head">
              <span>Gráfico — {COINS.find((c) => c.id === moeda)?.label}</span>
              <span className="chip">
                {carregando ? "Atualizando…" : fmtUSD(preco)}
              </span>
            </div>
            <div
              id="tradingview_chart_container"
              ref={chartRef}
              className="chart-box"
              style={{ height: 620 }}
            />
          </section>

          {/* painel direito */}
          <aside className="card panel">
            <div className="section-title">Sua conta (demo)</div>
            <div className="stat">
              <span className="muted">Saldo</span>
              <strong className="strong">{fmtUSD(saldo)}</strong>
            </div>
            <div className="stat">
              <span className="muted">Quantidade</span>
              <span className="strong font-mono">{qtd.toFixed(6)}</span>
            </div>
            <div className="stat">
              <span className="muted">Valor da posição</span>
              <span className="strong">{fmtUSD(qtd * preco)}</span>
            </div>
            <div className={`pnl-pos ${pnl >= 0 ? "g" : "r"}`}>
              <span>P&L (não realizado)</span>
              <strong>{fmtUSD(pnl)}</strong>
            </div>

            <div className="section-title" style={{ marginTop: "1rem" }}>
              Ações
            </div>
            <label className="muted" style={{ fontSize: ".9rem" }}>
              Tamanho da ordem (USDT)
            </label>
            <input
              type="number"
              min={10}
              step={10}
              value={tamanhoOrdem}
              onChange={(e) =>
                setTamanhoOrdem(Math.max(0, Number(e.target.value || 0)))
              }
              placeholder="100"
              style={{ marginTop: ".35rem" }}
            />
            <div
              className="muted"
              style={{ textAlign: "right", fontSize: ".8rem", margin: ".35rem 0 1rem" }}
            >
              ≈ {(tamanhoOrdem / (preco || 1)).toFixed(6)}{" "}
              {COINS.find((c) => c.id === moeda)?.label
                .split(" ")[1]
                ?.replace(/[()]/g, "")}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem" }}>
              <button
                className="btn buy"
                onClick={comprar}
                disabled={preco <= 0 || tamanhoOrdem <= 0 || tamanhoOrdem > saldo}
                title={
                  tamanhoOrdem > saldo
                    ? "Saldo insuficiente"
                    : tamanhoOrdem <= 0
                    ? "Informe um valor > 0"
                    : ""
                }
              >
                Comprar
              </button>
              <button
                className="btn sell"
                onClick={vender}
                disabled={qtd <= 0}
                title={qtd <= 0 ? "Sem posição para vender" : ""}
              >
                Vender
              </button>
            </div>

            {erro && (
              <p className="muted" style={{ fontSize: ".8rem", marginTop: ".8rem" }}>
                {erro} — tente novamente em instantes.
              </p>
            )}
          </aside>
        </div>

        {/* histórico */}
        <div className="card" style={{ marginTop: "1rem", padding: "1rem" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Histórico de operações
            </h2>
            {historico.length > 0 && (
              <button
                className="btn secondary"
                style={{ width: "auto", padding: ".45rem .8rem", fontWeight: 600 }}
                onClick={() => setHistorico([])}
              >
                Limpar histórico
              </button>
            )}
          </div>

          {historico.length === 0 ? (
            <div className="muted" style={{ textAlign: "center", padding: "2.5rem 0" }}>
              Sem operações por enquanto. Faça uma compra ou venda para começar.
            </div>
          ) : (
            <div style={{ overflowX: "auto", marginTop: ".6rem" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Moeda</th>
                    <th>Preço</th>
                    <th>Qtd</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((h, i) => (
                    <tr key={i}>
                      <td>{new Date(h.data).toLocaleString()}</td>
                      <td
                        style={{
                          color: h.tipo === "Compra" ? "#86efac" : "#fca5a5",
                          fontWeight: 700,
                        }}
                      >
                        {h.tipo}
                      </td>
                      <td>{COINS.find((c) => c.id === h.moeda)?.label || h.moeda}</td>
                      <td className="font-mono">{fmtUSD(h.preco)}</td>
                      <td className="font-mono">{h.qtd.toFixed(6)}</td>
                      <td className="font-mono">{fmtUSD(h.qtd * h.preco)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="muted" style={{ fontSize: ".8rem", marginTop: ".75rem" }}>
          Este simulador é apenas educacional. Não constitui recomendação de investimento. Os dados podem sofrer atrasos.
        </div>
      </div>
    </div>
  );
}
