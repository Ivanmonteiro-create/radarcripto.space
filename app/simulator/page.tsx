import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";

export const dynamic = "force-dynamic";

export default function SimuladorPage() {
  return (
    <main className="flex-1">
      <section className="w-full px-2 md:px-4 py-4">
        {/* grid: gráfico ocupa tudo à esquerda, painel fixo à direita */}
        <div
          className="grid gap-4 md:gap-6"
          style={{ gridTemplateColumns: "minmax(0,1fr) 380px" }}
        >
          {/* GRÁFICO — sem sobras internas */}
          <div
            className="relative rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden"
            style={{ height: "calc(100vh - 7.5rem)" }}
          >
            {/* ATENÇÃO: interval deve ser string */}
            <Chart symbol="BTCUSDT" interval="5" />
          </div>

          {/* PAINEL DE TRADE (já existente) */}
          <TradePanel />
        </div>
      </section>
    </main>
  );
}
