'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Componente de gráfico via TradingView (iframe)
 * - Altura 100% do contêiner
 * - Resize automático quando o contêiner muda (ResizeObserver)
 * - Tenta reenviar postMessage de resize para o iframe (melhora “canvas cortado”)
 */
export default function TVChart() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const resize = () => {
      const el = wrapperRef.current!;
      const iframe = iframeRef.current;
      // força o iframe a ocupar 100% do espaço
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        // alguns temas do TV reagem a este postMessage
        try {
          iframe.contentWindow?.postMessage(
            { type: 'resize', width: el.clientWidth, height: el.clientHeight },
            '*'
          );
        } catch {
          // silencioso
        }
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrapperRef.current);

    // 2 chutes extras após montar (corrige canvas que fica “pequeno”)
    const t1 = setTimeout(resize, 60);
    const t2 = setTimeout(resize, 300);

    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // altura total – o contêiner pai já tem height 100%
  const wrapStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
  };

  // URL do widget oficial (pode trocar símbolo/tema depois)
  const src =
    'https://s.tradingview.com/widgetembed/?symbol=BINANCE:BTCUSDT&interval=60&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=rgba(0,0,0,0)&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1&allow_symbol_change=1';

  return (
    <div ref={wrapperRef} style={wrapStyle}>
      <iframe
        ref={iframeRef}
        title="TradingView"
        src={src}
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          display: 'block',
        }}
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
