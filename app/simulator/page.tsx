// app/simulador/page.tsx
'use client';

import TradingViewWidget from '../../components/TradingViewWidget';
import TradePanel from '../../components/TradePanel';

export const metadata = {
  title: 'Simulador | RadarCripto',
};

export default function SimuladorPage() {
  return (
    <main className="mx-auto max-w-[1600px] p-4 md:p-6">
      <div className="grid grid-cols-12 gap-4">
        {/* Gráfico ocupa tudo que não for o painel à direita */}
        <section className="col-span-12 lg:col-span-9 rounded-xl border border-gray-800 bg-gray-900/30 p-2">
          {/* use o par e o intervalo que preferir */}
          <TradingViewWidget symbol="BINANCE:BTCUSDT" interval="5" hideLegend />
        </section>

        {/* Painel de trade (mantém seu componente atual) */}
        <aside className="col-span-12 lg:col-span-3">
          <TradePanel />
        </aside>
      </div>
    </main>
  );
}
