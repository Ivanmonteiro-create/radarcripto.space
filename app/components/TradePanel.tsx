'use client';

import React from 'react';

export default function TradePanel() {
  return (
    <div
      style={{
        width: 360,
        minHeight: '100%',
        padding: 12,
        borderRadius: 14,
        background:
          'linear-gradient(180deg, rgba(28,35,51,.9), rgba(18,22,32,.9))',
        border: '1px solid rgba(255,255,255,.08)',
        boxShadow:
          '0 10px 26px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.04)',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Painel de Trade</h2>
        {/* saldo / lucro (mantém seus valores depois) */}
      </div>

      {/* Cards de saldo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Stat title="Créditos" value="US$ 100 000" />
        <Stat title="Lucro Realizado" value="US$ 0.00" accent />
      </div>

      {/* Controles principais – cores chamativas */}
      <div
        style={{
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.08)',
          background: 'rgba(0,0,0,.25)',
          padding: 10,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <label style={{ fontSize: 12, opacity: 0.85 }}>Lado</label>
        <select
          style={inputStyle}
          defaultValue="BUY (Long)"
          aria-label="Lado"
        >
          <option>BUY (Long)</option>
          <option>SELL (Short)</option>
        </select>

        <div />

        <label style={{ fontSize: 12, opacity: 0.85 }}>Qtd</label>
        <input style={inputStyle} type="number" defaultValue={1} min={1} />

        <div />

        <label style={{ fontSize: 12, opacity: 0.85 }}>Preço</label>
        <input style={inputStyle} type="number" defaultValue={10000} />

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
          <button style={buyBtn}>Buy</button>
          <button style={sellBtn}>Sell</button>
          <button style={resetBtn}>Reset</button>
        </div>
      </div>

      {/* Posição / PnL */}
      <div
        style={{
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.08)',
          background: 'rgba(0,0,0,.25)',
          padding: 10,
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.85 }}>Posição</div>
        <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>
          Lote 0 | Preço Médio: —
        </div>
        <div
          style={{
            marginTop: 10,
            padding: 8,
            borderRadius: 10,
            background: 'rgba(34,197,94,.12)',
            color: '#22c55e',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          PNL não realizado (mark=10 000): US$ 0.00
        </div>
      </div>

      {/* Fills / abas – placeholder (mantém compatibilidade com seu estado) */}
      <div
        style={{
          flex: 1,
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,.08)',
          background: 'rgba(0,0,0,.18)',
          padding: 10,
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 8 }}>Fills</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>Nenhum ainda</div>
      </div>

      {/* Botão “Comprar Plano” sempre visível e chamativo – fixo no rodapé do painel */}
      <button
        onClick={() => (window.location.href = '/planos')}
        style={{
          marginTop: 6,
          width: '100%',
          border: 'none',
          borderRadius: 12,
          padding: '12px 14px',
          fontWeight: 700,
          cursor: 'pointer',
          color: '#111',
          background:
            'linear-gradient(180deg, #ffd15a, #ffb020)',
          boxShadow:
            '0 8px 18px rgba(255,176,32,.35), inset 0 1px 0 rgba(255,255,255,.45)',
        }}
      >
        Comprar Plano
      </button>
    </div>
  );
}

function Stat({ title, value, accent }: { title: string; value: string; accent?: boolean }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,.08)',
        background: 'rgba(0,0,0,.22)',
        padding: 10,
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
      <div style={{ fontWeight: 800, marginTop: 4, color: accent ? '#22c55e' : 'inherit' }}>
        {value}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,.12)',
  background: 'rgba(0,0,0,.25)',
  color: 'inherit',
  padding: '6px 8px',
  outline: 'none',
};

const buyBtn: React.CSSProperties = {
  background: 'linear-gradient(180deg, #34d399, #22c55e)',
  color: '#0b1a11',
  border: 'none',
  borderRadius: 10,
  padding: '10px 12px',
  fontWeight: 800,
  cursor: 'pointer',
};

const sellBtn: React.CSSProperties = {
  background: 'linear-gradient(180deg, #f87171, #ef4444)',
  color: '#1a0b0b',
  border: 'none',
  borderRadius: 10,
  padding: '10px 12px',
  fontWeight: 800,
  cursor: 'pointer',
};

const resetBtn: React.CSSProperties = {
  background: 'linear-gradient(180deg, #cbd5e1, #94a3b8)',
  color: '#0f172a',
  border: 'none',
  borderRadius: 10,
  padding: '10px 12px',
  fontWeight: 800,
  cursor: 'pointer',
};
