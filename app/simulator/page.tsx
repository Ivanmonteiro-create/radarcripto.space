'use client';

import { useState } from 'react';

// Se você tem alias "@/*" no tsconfig, deixe assim.
// Se NÃO tiver alias, troque para: import Chart from '../../components/Chart';
import Chart from '@/components/Chart';
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
  const [interval, setInterval] = useState<string>('5m');

  return (
    <main className="w-full h-[calc(100vh-0px)] bg-black text-white">
      {/* layout em linha: gráfico ocupa tudo; painel com largura fixa à direita */}
      <div className="flex h-full w-full gap-4 p-4">
        {/* GRÁFICO */}
        <div className="flex-1 min-w-0">
          <div className="h-full w-full rounded-2xl border border-gray-800 bg-gray-900/30 p-2">
            {/* O Chart.tsx deve aceitar props: symbol, interval, hideLegend (opcional) */}
            <Chart symbol={symbol} interval={interval} hideLegend />
          </div>
        </div>

        {/* PAINEL DE TRADE – largura fixa, sem sobras */}
        <aside className="w-[360px] shrink-0">
          <div className="h-full rounded-2xl border border-gray-800 bg-gray-900/30 p-3">
            {/* O TradePanel.tsx deve aceitar props: selectedSymbol, onChangeSymbol, interval, onChangeInterval */}
            <TradePanel
              selectedSymbol={symbol}
              onChangeSymbol={setSymbol}
              interval={interval}
              onChangeInterval={setInterval}
              pairs={PAIRS}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
