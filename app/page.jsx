export const metadata = {
  title: 'RadarCrypto.space | Início',
  description: 'Um simulador prático para testar estratégias e evoluir sem risco.',
};

export default function HomePage() {
  return (
    <main className="container">
      <h1>Aprenda de verdade sem perder nada.</h1>
      <p>
        Um simulador prático para testar estratégias e evoluir <strong>sem risco</strong>.
      </p>
      <div className="links">
        <a href="/planos">Planos</a>
        <a href="/simulador">Acessar simulador</a>
        <a href="/sobre">Sobre</a>
        <a href="/contato">Fale com a gente</a>
      </div>
    </main>
  );
}
