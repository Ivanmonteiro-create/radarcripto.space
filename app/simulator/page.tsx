import Chart from "@/components/Chart";
import TradePanel from "@/components/TradePanel";

export const dynamic = "force-dynamic";

export default function SimuladorPage() {
  return (
    <main className="flex-1">
      {/* container full-width, sem sobras laterais */}
      <section className="mx-auto w-full max-w-[1400px] px-2 md:px-4 py-4">
        {/* layout principal: gráfico ocupa todo o espaço restante */}
        <div
          className="grid gap-4 md:gap-6"
          style={{ gridTemplateColumns: "1fr 380px" }} // direita = painel fixo
        >
          {/* GRÁFICO */}
          <div
            className="relative rounded-2xl border border-gray-800 bg-gray-900/40 overflow-hidden"
            style={{
              // altura: ocupar quase toda a janela, respeitando o navbar
              height: "calc(100vh - 7.5rem)", // ajuste fino se desejar
            }}
          >
            <Chart symbol="BTCUSDT" interval="5" />
          </div>

          {/* PAINEL DE TRADE */}
          <TradePanel />
        </div>
      </section>
    </main>
  );
}
