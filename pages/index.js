// pages/index.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';

const MAILTO =
  'mailto:contato@radarcripto.space?subject=Contato%20via%20RadarCrypto.space';

export default function Home() {
  return (
    <>
      <Header />

      <main style={{ padding: '32px 16px' }}>
        <section
          style={{
            maxWidth: 960,
            margin: '40px auto 64px',
            padding: '32px 24px',
            borderRadius: 16,
            background:
              'radial-gradient(1200px 600px at 50% -200px, rgba(255,255,255,.06), rgba(0,0,0,0))',
            border: '1px solid rgba(255,255,255,.08)',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.7,
            }}
          >
            Simulador de Trading
          </span>

          <h1
            style={{
              fontSize: 44,
              lineHeight: 1.16,
              margin: '12px 0 0',
              fontWeight: 800,
            }}
          >
            RadarCrypto.space
          </h1>

          <p style={{ marginTop: 14, opacity: 0.85 }}>
            Em construção — Fase 1 (site base online)
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              padding: '6px 10px',
              borderRadius: 999,
              fontSize: 12,
              border: '1px solid rgba(255,255,255,.14)',
              background: 'rgba(0,0,0,.24)',
            }}
          >
            <span role="img" aria-label="construction">🛠️</span>
            Em construção
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
            {/* quando /simulador existir, este botão já estará correto */}
            <CTAButton href="/simulador">Acessar simulador</CTAButton>
            {/* AGORA abre o e-mail direto (não /contato) */}
            <CTAButton href={MAILTO} variant="ghost">
              Fale com a gente
            </CTAButton>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
