// app/simulator/page.tsx
import TradingViewWidget from "@/components/TradingViewWidget";
import TradePanel from "@/components/TradePanel";

export const metadata = {
  title: "Simulador | RadarCrypto",
  description: "Simulador de trading do RadarCrypto",
};

export default function SimulatorPage() {
  // Altura útil da tela (desconta o header do seu layout)
  const chartHeightClass =
    "h-[calc(100vh-120px)] sm:h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)]";

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 py-4">
        {/* GRID: gráfico à esquerda (1fr) e painel à direita (360px fixo) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          {/* GRÁFICO – ocupa tudo, sem bordas sobrando */}
          <section
            aria-label="Painel de gráfico"
            className={`rounded-2xl border border-gray-800/50 bg-black/20 p-0 ${chartHeightClass}`}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <TradingViewWidget symbol="BINANCE:BTCUSDT" interval="5" />
            </div>
          </section>

          {/* CONTROLE DE TRADE – coluna lateral direita */}
          <aside
            aria-label="Controles de Trade"
            className={`rounded-2xl border border-gray-800/50 bg-black/20 p-4 ${chartHeightClass} overflow-auto`}
          >
            <TradePanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
