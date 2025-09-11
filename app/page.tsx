import Link from "next/link";
import TickerMarquee from "@/components/TickerMarquee";

export default function HomePage() {
  return (
    <>
      <TickerMarquee />
      <section className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Aprenda de verdade <span className="text-emerald-400">sem perder nada</span>.
          </h1>
          <p className="mt-4 text-gray-300">
            Estude análise técnica com um simulador realista, sem risco de capital.
            Evolua praticando com controle de risco e histórico de operações.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              href="/simulator"
              className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-700"
            >
              Acessar simulador
            </Link>
            <Link
              href="/plans"
              className="inline-flex items-center rounded-lg border border-gray-700 px-4 py-2 font-medium hover:bg-gray-800"
            >
              Ver planos
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-sm text-gray-400 mb-3">Destaques</p>
          <ul className="space-y-2 text-gray-200">
            <li>• Controle de risco configurável</li>
            <li>• Histórico de trades salvo no navegador</li>
            <li>• Sem corretora, sem cadastro</li>
            <li>• Pronto para evoluir para dados ao vivo</li>
          </ul>
        </div>
      </section>
    </>
  );
}
