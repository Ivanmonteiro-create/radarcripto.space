import Link from 'next/link';
import Sparkline from '@components/Sparkline';
import { useState } from 'react';

export default function Simulador() {
  const [saldo, setSaldo] = useState(10000);
  const [par, setPar] = useState('BTCUSDT');
  const [risco, setRisco] = useState(1);

  const grid = {
    maxWidth: 1100, margin: '32px auto',
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
  };
  const card = {
    padding: 20, borderRadius: 14,
    background: 'rgba(17,24,39,.45)', border: '1px solid rgba(255,255,255,.08)',
  };
  const headerRow = {
    display: 'flex', justifyContent: 'flex-end',
    maxWidth: 1100, margin: '24px auto 0',
  };
  const ghost = {
    padding: '8px 12px', borderRadius: 10, fontSize: 13,
    border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', color: '#e6eef5',
  };

  return (
    <>
      <div style={headerRow}>
        <Link href="/"><span style={ghost}>Voltar ao início</span></Link>
      </div>

      <div style={grid}>
        <div style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <h3 style={{ margin: 0 }}>Simulador</h3>
            <small style={{ opacity:.7 }}>BTC/USDT</small>
          </div>

          <div style={{ fontSize: 36, fontWeight: 800, margin: '8px 0 12px' }}>$60,232.69</div>
          <div style={{ marginBottom: 10 }}><Sparkline /></div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 10 }}>
            <Metric label="Saldo (USD)" value={`$ ${saldo.toLocaleString()}`} />
            <Metric label="Risco por trade" value={`${risco}% × $${(saldo*risco/100).toLocaleString()}`} />
            <Metric label="P/L da posição" value="+$0" />
          </div>

          <div style={{ marginTop: 16, opacity:.7, fontSize: 14 }}>Histórico</div>
          <div style={{ marginTop: 6, opacity:.6, fontSize: 13 }}>Sem operações ainda.</div>
        </div>

        <div style={card}>
          <h3 style={{ marginTop: 0 }}>Parâmetros</h3>

          <Field label="Saldo (USD)">
            <input value={saldo} onChange={e => setSaldo(Number(e.target.value) || 0)} style={inputStyle} />
          </Field>

          <Field label="Par">
            <input value={par} onChange={e => setPar(e.target.value)} style={inputStyle} />
          </Field>

          <Field label="Risco por trade (%)">
            <input value={risco} onChange={e => setRisco(Number(e.target.value) || 0)} style={inputStyle} />
          </Field>

          <div style={{ display:'flex', gap: 10, marginTop: 10 }}>
            <button style={buyBtn}>Comprar</button>
            <button style={sellBtn}>Vender</button>
            <button style={ghostBtn}>Fechar</button>
          </div>

          <button style={{ ...ghostBtn, marginTop: 10 }}>Resetar simulação</button>

          <p style={{ marginTop: 12, opacity:.65, fontSize: 12 }}>
            *Simulação didática com preço gerado localmente. Próximos passos: dados de mercado, ordens, métricas e relatórios.
          </p>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display:'block', fontSize: 13, opacity:.85, marginBottom: 10 }}>
      {label}
      <div style={{ marginTop: 6 }}>{children}</div>
    </label>
  );
}
function Metric({ label, value }) {
  return (
    <div style={{ padding: 10, borderRadius: 10, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)' }}>
      <div style={{ opacity:.65, fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
const inputStyle = {
  width: '100%', padding:'10px 12px', borderRadius:10,
  border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.06)', color:'#e6eef5'
};
const buyBtn  = { padding:'10px 14px', borderRadius:10, border:'1px solid rgba(37,211,102,.5)', background:'#25d366', color:'#0b1a12', fontWeight:700 };
const sellBtn = { padding:'10px 14px', borderRadius:10, border:'1px solid rgba(239,68,68,.5)', background:'#ef4444', color:'#220b0b', fontWeight:700 };
const ghostBtn= { padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.06)', color:'#e6eef5' };
