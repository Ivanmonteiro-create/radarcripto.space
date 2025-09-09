export const metadata = {
  title: 'Sobre | RadarCrypto.space',
  description: 'Saiba mais sobre o projeto e nossos objetivos.',
};

export default function SobrePage() {
  return (
    <main className="container">
      <h1>Sobre</h1>
      <p>
        O RadarCrypto.space é um simulador prático para estudar e evoluir em análise
        gráfica sem risco. Aqui você treina, testa estratégias e acompanha os resultados.
      </p>

      <div className="links">
        <a href="/">Voltar ao início</a>
        <a href="/planos">Planos</a>
        <a href="/simulador">Acessar simulador</a>
      </div>
    </main>
  );
}
