// pages/simulador.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sparkline from '../components/Sparkline';
import { useEffect, useMemo, useRef, useState } from 'react';

function Card({ children, style }) {
  return (
    <div style={{
      padding: 20, borderRadius: 16,
      border: '1px solid rgba(255,255,255,.08)',
      background: 'rgba(0,0,0,.20)',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Stat({ label, value, tone = 'default' }) {
  const color = tone === 'pos' ? '#22c55e' : tone === 'neg' ? '#ef4444' : 'inherit';
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <div style={{ opacity: .7, fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6, color }}>{value}</div>
    </div>
  );
}

export default function Simulador() {
  // ----- estado principal -----
  const [saldo, setSaldo] = useState(10000);
  const [par, setPar] = useState('BTC/USDT');
  const [risco, setRisco] = useState(1);
  const [preco, setPreco] = useState(60000);
  const [historico, setHistorico] = useState([]);
  const [serie, setSerie] = useState([60000]); // para sparkline

  // ----- persistência -----
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('rc_sim_v1') || '{}');
      if (saved.saldo) setSaldo(saved.saldo);
      if (saved.historico) setHistorico(saved.historico);
      if (saved.par) setPar(saved.par);
      if (saved.risco) setRisco(saved.risco);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('rc_sim_v1', JSON.stringify({ saldo, historico, par, risco }));
  }, [saldo, historico, par, risco]);

  // ----- “feed” de preço simulado + série -----
  useEffect(() => {
    const id = setInterval(() => {
      setPreco(p => {
        const next = Math.max(10,
          Number((p * (1 + (Math.random() - .5) * 0.002)).toFixed(2))
        );
        setSerie(s => {
          const arr = [...s, next];
          if (arr.length > 180) arr.shift();
          return arr;
        });
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const posAberta = historico.findLast?.(o => o.status === 'ABERTA') ||
                    [...historico].reverse().find(o => o.status === 'ABERTA');

  const riscoValor = useMemo(() => Number(((saldo * risco) / 100).toFixed(2)), [saldo, risco]);
  const pnl = useMemo(() => {
    if (!posAberta) return 0;
    const dir = posAberta.tipo === 'COMPRA' ? 1 : -1;
    return Number(((preco - posAberta.preco) * dir * posAberta.qtd).toFixed(2));
  }, [preco, posAberta]);

  function abrirOperacao(tipo) {
    if (posAberta) return; // evita 2 posições simultâneas
    const precoEntrada = preco;
    const qtd = Number(((riscoValor) / (precoEntrada * 0.01)).toFixed(6));
    setHistorico(h => [...h, {
      id: Date.now(), tipo, preco: precoEntrada, qtd,
      status: 'ABERTA', par, riscoPercent: risco
    }]);
  }

  function fecharOperacao() {
    if (!posAberta) return;
    const dir = posAberta.tipo === 'COMPRA' ? 1 : -1;
    const lucro = Number(((preco - posAberta.preco) * dir * posAberta.qtd).toFixed(2));
    setSaldo(s => Number((s + lucro).toFixed(2)));
    setHistorico(h => h.map(o => o.id === posAberta.id
      ? { ...o, status: 'FECHADA', precoSaida: preco, lucro }
      : o
    ));
  }

  function resetar() {
    setSaldo(10000);
    setHistorico([]);
    setPar('BTC/USDT');
    setRisco(1);
    localStorage.removeItem('rc_sim_v1');
  }

  return (
    <>
      <Header />
      <main style={{ padding: '32px 16px' }}>
        <section style={{
          maxWidth: 1080, margin: '16px auto 64px',
          display: 'grid', gap: 16, gridTemplateColumns: '1.2fr .8fr',
        }}>
          {/* PAINEL ESQ */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ margin: 0 }}>Simulador</h2>
              <div style={{ opacity: .8 }}>{par}</div>
            </div>

            <div style={{ marginTop: 8, fontSize: 44, fontWeight: 800 }}>
              ${preco.toLocaleString('en-US')}
            </div>

            <div style={{ marginTop: 8 }}>
              <Sparkline data={serie} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Stat label="Saldo (USD)" value={`$ ${saldo.toLocaleString('en-US')}`} />
              <Stat label="Risco por trade" value={`${risco}%  •  $ ${riscoValor.toLocaleString('en-US')}`} />
              <Stat
                label="P/L da posição"
                value={`${pnl >= 0 ? '+' : '−'}$ ${Math.abs(pnl).toLocaleString('en-US')}`}
                tone={pnl > 0 ? 'pos' : pnl < 0 ? 'neg' : 'default'}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ opacity: .8, fontSize: 14, marginBottom: 8 }}>Histórico</div>
              <div style={{
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 12, padding: 12,
                maxHeight: 180, overflow: 'auto',
                background: 'rgba(0,0,0,.2)',
              }}>
                {historico.length === 0 ? (
                  <div style={{ opacity: .7 }}>Sem operações ainda.</div>
                ) : (
                  historico.slice().reverse().map(op => (
                    <div key={op.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 120px 1fr 160px',
                      gap: 8, padding: '6px 0',
                      borderBottom: '1px dashed rgba(255,255,255,.06)',
                    }}>
                      <div style={{ opacity: .85 }}>{op.tipo}</div>
                      <div>@ ${op.preco.toLocaleString('en-US')}</div>
                      <div style={{ opacity: .8 }}>{op.qtd} — {op.par}</div>
                      <div style={{ textAlign: 'right', opacity: .85 }}>
                        {op.status === 'ABERTA'
                          ? 'ABERTA'
                          : `Fechada: ${op.lucro >= 0 ? '+' : '−'}$${Math.abs(op.lucro).toLocaleString('en-US')}`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* PAINEL DIR */}
          <Card>
            <h3 style={{ marginTop: 0 }}>Parâmetros</h3>

            <label style={lbl}>Saldo (USD)</label>
            <input type="number" value={saldo}
              onChange={(e) => setSaldo(Number(e.target.value || 0))}
              style={inp} min={0} />

            <label style={lbl}>Par</label>
            <select value={par} onChange={(e) => setPar(e.target.value)} style={inp}>
              <option>BTC/USDT</option>
              <option>ETH/USDT</option>
              <option>ADA/USDT</option>
              <option>SOL/USDT</option>
            </select>

            <label style={lbl}>Risco por trade (%)</label>
            <input type="number" value={risco}
              onChange={(e) => setRisco(Math.max(0, Number(e.target.value || 0)))}
              style={inp} min={0} max={100} />

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => abrirOperacao('COMPRA')}
                style={btnBuy} disabled={!!posAberta}>Comprar</button>
              <button onClick={() => abrirOperacao('VENDA')}
                style={btnSell} disabled={!!posAberta}>Vender</button>
              <button onClick={fecharOperacao}
                style={btnClose} disabled={!posAberta}>Fechar</button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button onClick={resetar} style={btnGhost}>Resetar simulação</button>
              <a href="/" style={btnGhost}>Voltar ao início</a>
            </div>

            <div style={{ opacity: .75, fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
              *Simulação didática com preço gerado localmente. Próximos passos:
              dados reais de mercado, ordens, métricas e relatórios.
            </div>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}

const lbl = { display: 'block', fontSize: 13, opacity: .8, marginTop: 12 };
const inp = {
  width: '100%', marginTop: 6, padding: '10px 12px',
  borderRadius: 10, border: '1px solid rgba(255,255,255,.14)',
  background: 'rgba(0,0,0,.28)', color: 'inherit', outline: 'none',
};

const btnBuy = {
  flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
  border: '1px solid rgba(0,0,0,0)', color: '#fff', fontWeight: 700,
  background: 'linear-gradient(180deg,#16a34a,#0e7a36)',
};
const btnSell = {
  flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
  border: '1px solid rgba(0,0,0,0)', color: '#fff', fontWeight: 700,
  background: 'linear-gradient(180deg,#dc2626,#a31515)',
};
const btnClose = {
  flex: 1, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
  border: '1px solid rgba(255,255,255,.2)', color: '#fff', fontWeight: 700,
  background: 'rgba(255,255,255,.06)',
};
const btnGhost = {
  flex: 1, padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
  border: '1px solid rgba(255,255,255,.2)', color: '#fff', fontWeight: 600,
  background: 'rgba(255,255,255,.06)', textAlign: 'center'
};
