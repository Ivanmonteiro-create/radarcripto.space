export const metadata = {
  title: 'Sobre | RadarCrypto.space',
  description: 'Saiba mais sobre o projeto RadarCrypto.space.',
};

export default function SobrePage() {
  return (
    <main className="container">
      <h1>Sobre</h1>
      <p>
        O RadarCrypto.space é um simulador de trading que ajuda você a estudar, praticar e
        evoluir em análise gráfica sem risco. Nossa missão é tornar o aprendizado acessível
        e prático para todos.
      </p>
      <div className="links">
        <a href="/">Voltar ao início</a>
        <a href="/planos">Planos</a>
        <a href="/simulador">Acessar simulador</a>
      </div>
    </main>
  );
}
