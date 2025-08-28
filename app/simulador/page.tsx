'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TradePanel from '../components/TradePanel';
import TVChart from '../components/TVChart';

type PanelSide = 'left' | 'right';

export default function SimuladorPage() {
  const [panelSide, setPanelSide] = useState<PanelSide>('left');
  const [panelVisible, setPanelVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    typeof document !== 'undefined' ? !!document.fullscreenElement : false
  );

  // listeners para fullscreen (botão e atalhos F / X)
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f' && !document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      }
      if (e.key.toLowerCase() === 'x' && document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleSide = useCallback(
    () => setPanelSide((s) => (s === 'left' ? 'right' : 'left')),
    []
  );
  const toggleVisible = useCallback(() => setPanelVisible((v) => !v), []);
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }, []);

  const PANEL_WIDTH = 360;

  const container: React.CSSProperties = {
    height: 'calc(100vh - 64px)', // ocupa até o rodapé
    minHeight: 520,
    display: 'flex',
    gap: 10,
    padding: 10,
    boxSizing: 'border-box',
  };

  const chartShell: React.CSSProperties = {
    position: 'relative',
    flex: '1 1 auto',
    minWidth: 0,
    borderRadius: 14,
    background:
      'linear-gradient(180deg, rgba(18, 24, 38, 0.9), rgba(15, 18, 28, 0.9))',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow:
      '0 12px 30px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,0.04)',
    overflow: 'hidden',
  };

  const panelStyle: React.CSSProperties = {
    width: panelVisible ? PANEL_WIDTH : 0,
    transition: 'width .25s ease',
    overflow: 'hidden',
    flex: '0 0 auto',
  };

  const controlBar: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
  };

  const ghostBtn: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(255,255,255,.06)',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 12,
    cursor: 'pointer',
  };

  return (
    <main style={{ padding: 8 }}>
      {/* barra superior – mantém sua lógica, só deixei mais clean */}
      <div style={controlBar}>
        <button style={ghostBtn} onClick={toggleSide}>
          Painel → {panelSide === 'left' ? 'direita' : 'esquerda'}
        </button>
        <button style={ghostBtn} onClick={toggleVisible}>
          {panelVisible ? 'Ocultar painel' : 'Mostrar painel'}
        </button>
        <button style={ghostBtn} onClick={toggleFullscreen} title="Atalho: F/X">
          {isFullscreen ? 'X' : 'F'} Tela cheia
        </button>
      </div>

      <section
        style={{
          ...container,
          flexDirection: panelSide === 'left' ? 'row' : 'row-reverse',
        }}
      >
        <aside style={panelStyle}>
          <TradePanel />
        </aside>

        <div style={chartShell}>
          {/* botão flutuante no canto do gráfico (mesma ação de tela cheia) */}
          <button
            onClick={toggleFullscreen}
            title="Tela cheia (F) / Sair (X)"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 2,
              border: '1px solid rgba(255,255,255,.15)',
              background: 'rgba(18, 22, 30, .9)',
              borderRadius: 10,
              padding: '8px 10px',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {isFullscreen ? 'X' : 'F'}
          </button>

          {/* TVChart preenche 100% */}
          <TVChart />
        </div>
      </section>
    </main>
  );
}
