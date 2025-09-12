'use client';

import { useState } from 'react';

// IMPORTS RELATIVOS — mantém a Home intacta
import TradingViewWidget from '../../components/TradingViewWidget';
import TradePanel from '../../components/TradePanel';

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
      <div className="flex h-full w-full gap-4 p-4">
        {/* GRÁFICO (ocupa todo o espaço restante) */}
        <section className="flex-1 min-w-0">
          <div className="h-full w-full rounded-2xl border border-gray-800 bg-gray-900/30 p-2">
            <TradingViewWidget symbol={symbol} hideLegend />
          </div>
        </section>

        {/* PAINEL DE TRADE (fixo à direita) */}
        <aside className="w-[360px] shrink-0">
          <div className="h-full rounded-2xl border border-gray-800 bg-gray-900/30 p-3">
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
