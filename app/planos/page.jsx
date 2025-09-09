export const metadata = {
  title: "Planos — RadarCrypto.space",
  description: "Conheça os planos e recursos premium do simulador.",
};

export default function PlanosPage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-slate-900 text-slate-100">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          💎 Nossos Planos
        </h1>
        <p className="mt-3 text-slate-300">
          Em breve você poderá comparar recursos e escolher o plano ideal.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">Gratuito</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>Simulador com moedas principais</li>
              <li>Indicadores básicos</li>
              <li>Histórico local (no navegador)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
            <h2 className="text-xl font-semibold">Pro (em breve)</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>Salvar sessões na nuvem</li>
              <li>Mais ativos e timeframes</li>
              <li>Relatórios e métricas avançadas</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-5">
            <h2 className="text-xl font-semibold">Institucional (em breve)</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>Times e salas privadas</li>
              <li>Exportação de dados</li>
              <li>Suporte prioritário</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
