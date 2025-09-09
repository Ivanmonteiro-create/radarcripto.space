export const metadata = {
  title: 'Contato | RadarCrypto.space',
  description: 'Entre em contato com a equipe do RadarCrypto.space.',
};

export default function ContatoPage() {
  return (
    <main className="container">
      <h1>Fale com a gente</h1>
      <p>
        Envie um e-mail para:{" "}
        <a href="mailto:contato@radarcrypto.space">contato@radarcrypto.space</a>
      </p>
      <p>Ou use o botão de contato disponível no site.</p>
      <div className="links">
        <a href="/">Voltar ao início</a>
        <a href="/planos">Planos</a>
        <a href="/simulador">Acessar simulador</a>
      </div>
    </main>
  );
}
