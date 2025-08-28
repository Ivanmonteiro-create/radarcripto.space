'use client';
import React from 'react';
import TradePanel from '../components/TradePanel';

export default function SimuladorPage(){
  // estado do layout
  const [painelPos, setPainelPos] = React.useState<'left'|'right'>('left');
  const [painelVisivel, setPainelVisivel] = React.useState(true);
  const [isFullscreen, setIsFullscreen]   = React.useState(false);

  // seletores simples (não mexe no seu embed, apenas exemplo)
  const [exchange]   = React.useState('BINANCE');
  const [pair]       = React.useState('BTCUSDT');
  const [timeframe]  = React.useState('1h');

  // handlers dos botões azuis
  const moverPainelEsquerda = () => setPainelPos('left');
  const moverPainelDireita  = () => setPainelPos('right');
  const togglePainel        = () => setPainelVisivel(v => !v);
  const toggleFullscreen    = () => setIsFullscreen(f => !f);

  // URL do TradingView (usa o seu embed público)
  // Mantém os indicadores à vista (depende do próprio widget).
  const tvSrc = `https://s.tradingview.com/widgetembed/?symbol=${pair}&interval=${timeframe}&exchange=${exchange}&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1`;

  // ordem dos elementos conforme posição do painel
  const leftCol = painelVisivel ? <TradePanel /> : null;

  const chartEl = (
    <div className={isFullscreen ? 'chartBox chartBox--full' : 'chartBox'}>
      <iframe title="TradingView"
              src={tvSrc}
              allowTransparency
              referrerPolicy="no-referrer-when-downgrade" />
      {isFullscreen && (
        <button className="btn btn-blue btn-exit" onClick={toggleFullscreen}>Sair</button>
      )}
    </div>
  );

  return (
    <main>
      {/* barra superior com botões azuis padronizados */}
      <div className="toolbar">
        <button className="btn btn-blue" onClick={moverPainelEsquerda}>Painel ← esquerda</button>
        <button className="btn btn-blue" onClick={moverPainelDireita}>Painel → direita</button>
        <button className="btn btn-blue" onClick={togglePainel}>
          {painelVisivel ? 'Ocultar painel' : 'Mostrar painel'}
        </button>
        <button className="btn btn-blue" onClick={toggleFullscreen}>
          {isFullscreen ? 'Sair' : 'Tela cheia'}
        </button>
      </div>

      {/* layout 2 colunas */}
      <section className="container-sim" style={{flexDirection: painelPos === 'left' ? 'row' : 'row-reverse'}}>
        {leftCol}
        {chartEl}
      </section>
    </main>
  );
}
