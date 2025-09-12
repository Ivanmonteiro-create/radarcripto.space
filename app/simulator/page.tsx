// app/simulador/page.tsx
export const metadata = {
  title: 'Simulador | RadarCrypto',
  description: 'Simulador de trading do RadarCrypto',
};

export default function SimuladorPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] w-full bg-black text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Simulador</h1>

        {/* Área do gráfico */}
        <section className="rounded-xl border border-gray-800 bg-[#0b0b0b] p-2 mb-6">
          <div className="h-[55vh] w-full rounded-lg bg-black" />
        </section>

        {/* Controles de trade (placeholder) */}
        <section className="rounded-xl border border-gray-800 bg-[#0b0b0b] p-4">
          <h2 className="text-lg font-semibold mb-3">Controles de Trade</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-sm text-gray-400 mb-1">Par</div>
              <div className="rounded-md bg-black/60 px-3 py-2 border border-gray-800">BTC/USDT</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-sm text-gray-400 mb-1">Quantidade</div>
              <div className="rounded-md bg-black/60 px-3 py-2 border border-gray-800">0</div>
            </div>
            <div className="flex items-end gap-2">
              <button className="rounded-md bg-emerald-600 text-black px-4 py-2 font-medium hover:opacity-90">Comprar</button>
              <button className="rounded-md bg-red-600 px-4 py-2 font-medium hover:opacity-90">Vender</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
