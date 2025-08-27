'use client';

import { useMemo, useState } from 'react';
import TradePanel from '../components/TradePanel';

type Pair = 'BTCUSDT' | 'ETHUSDT' | 'BNBUSDT' | 'SOLUSDT' | 'XRPUSDT';
type Tf = '1m' | '30m' | '1h' | '4h' | '1d';
type Ex = 'BINANCE' | 'BITSTAMP';

const container: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '360px 1fr',
  gap: 12,
  height: 'calc(100vh - 84px)', // ocupa quase a tela toda
  padding: '12px 12px 16px',
  boxSizing: 'border-box',
};

const leftCol: React.CSSProperties = {
  minWidth: 320,
  height: '100%',
};

const chartBox: React.CSSProperties = {
  height: '100%',
  width: '100%',
  borderRadius: 10,
  background: 'linear-gradient(180deg,#0f172a,#0b1224)',
  boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 8px 30px rgba(0,0,0,.35)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const toolbar: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 10px',
  gap: 8,
  borderBottom: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(15,23,42,0.7)',
  backdropFilter: 'blur(4px)',
};

const selectStyle: React.CSSProperties = {
  background: '#0b1224',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#e2e8f0',
  borderRadius: 8,
  padding: '6px 10px',
};

const btn: React.CSSProperties = {
  background: '#0ea5e9',
  color: '#0b1224',
  border: 'none',
  borderRadius: 10,
  padding: '8px 12px',
  fontWeight: 700,
  cursor: 'pointer',
};

const toggleBtn: React.CSSProperties = {
  ...btn,
  background: '#1f2937',
  color: '#e5e7eb',
};

const frameWrap = (compactRight: boolean): React.CSSProperties => ({
  position: 'relative',
  flex: 1,
  overflow: 'hidden',
  // se ocultar o painel direito do TV, deixo o iframe encostar nas bordas
  paddingRight: compactRight ? 0 : 0,
});

const iframeStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  border: '0',
};

export default function SimuladorPage() {
  const [exchange, setExchange] = useState<Ex>('BINANCE');
  const [pair, setPair] = useState<Pair>('BTCUSDT');
  const [tf, setTf] = useState<Tf>('1h');
  const [rightPanel, setRightPanel] = useState<boolean>(false); // painel direito do TV
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('left');

  // URL do TradingView widget (iframe)
  const tvUrl = useMemo(() => {
    const sym = pair.replace('USDT', 'USD'); // visual só (os dados continuam do par escolhido)
    const hide = rightPanel ? 'false' : 'true';
    return `https://s.tradingview.com/widgetembed/?symbol=${exchange}:${sym}&interval=${tf}&theme=dark&style=1&hide_top_toolbar=false&hide_side_toolbar=${hide}&allow_symbol_change=true&withdateranges=true&studies=[]`;
  }, [exchange, pair, tf, rightPanel]);

  return (
    <main
      style={{
        ...container,
        gridTemplateColumns: panelSide === 'left' ? '360px 1fr' : '1fr 360px',
      }}
    >
      {panelSide === 'left' && (
        <section style={leftCol}>
          <TradePanel />
        </section>
      )}

      {/* Chart */}
      <section style={chartBox}>
        <div style={toolbar}>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value as Ex)}
            style={selectStyle}
            aria-label="Exchange"
          >
            <option value="BINANCE">BINANCE</option>
            <option value="BITSTAMP">BITSTAMP</option>
          </select>

          <select
            value={pair}
            onChange={(e) => setPair(e.target.value as Pair)}
            style={selectStyle}
            aria-label="Par"
          >
            <option>BTCUSDT</option>
            <option>ETHUSDT</option>
            <option>BNBUSDT</option>
            <option>SOLUSDT</option>
            <option>XRPUSDT</option>
          </select>

          <select
            value={tf}
            onChange={(e) => setTf(e.target.value as Tf)}
            style={selectStyle}
            aria-label="Tempo"
          >
            <option>1m</option>
            <option>30m</option>
            <option>1h</option>
            <option>4h</option>
            <option>1d</option>
          </select>

          <div style={{ flex: 1 }} />

          <button
            style={toggleBtn}
            onClick={() => setRightPanel((v) => !v)}
            aria-label="Alternar painel direito"
            title="Alternar painel lateral do TradingView"
          >
            {rightPanel ? 'Ocultar lateral' : 'Mostrar lateral'}
          </button>

          <button
            style={btn}
            onClick={() =>
              setPanelSide((s) => (s === 'left' ? 'right' : 'left'))
            }
            aria-label="Mover painel"
            title="Mover painel de trade"
          >
            Painel → {panelSide === 'left' ? 'direita' : 'esquerda'}
          </button>
        </div>

        <div style={frameWrap(rightPanel)}>
          <iframe title="TradingView" src={tvUrl} style={iframeStyle} />
        </div>
      </section>

      {panelSide === 'right' && (
        <section style={leftCol}>
          <TradePanel />
        </section>
      )}
    </main>
  );
}
