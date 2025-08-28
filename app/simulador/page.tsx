'use client';

import React, { useMemo, useState, useCallback } from 'react';
import TradePanel from '../components/TradePanel';
import TVChart from '../components/TVChart';

type PanelSide = 'left' | 'right';

export default function SimuladorPage() {
  // estado do layout
  const [panelSide, setPanelSide] = useState<PanelSide>('left');
  const [panelVisible, setPanelVisible] = useState(true);

  const toggleSide = useCallback(() => {
    setPanelSide((s) => (s === 'left' ? 'right' : 'left'));
  }, []);

  const toggleVisible = useCallback(() => {
    setPanelVisible((v) => !v);
  }, []);

  // largura fixa do painel, gráfico ocupa o resto
  const PANEL_WIDTH = 360;

  const container: React.CSSProperties = {
    height: 'calc(100vh - 64px)', // ocupa até o rodapé (ajuste o 64px se houver header)
    minHeight: 520,
    display: 'flex',
    gap: 8,
    padding: 8,
    boxSizing: 'border-box',
  };

  const panelStyle: React.CSSProperties = {
    width: panelVisible ? PANEL_WIDTH : 0,
    transition: 'width .25s ease',
    overflow: 'hidden',
    flex: '0 0 auto',
  };

  const chartWrap: React.CSSProperties = {
    flex: '1 1 auto',
    minWidth: 0,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 0 0 1px rgba(0,0,0,.25) inset',
    position: 'relative',
    overflow: 'hidden',
  };

  const topBar: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 8px',
  };

  const pill: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,.1)',
    background: 'rgba(255,255,255,.06)',
    borderRadius: 8,
    padding: '8px 10px',
    fontSize: 12,
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <main style={{ padding: 8 }}>
      {/* Barra de controles do layout (mantém os seus botões) */}
      <div style={topBar}>
        <button style={pill} onClick={toggleSide}>
          Painel → {panelSide === 'left' ? 'direita' : 'esquerda'}
        </button>
        <button style={pill} onClick={toggleVisible}>
          {panelVisible ? 'Ocultar painel' : 'Mostrar painel'}
        </button>
        <a
          style={pill}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            document.documentElement.requestFullscreen?.();
          }}
        >
          Tela cheia
        </a>
      </div>

      {/* Layout em 2 colunas, lado variável, gráfico sempre preenchendo o resto */}
      <section
        style={{
          ...container,
          flexDirection: panelSide === 'left' ? 'row' : 'row-reverse',
        }}
      >
        {/* Painel (só some a coluna; nada mais muda) */}
        <aside style={panelStyle}>
          <TradePanel />
        </aside>

        {/* Gráfico – cresce/encolhe automaticamente e re-renderiza no resize */}
        <div style={chartWrap}>
          <TVChart />
        </div>
      </section>
    </main>
  );
}
