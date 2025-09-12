// app/simulador/page.tsx
import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Simulador | RadarCrypto',
  description: 'Simulador de trading com gráfico e painel de operações.',
};

// importa componentes client-side sem SSR (evita "use client" aqui)
const TradingViewWidget = dynamic(
  () => import('@/components/TradingViewWidget'),
  { ssr: false }
);

const TradePanel = dynamic(
  () => import('@/components/TradePanel'),
  { ssr: false }
);

export default function SimuladorPage() {
  return (
    <main className="mx-auto max-w-[1600px] p-4 md:p-6">
      <div className="grid grid-cols-12 gap-4">
        {/* Gráfico ocupa o espaço restante */}
        <section className="col-span-12 lg:col-span-9 rounded-xl border border-gray-800 bg-gray-900/30 p-2">
          <TradingViewWidget symbol="BINANCE:BTCUSDT" interval="5" hideLegend />
        </section>

        {/* Painel de trade à direita */}
        <aside className="col-span-12 lg:col-span-3">
          <TradePanel />
        </aside>
      </div>
    </main>
  );
}
