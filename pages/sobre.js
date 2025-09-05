// pages/sobre.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';

export default function Sobre() {
  return (
    <>
      <Header />
      <main className="container">
        <section style={{maxWidth: 900, margin: '32px auto 56px'}}>
          <span className="kicker">Sobre o projeto</span>
          <h1 className="title" style={{fontSize: 34, marginTop: 8}}>O que é o RadarCrypto.space?</h1>
          <p className="subtitle" style={{marginTop: 8}}>
            Um simulador de trading pensado para estudo e prática, com foco em
            métricas claras e decisões objetivas. Esta é a <b>Fase 1</b>: site base online.
          </p>

          <div style={{
            marginTop: 24, padding: 16, borderRadius: 12,
            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)'
          }}>
            <h3 style={{marginTop: 0}}>Objetivos desta fase</h3>
            <ul style={{lineHeight: 1.8, marginBottom: 0}}>
              <li>Publicar a base do site e garantir domínio + deploy.</li>
              <li>Definir estrutura de pastas e componentes.</li>
              <li>Preparar o layout para receber as próximas funcionalidades.</li>
            </ul>
          </div>

          <div style={{marginTop: 24, display: 'flex', gap: 12}}>
            <CTAButton href="/">Voltar ao início</CTAButton>
            <CTAButton href="/contato" variant="ghost">Fale com a gente</CTAButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
