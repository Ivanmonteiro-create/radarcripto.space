'use client';

import { useState } from 'react';

// Se o seu projeto NÃO usa alias "@/*", troque os imports para caminhos relativos:
// import TradingViewWidget from '../../components/TradingViewWidget';
// import TradePanel from '../../components/TradePanel';
import TradingViewWidget from '@/components/TradingViewWidget';
import TradePanel from '@/components/TradePanel';

const PAIRS = [
  'BTCUSDT',
  'ETHUSDT',
  'XRPUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'ADAUSDT',
  'LINKUSDT',
  'DOGEUSDT',
];

export default function SimuladorPage() {
  const [symbol, setSymbol] = useState<string>('BTCUSDT');

  return (
    <main className="w-full h-[100vh] bg-black text-white">
      {/* Layout em duas colunas: gráfico preenche tudo; painel à direita com largura fixa */}
      <div className="flex h-full w-full gap-4 p-4">
        {/* GRÁFICO */}
        <section className="flex-1 min-w-0">
          <div className="h-full w-full rounded-2xl border border-gray-800 bg-gray-900/30 p-2">
            {/* Gráfico sem depender do seu Chart.tsx */}
            <TradingViewWidget symbol={symbol} hideLegend />
          </div>
        </section>

        {/* PAINEL DE TRADE – largura fixa e sem sobras */}
        <aside className="w-[360px] shrink-0">
          <div className="h-full rounded-2xl border border-gray-800 bg-gray-900/30 p-3">
            {/* Passei apenas props seguras: se o seu TradePanel aceitar mais (ex.: interval), adicionamos depois */}
            <TradePanel
              pairs={PAIRS}
              selectedSymbol={symbol}
              onChangeSymbol={setSymbol}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
