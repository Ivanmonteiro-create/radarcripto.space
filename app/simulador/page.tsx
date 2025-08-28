'use client';

import React, { useCallback, useEffect, useState } from 'react';
import TradePanel from '../components/TradePanel';
import TVChart from '../components/TVChart';

type PanelSide = 'left' | 'right';

export default function SimuladorPage() {
  const [panelSide, setPanelSide] = useState<PanelSide>('left');
  const [panelVisible, setPanelVisible] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    typeof document !== 'undefined' ? !!document.fullscreenElement : false
  );

  // observa mudanças de fullscreen
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // atalhos F (entrar) e X (sair)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'f' && !document.fullscreenElement) document.documentElement.requestFullscreen?.();
      if (k === 'x' && document.fullscreenElement) document.exitFullscreen?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleSide = useCallback(() => setPanelSide(s => (s === 'left' ? 'right' : 'left')), []);
  const toggleVisible = useCallback(() => setPanelVisible(v => !v), []);
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }, []);

  const PANEL_WIDTH = 360;

  // estilos base
  const container: React.CSSProperties = {
    height: 'calc(100vh - 64px)',
    minHeight: 520,
    display: 'flex',
    gap: 12,
    padding: 12,
    boxSizing: 'border-box',
  };

  const chartShellBase: React.CSSProperties = {
    position: 'relative',
    flex: '1 1 auto',
    minWidth: 0,
    borderRadius: 16,
    background: 'linear-gradient(180deg, #0f172a, #0b1222)',
    border: '1px solid rgba(148,163,184,0.18)',
    boxShadow: '0 14px 36px rgba(2,8,23,.55), inset 0 1px 0 rgba(255,255,255,.04)',
    overflow: 'hidden',
  };

  // quando em fullscreen: ocupa TUDO (sem borda, sem radius, sem padding da página)
  const chartFullscreen: React.CSSProperties = isFullscreen
    ? {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        zIndex: 50,
      }
    : {};

  const panelStyle: React.CSSProperties = {
    width: panelVisible && !isFullscreen ? PANEL_WIDTH : 0,
    transition: 'width .25s ease',
    overflow: 'hidden',
    flex: '0 0 auto',
  };

  return (
    <main style={{ padding: isFullscreen ? 0 : 8 }}>
      {/* Topbar some no fullscreen */}
      {!isFullscreen && (
        <div className="rc-topbar">
          <button className="rc-ghost" onClick={toggleSide}>
            Painel → {panelSide === 'left' ? 'direita' : 'esquerda'}
          </button>
          <button className="rc-ghost" onClick={toggleVisible}>
            {panelVisible ? 'Ocultar painel' : 'Mostrar painel'}
          </button>
          <button className="rc-ghost rc-ghost-strong" onClick={toggleFullscreen} title="Atalhos: F / X">
            F Tela cheia
          </button>
        </div>
      )}

      <section
        style={{
          ...(isFullscreen ? { height: 0, padding: 0 } : container),
          flexDirection: panelSide === 'left' ? 'row' : 'row-reverse',
        }}
      >
        {/* painel só aparece fora do fullscreen */}
        {!isFullscreen && (
          <aside style={panelStyle}>
            <TradePanel />
          </aside>
        )}

        <div style={{ ...chartShellBase, ...chartFullscreen }}>
          {/* Botão flutuante F/X no gráfico */}
          <button
            className="rc-float"
            onClick={toggleFullscreen}
            title="Tela cheia (F) / Sair (X)"
          >
            {isFullscreen ? 'X' : 'F'}
          </button>

          <TVChart />
        </div>
      </section>

      <style>{`
        .rc-topbar{
          display:flex;align-items:center;gap:10px;padding:8px 10px
        }
        .rc-ghost{
          border:1px solid rgba(148,163,184,.35);
          background:rgba(15,23,42,.75);
          color:#e5e7eb;
          border-radius:12px;
          padding:10px 14px;
          font-size:12px;
          font-weight:800;
          cursor:pointer;
          transition:all .18s ease;
          letter-spacing:.3px;
        }
        .rc-ghost:hover{
          transform:translateY(-1px);
          box-shadow:0 10px 18px rgba(2,8,23,.35);
          border-color:#60a5fa;color:#fff
        }
        /* botão de tela cheia mais chamativo */
        .rc-ghost-strong{
          background:linear-gradient(180deg,#60a5fa,#3b82f6);
          border-color:#60a5fa;color:#0b1220;
          text-shadow:0 1px 0 rgba(255,255,255,.35)
        }
        .rc-ghost-strong:hover{
          filter:saturate(1.15);box-shadow:0 12px 22px rgba(59,130,246,.35)
        }

        .rc-float{
          position:absolute;top:10px;right:10px;z-index:2;
          border:1px solid rgba(148,163,184,.45);
          background:linear-gradient(180deg,#1f2937,#0f172a);
          color:#e5e7eb;border-radius:12px;padding:10px 12px;
          font-size:13px;font-weight:900;cursor:pointer;transition:all .18s ease;
        }
        .rc-float:hover{
          transform:translateY(-1px);
          box-shadow:0 12px 20px rgba(2,8,23,.45);
          border-color:#60a5fa;color:#fff
        }
      `}</style>
    </main>
  );
}
