import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';

export default function Home() {
  return (
    <>
      <Header />
      <main className="container">
        <section className="hero">
          <span className="kicker">Simulador de Trading</span>
          <h1 className="title">RadarCrypto.space</h1>
          <p className="subtitle">Em construção — Fase 1 (site base online)</p>

          <span className="badge">🚧 Em construção</span>

          <div style={{marginTop:16, display:'flex', gap:12}}>
            <CTAButton href="#">Acessar simulador</CTAButton>
            <CTAButton href="/sobre" variant="ghost">Saiba mais</CTAButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
