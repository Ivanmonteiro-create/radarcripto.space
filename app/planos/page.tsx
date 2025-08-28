'use client';

import React from 'react';
import Link from 'next/link';

export default function PlanosPage() {
// --- estilos locais para os botões de pagamento (não altera nada do resto) ---
const payBtn: React.CSSProperties = {
  display: 'inline-block',
  padding: '10px 14px',
  borderRadius: 10,
  fontWeight: 700,
  textDecoration: 'none',
  textAlign: 'center',
  background: '#2563eb', // azul base (igual ao Full Screen)
  color: '#ffffff',
  boxShadow: '0 4px 12px rgba(37,99,235,.35)',
  border: '1px solid rgba(255,255,255,.08)',
};
const payBtnAlt: React.CSSProperties = {
  ...payBtn,
  background: '#0ea5e9', // azul claro de apoio
};
const btnCol: React.CSSProperties = { display: 'grid', gap: 8, marginTop: 12 };
// ---------------------------------------------------------------------------
  // ajuste rápido de cores que combinam com o app
  const c = {
    bg:    '#0a0f1c',
    card:  'linear-gradient(180deg, #0b1220, #0f172a)',
    text:  '#e5e7eb',
    muted: '#9ca3af',
    blue1: '#1f6feb',
    blue2: '#1a5fd0',
    blue3: '#1349a5',
    green1:'#16a34a',
    amber1:'#fbbf24',
    amber2:'#f59e0b',
    border:'rgba(255,255,255,.08)',
    glowB: '0 0 14px rgba(31,111,235,.45)',
  };

  const page: React.CSSProperties = {
    minHeight:'100vh', background:c.bg, color:c.text, padding:'32px 16px'
  };
  const container: React.CSSProperties = {
    maxWidth:1200, margin:'0 auto'
  };
  const h1: React.CSSProperties = {
    fontSize:34, fontWeight:900, letterSpacing:.3, margin:0, marginBottom:8
  };
  const sub: React.CSSProperties = { color:c.muted, margin:'0 0 28px' };

  const grid: React.CSSProperties = {
    display:'grid',
    gridTemplateColumns:'repeat(12, 1fr)',
    gap:16
  };
  const cardBase: React.CSSProperties = {
    gridColumn:'span 12',
    background:c.card,
    border:'1px solid '+c.border,
    borderRadius:16,
    boxShadow:'0 8px 24px rgba(0,0,0,.35) inset, 0 10px 30px rgba(0,0,0,.25)',
    padding:20,
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    minHeight:380
  };
  const price: React.CSSProperties = { fontSize:36, fontWeight:900, margin:'6px 0 12px' };
  const ul: React.CSSProperties = { listStyle:'none', padding:0, margin:0, display:'grid', gap:8 };
  const li: React.CSSProperties = { display:'flex', alignItems:'center', gap:8, color:c.text, opacity:.9 };

  const btnPlan: React.CSSProperties = {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background:`linear-gradient(180deg, ${c.amber1}, ${c.amber2})`,
    color:'#111', fontWeight:800, border:'1px solid #b45309',
    borderRadius:10, padding:'12px 16px', marginTop:16, cursor:'pointer'
  };

  const btnBlue: React.CSSProperties = {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background:`linear-gradient(180deg, ${c.blue1}, ${c.blue2})`,
    color:'#fff', fontWeight:700, border:'1px solid '+c.blue3,
    borderRadius:10, padding:'12px 16px', marginTop:16, cursor:'pointer',
    boxShadow:c.glowB
  };

  // responsivo
  const cardCols = (span: number): React.CSSProperties => ({
    ...cardBase,
    gridColumn: `span ${span}`
  });

  return (
    <main style={page}>
      <div style={container}>
        <header style={{display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start'}}>
          <h1 style={h1}>Escolha seu plano</h1>
          <p style={sub}>
            Treine com créditos fictícios no simulador e migre para um plano pago quando estiver pronto.
          </p>
          <Link href="/simulador" style={{...btnBlue, textDecoration:'none'}}>Ir para o Simulador</Link>
        </header>

        <section style={{...grid, marginTop:24}}>
          {/* Starter / Gratuito */}
          <article style={cardCols(12)} className="card-sm"
                   // @ts-ignore — CSS inline para mobile
                   data-cols="12/6/4">
            <div>
              <span style={{color:c.muted, fontWeight:700}}>Starter</span>
              <h3 style={{margin:'6px 0 0', fontSize:22, fontWeight:800}}>Gratuito</h3>
              <div style={price}>US$ 0</div>
              <ul style={ul}>
                <li>✅ Créditos fictícios: <b>US$ 100.000</b></li>
                <li>✅ Acesso ao simulador (BTC, ETH, SOL, BNB, XRP)</li>
                <li>✅ Indicadores visuais (TradingView embutido)</li>
                <li>✅ Painel de trade com PnL não realizado</li>
              </ul>
            </div>
            <Link href="/simulador" style={{...btnBlue, textDecoration:'none'}}>Começar agora</Link>
          </article>

          {/* Trader Pro – destaque */}
          <article style={cardCols(12)} className="card-md"
                   // @ts-ignore
                   data-cols="12/6/4">
            <div style={{
              position:'relative', marginBottom:6, display:'inline-flex', alignItems:'center', gap:8
            }}>
              <span style={{color:c.muted, fontWeight:700}}>Trader Pro</span>
              <span style={{
                background:`linear-gradient(180deg, ${c.blue1}, ${c.blue2})`,
                border:'1px solid '+c.blue3, color:'#fff', fontWeight:800,
                borderRadius:999, padding:'4px 10px', fontSize:12, boxShadow:c.glowB
              }}>MAIS POPULAR</span>
            </div>
            <h3 style={{margin:'6px 0 0', fontSize:22, fontWeight:800}}>Para quem quer evoluir rápido</h3>
            <div style={price}>US$ 19<span style={{fontSize:16}}>/mês</span></div>
            <ul style={ul}>
              <li>✅ Tudo do Starter</li>
              <li>✅ Metas semanais e histórico de performance</li>
              <li>✅ Gestão de risco (limite por trade e por dia)</li>
              <li>✅ Atalhos de teclado (Buy/Sell/Reset)</li>
              <li>✅ Suporte prioritário</li>
            </ul>
            <a
              href="mailto:contato@radarcripto.space?subject=Quero%20o%20Plano%20Trader%20Pro"
              style={btnPlan}
            >
              Assinar Trader Pro
            </a>
          </article>

          {/* Master */}
          <article style={cardCols(12)} className="card-lg"
                   // @ts-ignore
                   data-cols="12/12/4">
            <div>
              <span style={{color:c.muted, fontWeight:700}}>Master</span>
              <h3 style={{margin:'6px 0 0', fontSize:22, fontWeight:800}}>Para quem quer ir além</h3>
              <div style={price}>US$ 49<span style={{fontSize:16}}>/mês</span></div>
              <ul style={ul}>
                <li>✅ Tudo do Pro</li>
                <li>✅ Relatórios avançados de PnL e Winrate</li>
                <li>✅ Exportação de operações (CSV)</li>
                <li>✅ Templates de setups e indicadores</li>
              </ul>
            </div>
            <a
              href="mailto:contato@radarcripto.space?subject=Quero%20o%20Plano%20Master"
              style={btnPlan}
            >
              Assinar Master
            </a>
          </article>
        </section>

        {/* FAQ curtinha */}
        <section style={{marginTop:40}}>
          <h3 style={{fontSize:20, fontWeight:900, margin:'0 0 12px'}}>Perguntas frequentes</h3>
          <details style={{border:`1px solid ${c.border}`, borderRadius:12, padding:12, marginBottom:10}}>
            <summary style={{cursor:'pointer', fontWeight:700}}>Posso usar o simulador de graça?</summary>
            <p style={{color:c.muted, margin:'8px 0 0'}}>Sim. O plano Starter é 100% gratuito.</p>
          </details>
          <details style={{border:`1px solid ${c.border}`, borderRadius:12, padding:12, marginBottom:10}}>
            <summary style={{cursor:'pointer', fontWeight:700}}>Como faço o upgrade?</summary>
            <p style={{color:c.muted, margin:'8px 0 0'}}>
              Clique em “Assinar” no plano desejado. Por enquanto o checkout é via e-mail; em breve ativaremos pagamento online.
            </p>
          </details>
        </section>
      </div>

      {/* responsividade via CSS-in-JS simples */}
      <style>{`
        @media (min-width: 700px){
          .card-sm{ grid-column: span 6 !important; }
          .card-md{ grid-column: span 6 !important; }
        }
        @media (min-width: 1024px){
          .card-sm{ grid-column: span 4 !important; }
          .card-md{ grid-column: span 4 !important; transform: translateY(-8px); }
          .card-lg{ grid-column: span 4 !important; }
        }
      `}</style>
    </main>
  );
}
