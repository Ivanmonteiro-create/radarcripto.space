// app/plans/page.tsx
import Link from "next/link";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0/mês",
    features: [
      "Simulador com dados locais",
      "Histórico no navegador",
      "Básico de gestão",
      "Sem cadastro",
    ],
    cta: "/checkout?plan=free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 29/mês",
    features: [
      "Tudo do Gratuito",
      "Acessos a indicadores extras",
      "Backtests básicos",
      "Alertas de operação",
    ],
    cta: "/checkout?plan=pro",
    highlight: true,
  },
  {
    name: "Expert",
    price: "R$ 79/mês",
    features: [
      "Tudo do Pro",
      "Estratégias avançadas",
      "Memórias de estúdio em grupo",
      "Atendimento dedicado",
    ],
    cta: "/checkout?plan=expert",
    highlight: false,
  },
];

export default function PlansPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-10">Planos</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-6 ${
              p.highlight
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-gray-800 bg-gray-900/50"
            }`}
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="mt-1 text-gray-300">{p.price}</p>
            <ul className="mt-4 space-y-2 text-gray-200">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <Link
              href={p.cta}
              className={`mt-6 inline-flex w-full justify-center rounded-lg px-4 py-2 font-medium ${
                p.highlight
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "border border-gray-700 hover:bg-gray-800"
              }`}
            >
              Assinar {p.name}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
