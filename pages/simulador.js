// pages/simulador.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useMemo, useRef, useState } from 'react';

function Stat({ label, value }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 140,
      padding: 12,
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,.08)',
      background: 'rgba(0,0,0,.2)',
    }}>
      <div style={{ opacity: .7, fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}

export default function Simulador() {
  // estado “financeiro” básico
  const [saldo, setSaldo] = useState(10000);           // USD
  const [par, setPar] = useState('BTC/USDT');
  const [risco, setRisco] = useState(1);               // %
  const [preco, setPreco] = useState(60000);           // preço simulado
  const [historico, setHistorico] = useState([]);      // trades simulados
  const baseRef = useRef(preco);

  // “feed” de preço aleatório para visual
  useEffect(() => {
    const id = setInterval(() => {
      setPreco(p =>
        Math.max(10,
          Number((p * (1 + (Math.random() - .5) * 0.002)).toFixed(2))
        )
      );
    }, 900);
    return () => clearInterval(id);
  }, []);

  const pnl = useMemo(() => {
    // PnL simples: diferença desde que entrou (se a última operação está aberta)
    const last = historico[historico.length - 1];
    if (!last || last.status !== 'ABERTA') return 0;
    const dir = last.tipo === 'COMPRA' ? 1 : -1;
    return Number(((preco - last.preco) * dir * last.qtd).toFixed(2));
  }, [historico, preco]);

  const riscoValor = useMemo(() => Number(((saldo * risco) / 100).toFixed(2)), [saldo, risco]);

  function abrirOperacao(tipo) {
    // tamanho de posição “didático”: arrisca 'riscoValor' para oscilar ~1% (caricatura)
    const precoEntrada = preco;
    const qtd = Number(((riscoValor) / (precoEntrada * 0.01)).toFixed(6));
    setHistorico(h => [
      ...h,
      {
        id: Date.now(),
        tipo,            // COMPRA | VENDA
        preco: precoEntrada,
        qtd,
        status: 'ABERTA',
        par,
        riscoPercent: risco,
      },
    ]);
  }

  function fecharOperacao() {
    setHistorico(h => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      if (last.status !== 'ABERTA') return h;
      const dir = last.tipo === 'COMPRA' ? 1 : -1;
      const lucro = Number(((preco - last.preco) * dir * last.qtd).toFixed(2));
      const novoSaldo = Number((saldo + lucro).toFixed(2));
      setSaldo(novoSaldo);
      return [
        ...h.slice(0, -1),
        { ...last, status: 'FECHADA', precoSaida: preco, lucro },
      ];
    });
  }

  return (
    <>
      <Header />
      <main style={{ padding: '32px 16px' }}>
        <section
          style={{
            maxWidth: 1080,
            margin: '16px auto 64px',
            display: 'grid',
            gap: 16,
            gridTemplateColumns: '1.2fr .8fr',
          }}
        >
          {/* PAINEL ESQ — “gráfico”/preço e métricas */}
          <div
            style={{
              padding: 20,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,.08)',
              background:
                'radial-gradient(1200px 600px at 50% -200px, rgba(255,255,255,.06), rgba(0,0,0,0))',
              minHeight: 360,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h2 style={{ margin: 0 }}>Simulador</h2>
              <div style={{ opacity: .8 }}>{par}</div>
            </div>

            {/* “ticker” grande */}
            <div style={{ marginTop: 12, fontSize: 48, fontWeight: 800 }}>
              ${preco.toLocaleString('en-US')}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Stat label="Saldo (USD)" value={`$ ${saldo.toLocaleString('en-US')}`} />
              <Stat label="Risco por trade" value={`${risco}%  •  $ ${riscoValor.toLocaleString('en-US')}`} />
              <Stat
                label="P/L da posição"
                value={`${pnl >= 0 ? '+' : '−'}$ ${Math.abs(pnl).toLocaleString('en-US')}`}
              />
            </div>

            {/* histórico simples */}
            <div style={{ marginTop: 20 }}>
              <div style={{ opacity: .8, fontSize: 14, marginBottom: 8 }}>Histórico</div>
              <div style={{
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 12,
                padding: 12,
                maxHeight: 160,
                overflow: 'auto',
                background: 'rgba(0,0,0,.2)',
              }}>
                {historico.length === 0 ? (
                  <div style={{ opacity: .7 }}>Sem operações ainda.</div>
                ) : (
                  historico.slice().reverse().map(op => (
                    <div key={op.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '100px 100px 1fr 120px',
                      gap: 8,
                      padding: '6px 0',
                      borderBottom: '1px dashed rgba(255,255,255,.06)',
                    }}>
                      <div style={{ opacity: .8 }}>{op.tipo}</div>
                      <div>@ ${op.preco.toLocaleString('en-US')}</div>
                      <div style={{ opacity: .8 }}>{op.qtd} qtd — {op.par}</div>
                      <div style={{ textAlign: 'right', opacity: .8 }}>
                        {op.status === 'ABERTA' ? 'ABERTA' : `Fechada: ${op.lucro >= 0 ? '+' : '−'}$${Math.abs(op.lucro).toLocaleString('en-US')}`}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* PAINEL DIR — controles */}
          <div
            style={{
              padding: 20,
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,.08)',
              background: 'rgba(0,0,0,.2)',
              height: '100%',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Parâmetros</h3>

            <label style={{ display: 'block', fontSize: 13, opacity: .8, marginTop: 8 }}>Saldo (USD)</label>
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(Number(e.target.value || 0))}
              style={inputStyle}
              min={0}
            />

            <label style={{ display: 'block', fontSize: 13, opacity: .8, marginTop: 12 }}>Par</label>
            <select value={par} onChange={(e) => setPar(e.target.value)} style={inputStyle}>
              <option>BTC/USDT</option>
              <option>ETH/USDT</option>
              <option>ADA/USDT</option>
              <option>SOL/USDT</option>
            </select>

            <label style={{ display: 'block', fontSize: 13, opacity: .8, marginTop: 12 }}>
              Risco por trade (%)
            </label>
            <input
              type="number"
              value={risco}
              onChange={(e) => setRisco(Math.max(0, Number(e.target.value || 0)))}
              style={inputStyle}
              min={0}
              max={100}
            />

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => abrirOperacao('COMPRA')} style={buyBtn}>Comprar</button>
              <button onClick={() => abrirOperacao('VENDA')} style={sellBtn}>Vender</button>
              <button onClick={fecharOperacao} style={closeBtn}>Fechar</button>
            </div>

            <div style={{ opacity: .75, fontSize: 12, marginTop: 16, lineHeight: 1.6 }}>
              *Simulação didática: o “preço” é gerado localmente (sem corretora, sem dados reais).
              Próximos passos: conectar dados de mercado, ordens, métricas e relatórios.
            </div>

            <div style={{ marginTop: 24 }}>
              <a href="/" style={linkBtn}>Voltar ao início</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const inputStyle = {
  width: '100%',
  marginTop: 6,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,.14)',
  background: 'rgba(0,0,0,.28)',
  color: 'inherit',
  outline: 'none',
};

const buyBtn = {
  flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0)',
  background: 'linear-gradient(180deg,#16a34a,#0e7a36)', color: '#fff', fontWeight: 700, cursor: 'pointer'
};
const sellBtn = {
  flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0)',
  background: 'linear-gradient(180deg,#dc2626,#a31515)', color: '#fff', fontWeight: 700, cursor: 'pointer'
};
const closeBtn = {
  flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(255,255,255,.06)', color: '#fff', fontWeight: 700, cursor: 'pointer'
};
const linkBtn = {
  display: 'inline-block',
  textDecoration: 'none',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,.2)',
  background: 'rgba(255,255,255,.06)',
  color: 'inherit',
  fontWeight: 600,
};
