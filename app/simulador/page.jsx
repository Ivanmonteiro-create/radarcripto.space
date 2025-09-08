"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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

  // trava a rolagem global enquanto o simulador está aberto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  // preço ao vivo
  useEffect(() => {
    let off = false;
    async function fetchPreco() {
      setCarregando(true); setErro("");
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
    return () => { off = true; clearInterval(id); };
  }, [moeda]);

  const valorPosicao = useMemo(() => qtd * preco, [qtd, preco]);
  const pnl = useMemo(() => valorPosicao, [valorPosicao]);

  // ordens
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
    setSaldo(10000); setQtd(0); setHistorico([]);
  }

  // TradingView
  const chartRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/tv.js";
    s.onload = () => { scriptLoadedRef.current = true; renderWidget(); };
    document.body.appendChild(s);
  }, []);

  useEffect(() => { if (scriptLoadedRef.current) renderWidget(); }, [moeda]);

  function renderWidget() {
    if (!window.TradingView || !chartRef.current) return;
    chartRef.current.innerHTML = "";
    new window.TradingView.widget({
      autosize: true,
      symbol: TV_SYMBOLS[moeda] || "BINANCE:BTCUSDT",
      interval: "5",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "br",
      toolbar_bg: "#0b1220",
      hide_top_toolbar: false,
      hide_legend: false,
      container_id: chartRef.current.id,
      studies: ["STD;EMA", "STD;RSI"],
    });
  }

  const HEADER_H = 56; // topo compacto

  return (
    <div className="pro-sim" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Topo enxuto, sem padding alto */}
      <div className="mx-auto w-full max-w-[1400px]" style={{ padding: "0 .85rem" }}>
        <div className="flex flex-wrap items-center justify-between gap-3" style={{ height: HEADER_H }}>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn secondary" style={{ width: "auto", padding: ".45rem .8rem" }}>
              Voltar ao Início
            </Link>
            <h1 className="text-xl font-extrabold" style={{ color: "#fff" }}>Simulador de Trading</h1>
          </div>
          <div className="flex items-center gap-3">
            <select value={moeda} onChange={(e) => setMoeda(e.target.value)} style={{ width: 220 }}>
              {COINS.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}
            </select>
            <button className="btn secondary" onClick={resetar}>Resetar</button>
          </div>
        </div>
      </div>

      {/* Conteúdo em tela cheia sem “respiro” superior */}
      <div className="mx-auto w-full max-w-[1400px] px-4" style={{ height: `calc(100vh - ${HEADER_H}px)` }}>
        <div className="sim-grid" style={{ height: "100%" }}>
          {/* Gráfico */}
          <section className="card" style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div className="chart-head">
              <span>Gráfico — {COINS.find((c) => c.id === moeda)?.label}</span>
              <span className="chip">{carregando ? "Atualizando…" : fmtUSD(preco)}</span>
            </div>
            <div id="tradingview_chart_container" ref={chartRef} className="chart-box" style={{ minHeight: 0, flex: 1 }} />
          </section>

          {/* Painel */}
          <aside className="card panel" style={{ minHeight: 0 }}>
            <div className="section-title">Sua conta (demo)</div>
            <div className="stat"><span className="muted">Saldo</span><strong className="strong">{fmtUSD(saldo)}</strong></div>
            <div className="stat"><span className="muted">Quantidade</span><span className="strong" style={{ fontFamily:"ui-monospace, Menlo, monospace" }}>{qtd.toFixed(6)}</span></div>
            <div className="stat"><span className="muted">Valor da posição</span><span className="strong">{fmtUSD(qtd*preco)}</span></div>
            <div className={`pnl-pos ${pnl>=0?"g":"r"}`}><span>P&L (não realizado)</span><strong>{fmtUSD(pnl)}</strong></div>

            <div className="section-title" style={{ marginTop: ".9rem" }}>Ações</div>
            <label className="muted" style={{ fontSize: ".9rem" }}>Tamanho da ordem (USDT)</label>
            <input
              type="number" min={10} step={10} value={tamanhoOrdem}
              onChange={(e)=>setTamanhoOrdem(Math.max(0, Number(e.target.value||0)))}
              placeholder="100" style={{ marginTop: ".35rem" }}
            />
            <div className="muted" style={{ textAlign:"right", fontSize: ".8rem", margin: ".35rem 0 1rem" }}>
              ≈ {(tamanhoOrdem / (preco || 1)).toFixed(6)}{" "}
              {COINS.find((c)=>c.id===moeda)?.label.split(" ")[1]?.replace(/[()]/g,"")}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: ".6rem" }}>
              <button className="btn buy" onClick={comprar} disabled={preco<=0 || tamanhoOrdem<=0 || tamanhoOrdem>saldo}>Comprar</button>
              <button className="btn sell" onClick={vender} disabled={qtd<=0}>Vender</button>
            </div>

            {erro && <p className="muted" style={{ fontSize: ".8rem", marginTop: ".8rem" }}>{erro}</p>}

            <div className="section-title" style={{ marginTop: "1rem" }}>Histórico de operações</div>
            <div style={{ overflow: "auto", border: "1px solid var(--stroke)", borderRadius: 10, flex: 1, minHeight: 120 }}>
              {historico.length === 0 ? (
                <div className="muted" style={{ textAlign:"center", padding:"1.25rem 0" }}>
                  Sem operações por enquanto. Faça uma compra ou venda para começar.
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr><th>Data</th><th>Tipo</th><th>Moeda</th><th>Preço</th><th>Qtd</th><th>Valor</th></tr>
                  </thead>
                  <tbody>
                    {historico.map((h,i)=>(
                      <tr key={i}>
                        <td>{new Date(h.data).toLocaleString()}</td>
                        <td style={{ color: h.tipo==="Compra" ? "#86efac" : "#fca5a5", fontWeight:700 }}>{h.tipo}</td>
                        <td>{COINS.find(c=>c.id===h.moeda)?.label || h.moeda}</td>
                        <td style={{ fontFamily:"ui-monospace, Menlo, monospace" }}>{fmtUSD(h.preco)}</td>
                        <td style={{ fontFamily:"ui-monospace, Menlo, monospace" }}>{h.qtd.toFixed(6)}</td>
                        <td style={{ fontFamily:"ui-monospace, Menlo, monospace" }}>{fmtUSD(h.qtd*h.preco)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {historico.length>0 && (
              <button className="btn secondary" style={{ marginTop: ".6rem" }} onClick={()=>setHistorico([])}>
                Limpar histórico
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
