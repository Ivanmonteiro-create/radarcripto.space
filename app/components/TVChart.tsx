'use client';

import React, { useEffect, useRef, useState } from 'react';

type StudyIds = {
  rsi?: number;
  macd?: number;
  ema20?: number;
  ema50?: number;
};

export default function TVChart() {
  const container = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [studyIds, setStudyIds] = useState<StudyIds>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      const TV = (window as any).TradingView;
      if (!TV) return;

      widgetRef.current = new TV.widget({
        autosize: true,
        symbol: 'BINANCE:BTCUSDT',
        interval: '60',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'br',
        toolbar_bg: '#0b1222',
        enable_publishing: false,
        hide_side_toolbar: false,
        container_id: container.current!.id,
      });

      widgetRef.current.onChartReady(() => {
        setReady(true);
        // Carrega RSI e MACD por padrão
        toggleStudy('rsi', true);
        toggleStudy('macd', true);
      });
    };

    document.body.appendChild(script);
  }, []);

  const toggleStudy = (which: keyof StudyIds, on?: boolean) => {
    const w = widgetRef.current;
    if (!w) return;

    const chart = w.chart();
    const current = { ...studyIds };

    const create = (name: string, inputs?: any[]) =>
      chart.createStudy(name, false, false, inputs ?? undefined);

    if (which === 'rsi') {
      if (on ?? !current.rsi) {
        const id = create('Relative Strength Index');
        current.rsi = id;
      } else if (current.rsi) {
        chart.removeEntity(current.rsi);
        delete current.rsi;
      }
    }

    if (which === 'macd') {
      if (on ?? !current.macd) {
        const id = create('MACD');
        current.macd = id;
      } else if (current.macd) {
        chart.removeEntity(current.macd);
        delete current.macd;
      }
    }

    if (which === 'ema20') {
      if (on ?? !current.ema20) {
        const id = create('Moving Average', [20]);
        current.ema20 = id;
      } else if (current.ema20) {
        chart.removeEntity(current.ema20);
        delete current.ema20;
      }
    }

    if (which === 'ema50') {
      if (on ?? !current.ema50) {
        const id = create('Moving Average', [50]);
        current.ema50 = id;
      } else if (current.ema50) {
        chart.removeEntity(current.ema50);
        delete current.ema50;
      }
    }

    setStudyIds(current);
  };

  const isOn = (k: keyof StudyIds) => !!studyIds[k];

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* container do gráfico */}
      <div
        id="tv_chart_container"
        ref={container}
        style={{ width: '100%', height: '100%' }}
      />

      {/* painel de indicadores no canto superior direito */}
      {ready && (
        <div className="indibox">
          <span className="title">Indicadores</span>

          <label className="chk">
            <input
              type="checkbox"
              checked={isOn('rsi')}
              onChange={() => toggleStudy('rsi')}
            />
            RSI
          </label>

          <label className="chk">
            <input
              type="checkbox"
              checked={isOn('macd')}
              onChange={() => toggleStudy('macd')}
            />
            MACD
          </label>

          <label className="chk">
            <input
              type="checkbox"
              checked={isOn('ema20')}
              onChange={() => toggleStudy('ema20')}
            />
            EMA 20
          </label>

          <label className="chk">
            <input
              type="checkbox"
              checked={isOn('ema50')}
              onChange={() => toggleStudy('ema50')}
            />
            EMA 50
          </label>
        </div>
      )}

      <style>{`
        .indibox{
          position:absolute;top:10px;right:52px; /* deixa espaço pro botão F/X */
          background:linear-gradient(180deg,#0b1220,#0b122a);
          border:1px solid rgba(96,165,250,.6);
          box-shadow:0 12px 22px rgba(59,130,246,.25);
          color:#e5e7eb;
          padding:10px 12px;border-radius:12px;
          display:flex;align-items:center;gap:10px;flex-wrap:wrap;
          font-size:12px;user-select:none;z-index:3;
        }
        .indibox .title{font-weight:900;margin-right:4px;color:#93c5fd}
        .chk{display:flex;align-items:center;gap:6px;padding:4px 6px;
             border-radius:10px;border:1px solid rgba(148,163,184,.25)}
        .chk:hover{background:rgba(96,165,250,.08)}
        .chk input{accent-color:#3b82f6;width:14px;height:14px}
      `}</style>
    </div>
  );
}
