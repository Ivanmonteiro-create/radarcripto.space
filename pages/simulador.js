import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const fmt = (v) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export default function Simulador() {
  // estados básicos (mantidos simples para não quebrar seu fluxo atual)
  const [saldo, setSaldo] = useState(10000);
  const [par, setPar] = useState("BTCUSDT");
  const [riscoPct, setRiscoPct] = useState(1);
  const [equity, setEquity] = useState(60232.69);
  const [hist, setHist] = useState([]);

  // preço simulado (apenas decorativo por enquanto)
  const preco = useMemo(() => {
    const base = 60000;
    const jitter = Math.sin(Date.now() / 14000) * 1200 + Math.cos(Date.now() / 9000) * 800;
    return Math.max(200, base + jitter);
  }, [Date.now()]);

  useEffect(() => {
    const t = setInterval(() => {
      // move equity levemente para dar “vida”
      setEquity((e) => {
        const delta = (Math.random() - 0.5) * 120;
        return Math.max(0, e + delta);
      });
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const riscoUsd = Math.round((riscoPct / 100) * saldo);

  function registrar(tipo) {
    const dir = tipo === "buy" ? 1 : -1;
    const resultado = Math.round(((Math.random() - 0.48) * 2) * riscoUsd); // -~+ risco
    setEquity((e) => e + resultado * 0.2 * dir);
    setHist((h) => [
      {
        id: Date.now(),
        par,
        tipo: tipo === "buy" ? "Compra" : "Venda",
        risco: `${riscoPct}%`,
        preco: fmt(preco),
        pnl: fmt(resultado),
      },
      ...h,
    ]);
  }

  function resetar() {
    setSaldo(10000);
    setPar("BTCUSDT");
    setRiscoPct(1);
    setEquity(60232.69);
    setHist([]);
  }

  return (
    <main className="sim">
      <div className="shell">
        <div className="topbar">
          <Link href="/" className="pill">Voltar ao início</Link>
        </div>

        <div className="grid">
          {/* Painel esquerdo */}
          <section className="panel">
            <div className="panel-head">
              <h2>Simulador</h2>
              <span className="pair">{par}</span>
            </div>

            <div className="equity">{fmt(equity)}</div>

            <div className="stats">
              <div className="stat">
                <span className="k">Saldo (USD)</span>
                <span className="v">{fmt(saldo)}</span>
              </div>
              <div className="stat">
                <span className="k">Risco por trade</span>
                <span className="v">
                  {riscoPct}% × {fmt(riscoUsd)}
                </span>
              </div>
              <div className="stat">
                <span className="k">P/L da posição</span>
                <span className="v muted">+ $0</span>
              </div>
            </div>

            <div className="history">
              <div className="h-title">Histórico</div>
              {hist.length === 0 ? (
                <div className="muted small">Sem operações ainda.</div>
              ) : (
                <ul className="rows">
                  {hist.slice(0, 8).map((r) => (
                    <li key={r.id} className="row">
                      <span className="tag">{r.tipo}</span>
                      <span className="mono">{r.par}</span>
                      <span className="mono">{r.preco}</span>
                      <span className="mono">{r.risco}</span>
                      <span className={`pnl ${r.pnl.startsWith("-") ? "neg" : "pos"}`}>{r.pnl}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Painel direito */}
          <section className="panel">
            <h3>Parâmetros</h3>

            <label className="lab">Saldo (USD)</label>
            <input
              className="input"
              type="number"
              min={100}
              value={saldo}
              onChange={(e) => setSaldo(Number(e.target.value || 0))}
            />

            <label className="lab">Par</label>
            <select className="input" value={par} onChange={(e) => setPar(e.target.value)}>
              <option>BTCUSDT</option>
              <option>ETHUSDT</option>
              <option>SOLUSDT</option>
              <option>BNBUSDT</option>
              <option>ADAUSDT</option>
              <option>XRPUSDT</option>
              <option>LINKUSDT</option>
              <option>DOGEUSDT</option>
            </select>

            <label className="lab">Risco por trade (%)</label>
            <input
              className="input"
              type="number"
              min={0.1}
              step={0.1}
              value={riscoPct}
              onChange={(e) => setRiscoPct(Number(e.target.value || 0))}
            />

            <div className="btns">
              <button className="btn buy" onClick={() => registrar("buy")}>Comprar</button>
              <button className="btn sell" onClick={() => registrar("sell")}>Vender</button>
              <button className="btn close" onClick={() => setHist([])}>Fechar</button>
            </div>

            <div className="btns minor">
              <button className="btn reset" onClick={resetar}>Resetar simulação</button>
            </div>

            <p className="disclaimer">
              <em>*simulação didática com preço gerado localmente (sem corretores, sem dados reais).</em><br />
              Próximos passos: conectar dados de mercado, ordens, métricas e relatórios.
            </p>
          </section>
        </div>
      </div>

      <style jsx>{`
        .sim {
          min-height: 100vh;
          background: radial-gradient(1200px 600px at 50% -10%, rgba(0,255,200,0.08), transparent 60%),
                      radial-gradient(900px 600px at 10% 110%, rgba(0,180,255,0.06), transparent 60%),
                      #0e1525;
          color: #e6edf3;
          padding: 64px 16px 96px;
        }
        .shell { width: min(1100px, 100%); margin: 0 auto; }
        .topbar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 14px;
        }
        .pill {
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #e6edf3;
          text-decoration: none;
          font-weight: 600;
        }
        .grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 16px;
        }
        .panel {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .panel-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        h2 {
          margin: 0;
          font-size: 22px;
          color: #cfe7ff;
          letter-spacing: 0.3px;
        }
        .pair {
          font-size: 12px;
          color: #97a6b3;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 8px;
          border-radius: 999px;
        }
        .equity {
          font-size: clamp(26px, 5vw, 36px);
          font-weight: 800;
          margin: 6px 0 12px;
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 14px;
        }
        .stat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 12px;
        }
        .k { display: block; font-size: 12px; color: #97a6b3; margin-bottom: 4px; }
        .v { font-weight: 700; }
        .muted { color: #9aa4b2; }
        .small { font-size: 13px; }

        .history { margin-top: 12px; }
        .h-title { font-size: 14px; color: #cfe7ff; margin-bottom: 8px; }
        .rows { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
        .row {
          display: grid;
          grid-template-columns: 84px 1fr 1fr 64px 90px;
          gap: 10px;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 8px 10px;
          border-radius: 10px;
        }
        .tag {
          display: inline-block;
          padding: 6px 8px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 12px;
          color: #0b1512;
          background: linear-gradient(180deg, #34d399, #10b981);
        }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; color: #cbd5df; }
        .pnl { font-weight: 700; }
        .pnl.pos { color: #34d399; }
        .pnl.neg { color: #ef4444; }

        h3 { margin: 2px 0 12px; font-size: 18px; color: #cfe7ff; }
        .lab { font-size: 12px; color: #97a6b3; margin: 10px 0 6px; display: block; }
        .input {
          width: 100%;
          height: 40px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: #e6edf3;
          border-radius: 10px;
          padding: 0 10px;
        }
        .btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; }
        .btns.minor { grid-template-columns: 1fr; }
        .btn {
          height: 40px;
          border-radius: 10px;
          font-weight: 800;
          letter-spacing: 0.2px;
          border: 1px solid rgba(0,0,0,0.25);
          box-shadow: 0 8px 18px rgba(0,0,0,0.25);
          color: #0b1512;
          transition: transform .12s ease, filter .2s ease;
        }
        .btn:hover { transform: translateY(-1px); filter: brightness(1.04); }
        .buy { background: linear-gradient(180deg, #34d399, #10b981); }
        .sell { background: linear-gradient(180deg, #fb7185, #ef4444); color: #fff; }
        .close { background: linear-gradient(180deg, #9aa4b2, #6b7280); color: #fff; }
        .reset {
          background: transparent;
          color: #cfe7ff;
          border-color: rgba(255,255,255,0.18);
        }
        .disclaimer {
          margin-top: 14px;
          color: #9aa4b2;
          font-size: 12px;
          line-height: 1.4;
        }
        @media (max-width: 920px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
