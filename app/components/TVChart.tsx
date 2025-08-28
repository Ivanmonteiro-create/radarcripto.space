'use client';

import React, { useEffect, useRef } from 'react';

export default function TVChart() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const resize = () => {
      const el = wrapRef.current!;
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        try {
          iframe.contentWindow?.postMessage(
            { type: 'resize', width: el.clientWidth, height: el.clientHeight },
            '*'
          );
        } catch {}
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current);
    const t1 = setTimeout(resize, 60);
    const t2 = setTimeout(resize, 300);
    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
      <iframe
        ref={iframeRef}
        title="TradingView"
        src={
          'https://s.tradingview.com/widgetembed/?symbol=BINANCE:BTCUSDT&interval=60&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=rgba(0,0,0,0)&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1&allow_symbol_change=1'
        }
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
