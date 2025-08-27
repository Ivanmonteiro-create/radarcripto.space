'use client';

import React, { useMemo, useState, useEffect, useRef, CSSProperties } from 'react';
import TradePanel from '../components/TradePanel';

type Side = 'left' | 'right';

const PAINEL_WIDTH = 360;
const GAP = 16;

const pairs = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'] as const;
const exchanges = ['BINANCE', 'BYBIT'] as const;
const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D'] as const;

function tfToInterval(tf: string) {
  switch (tf) {
    case '1m': return '1';
    case '5m': return '5';
    case '15m': return '15';
    case '1h': return '60';
    case '4h': return '240';
    case '1D': return 'D';
    default: return '60';
  }
}

function buildTvUrl(exchange: string, pair: string, tf: string) {
  const symbol = `${exchange}:${pair}`;
  const interval = tfToInterval(tf);
  const params = new URLSearchParams({
    symbol,
    interval,
    hide_legend: '1',
    symboledit: '1',
    saveimage: '0',
    toolbarbg: '#0f1216',
    studies: '',
    theme: 'dark',
    style: '1', // candles
    timezone: 'Etc/UTC',
    hide_side_toolbar: '0',
    allow_symbol_change: '1',
    hide_top_toolbar: '0',
    withdateranges: '1',
    details: '0',
    calendar: '0',
    hotlist: '0',
    hideideas: '1',
  });
  return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
}

export default function SimuladorPage() {
  // estado do painel
  const [panelSide, setPanelSide] = useState<Side>('left');
  const [panelVisible, setPanelVisible] = useState<boolean>(true);

  // estado do gráfico
  const [exchange, setExchange] = useState<typeof exchanges[number]>('BINANCE');
  const [pair, setPair] = useState<typeof pairs[number]>('BTCUSDT');
  const [timeframe, setTimeframe] = useState<typeof timeframes[number]>('1h');

  // tela cheia (overlay fixo)
  const [full, setFull] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // URL do TradingView
  const tvUrl = useMemo(() => buildTvUrl(exchange, pair, timeframe), [exchange, pair, timeframe]);

  // atalho de teclado: F alterna tela cheia
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFull((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // estilos
  const container: CSSProperties = {
    padding: 16,
  };

  const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: panelVisible
      ? panelSide === 'left'
        ? `${PAINEL_WIDTH}px 1fr`
        : `1fr ${PAINEL_WIDTH}px`
      : '1fr',
    gap: GAP,
    alignItems: 'stretch',
  };

  const card: CSSProperties = {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: 12,
    padding: 12,
  };

  const headerBar: CSSProperties = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  };

  const btn: CSSProperties = {
    border: 0,
    borderRadius: 8,
    padding: '8px 12px',
    background: '#1f2937',
    color: '#e5e7eb',
    cursor: 'pointer',
    fontSize: 13,
  };

  const selectCss: CSSProperties = {
    background: '#0b1220',
    color: '#d1d5db',
    border: '1px solid #374151',
    borderRadius: 8,
    padding: '6px 8px',
    fontSize: 13,
  };

  const iframeWrap: CSSProperties = {
    ...card,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
  };

  const iframeCss: CSSProperties = {
    width: '100%',
    height: 'calc(100vh - 180px)', // ocupa a janela abaixo do topo
    border: 0,
    borderRadius: 8,
  };

  return (
    <main style={container}>
      {/* GRID principal */}
      <div style={grid}>
        {/* painel à esquerda */}
        {panelVisible && panelSide === 'left' && (
          <aside style={card}>
            <TradePanel />
          </aside>
        )}

        {/* bloco do gráfico */}
        <section style={iframeWrap}>
          {/* barra de controles do gráfico */}
          <div style={headerBar}>
            {/* seletores */}
            <label>
              <span style={{ marginRight: 6, color: '#9ca3af', fontSize: 12 }}>Exchange</span>
              <select
                value={exchange}
                onChange={(e) => setExchange(e.target.value as any)}
                style={selectCss}
              >
                {exchanges.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span style={{ margin: '0 6px 0 10px', color: '#9ca3af', fontSize: 12 }}>Par</span>
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value as any)}
                style={selectCss}
              >
                {pairs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span style={{ margin: '0 6px 0 10px', color: '#9ca3af', fontSize: 12 }}>Tempo</span>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                style={selectCss}
              >
                {timeframes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <span style={{ flex: 1 }} />

            {/* alternar lado do painel */}
            <button
              style={btn}
              onClick={() => setPanelSide((s) => (s === 'left' ? 'right' : 'left'))}
              title="Mover painel"
            >
              Painel → {panelSide === 'left' ? 'direita' : 'esquerda'}
            </button>

            {/* mostrar/ocultar painel (útil mesmo fora da tela cheia) */}
            <button
              style={btn}
              onClick={() => setPanelVisible((v) => !v)}
              title="Mostrar/ocultar painel"
            >
              {panelVisible ? 'Ocultar painel' : 'Mostrar painel'}
            </button>

            {/* tela cheia */}
            <button
              style={{ ...btn, background: '#0ea5e9' }}
              onClick={() => setFull(true)}
              title="Tela cheia (F)"
            >
              ⛶ Tela cheia
            </button>
          </div>

          {/* IFRAME do TradingView */}
          <iframe title="TradingView" src={tvUrl} style={iframeCss} />
        </section>

        {/* painel à direita */}
        {panelVisible && panelSide === 'right' && (
          <aside style={card}>
            <TradePanel />
          </aside>
        )}
      </div>

      {/* OVERLAY: Tela cheia */}
      {full && (
        <div
          ref={overlayRef}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0b0f17',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            padding: 12,
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <label>
                <span style={{ marginRight: 6, color: '#9ca3af', fontSize: 12 }}>Exchange</span>
                <select
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value as any)}
                  style={selectCss}
                >
                  {exchanges.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span style={{ margin: '0 6px 0 10px', color: '#9ca3af', fontSize: 12 }}>Par</span>
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value as any)}
                  style={selectCss}
                >
                  {pairs.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span style={{ margin: '0 6px 0 10px', color: '#9ca3af', fontSize: 12 }}>
                  Tempo
                </span>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as any)}
                  style={selectCss}
                >
                  {timeframes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn} onClick={() => setFull(false)} title="Sair da tela cheia">
                ✕ Sair
              </button>
              <button
                style={{ ...btn, background: '#0ea5e9' }}
                onClick={() => {
                  // tentar usar o Fullscreen API do navegador para 100% real
                  const el = overlayRef.current;
                  const anyEl = el as any;
                  if (el && !document.fullscreenElement) {
                    (el.requestFullscreen ||
                      anyEl.webkitRequestFullscreen ||
                      anyEl.mozRequestFullScreen ||
                      anyEl.msRequestFullscreen)?.call(el);
                  } else {
                    (document.exitFullscreen as any)?.call(document);
                  }
                }}
              >
                ↕️ Fullscreen do navegador
              </button>
            </div>
          </div>

          <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid #1f2937' }}>
            <iframe
              title="TradingView Full"
              src={tvUrl}
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      )}
    </main>
  );
}
