'use client';

import React from 'react';
import TradePanel from '../components/TradePanel';
import TVChart from '../components/TVChart';

export default function SimuladorPage() {
  const [panelSide, setPanelSide] = React.useState<'left' | 'right'>('left');
  const [panelVisible, setPanelVisible] = React.useState(true);

  return (
    <main style={container}>
      {/* painel à esquerda */}
      {panelVisible && panelSide === 'left' && (
        <aside style={aside}>
          <TradePanel />
        </aside>
      )}

      {/* área do gráfico */}
      <section style={chartBox}>
        <TVChart />
      </section>

      {/* painel à direita */}
      {panelVisible && panelSide === 'right' && (
        <aside style={aside}>
          <TradePanel />
        </aside>
      )}

      {/* botões flutuantes — mesmos comportamentos de antes */}
      <div style={floatingGroup}>
        <button
          className="btn btn-gray"
          onClick={() => setPanelSide((s) => (s === 'left' ? 'right' : 'left'))}
          title={panelSide === 'left' ? 'Levar painel para a direita' : 'Levar painel para a esquerda'}
        >
          {panelSide === 'left' ? 'Painel → direita' : 'Painel → esquerda'}
        </button>

        <button
          className="btn btn-gray"
          onClick={() => setPanelVisible((v) => !v)}
          title={panelVisible ? 'Ocultar painel' : 'Mostrar painel'}
          style={{ marginLeft: 8 }}
        >
          {panelVisible ? 'Ocultar painel' : 'Mostrar painel'}
        </button>

        <button
          className="btn btn-gray"
          onClick={() => document.documentElement.requestFullscreen?.()}
          title="Tela cheia"
          style={{ marginLeft: 8 }}
        >
          ⛶ Tela cheia
        </button>
      </div>
    </main>
  );
}

/* ========== ESTILOS (apenas layout) ========== */

/** ocupa toda a viewport SEM respiro inferior */
const container: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '360px 1fr',   // largura fixa do painel + área do gráfico
  gap: 12,
  height: '100dvh',                   // altura total da janela (dinâmica, funciona no mobile também)
  padding: '12px 12px 0',             // remove o padding de baixo
  boxSizing: 'border-box',
  overflow: 'hidden',                 // evita rolagem indesejada
};

/** card do painel */
const aside: React.CSSProperties = {
  height: '100%',
  overflow: 'hidden',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.06)',
  background: 'linear-gradient(180deg,#0f172a,#0b1224)',
  boxShadow: '0 8px 30px rgba(0,0,0,.35) inset, 0 0 0 1px rgba(255,255,255,.04)',
};

/** caixa do gráfico — cresce para ocupar tudo */
const chartBox: React.CSSProperties = {
  height: '100%',
  width: '100%',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.06)',
  background: 'linear-gradient(180deg,#0f172a,#0b1224)',
  boxShadow: '0 8px 30px rgba(0,0,0,.35) inset, 0 0 0 1px rgba(255,255,255,.04)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

/** grupo de botões no topo direito da área do gráfico */
const floatingGroup: React.CSSProperties = {
  position: 'fixed',
  top: 12,
  right: 12,
  display: 'flex',
  alignItems: 'center',
  zIndex: 50,
};
