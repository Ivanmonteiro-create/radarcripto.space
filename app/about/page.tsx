import BackToHome from "@/components/BackToHome";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Sobre o RadarCripto</h1>
        <p className="mt-3 text-gray-300 max-w-2xl">
          Um simulador de trading criado para estudo sério e evolução prática. Treine leitura de
          gráfico, gestão de risco e execução — sem colocar dinheiro em risco.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="font-semibold mb-2">Propósito</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Ajudar estudantes e traders iniciantes a praticarem de forma segura e consistente,
            ganhando confiança para a próxima etapa.
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="font-semibold mb-2">Como funciona</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Interface simples, controles de compra/venda, histórico de trades e indicadores
            essenciais. Evoluímos gradualmente com base em feedback.
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="font-semibold mb-2">O que vem aí</h2>
          <ul className="text-gray-300 text-sm leading-relaxed space-y-1">
            <li>• Dados ao vivo por API</li>
            <li>• Login e sincronização na nuvem</li>
            <li>• Planos pagos (Pro/Expert)</li>
          </ul>
        </div>
      </div>

      <BackToHome />
    </section>
  );
}
