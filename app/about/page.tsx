// app/about/page.tsx
export const metadata = { title: "Sobre | RadarCrypto" };

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold text-white">Sobre</h1>
      <p className="mb-4 text-gray-300">
        O RadarCrypto é um simulador prático para testar estratégias e evoluir <span className="text-emerald-400">sem risco</span>.
      </p>
      <ul className="list-disc space-y-2 pl-6 text-gray-300">
        <li>Conta demo (sem corretora).</li>
        <li>8 pares populares (BTC, ETH, XRP, ADA, SOL, LINK, DOGE, BNB).</li>
        <li>Gráfico TradingView com intervalos configuráveis.</li>
        <li>Histórico local no navegador (em breve).</li>
        <li>Execução de ordens de compra e venda (em breve).</li>
      </ul>
    </main>
  );
}
