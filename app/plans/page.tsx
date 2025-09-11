import PlanCard from "@/components/PlanCard";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0/mês",
    features: [
      "Simulador com dados locais",
      "Histórico no navegador",
      "Gestão de risco básica",
      "Sem cadastro",
    ],
    ctaHref: "/checkout?plan=free",
  },
  {
    name: "Pro",
    price: "R$ 29/mês",
    features: [
      "Tudo do Gratuito",
      "Indicadores e layouts extras",
      "Backtests básicos",
      "Alertas de operação",
    ],
    ctaHref: "/checkout?plan=pro",
    highlight: true,
    ribbon: "Mais popular",
  },
  {
    name: "Expert",
    price: "R$ 79/mês",
    features: [
      "Tudo do Pro",
      "Estratégias avançadas",
      "Salas e mentorias em grupo",
      "Atendimento dedicado",
    ],
    ctaHref: "/checkout?plan=expert",
  },
];

export default function PlansPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Planos</h1>
        <p className="text-gray-300 mt-2">Escolha um plano para estudar, praticar e evoluir.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <PlanCard key={p.name} {...p} />
        ))}
      </div>
    </section>
  );
}
