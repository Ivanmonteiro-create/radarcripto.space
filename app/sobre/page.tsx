// app/about/page.tsx
export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Sobre</h1>
      <p className="text-gray-300 leading-relaxed">
        O RadarCripto é um simulador de trading pensado para estudo sério e evolução prática.
        Nosso objetivo é oferecer um ambiente sem risco, com ferramentas essenciais para
        aprender análise técnica, testar estratégias e ganhar confiança.
      </p>
      <p className="text-gray-300 leading-relaxed mt-4">
        Estamos desenvolvendo a Fase 2: dados de preço normalizados por API, persistência
        robusta e base para monetização. Depois, virão login e planos pagos.
      </p>
    </section>
  );
}
