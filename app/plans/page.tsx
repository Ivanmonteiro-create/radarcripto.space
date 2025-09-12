export default function PlanosPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Planos</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
          <h2 className="text-xl font-semibold">Gratuito</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-300">
            <li>Simulador com dados locais</li>
            <li>Histórico no navegador</li>
            <li>Gestão de risco básica</li>
          </ul>
        </div>
        <div className="rounded-xl border border-emerald-700 bg-emerald-900/10 p-6">
          <h2 className="text-xl font-semibold text-emerald-300">Pro</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-300">
            <li>Tudo do gratuito</li>
            <li>Backtests básicos</li>
            <li>Alertas de operação</li>
          </ul>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6">
          <h2 className="text-xl font-semibold">Expert</h2>
          <ul className="mt-3 list-disc pl-5 text-gray-300">
            <li>Tudo do Pro</li>
            <li>Estudos avançados</li>
            <li>Atendimento dedicado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
