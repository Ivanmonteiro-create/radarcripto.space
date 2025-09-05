// pages/sobre.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';
import Link from 'next/link';

const MAILTO =
  'mailto:contato@radarcripto.space?subject=Contato%20via%20RadarCrypto.space';

export default function Sobre() {
  return (
    <>
      <Header />
      <main style={{ padding: '32px 16px' }}>
        <section
          style={{
            maxWidth: 960,
            margin: '16px auto 64px',
            padding: '32px 24px',
            borderRadius: 16,
            background:
              'radial-gradient(1200px 600px at 50% -200px, rgba(255,255,255,.06), rgba(0,0,0,0))',
            border: '1px solid rgba(255,255,255,.08)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28 }}>
            O que é o RadarCrypto.space?
          </h2>
          <p style={{ opacity: 0.9, marginTop: 12 }}>
            Um simulador de trading pensado para estudo e prática, com foco em
            métricas claras e decisões objetivas. Esta é a Fase 1: site base
            online.
          </p>

          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,.08)',
              background: 'rgba(0,0,0,.2)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Objetivos desta fase</h3>
            <ul style={{ margin: '8px 0 0 18px', lineHeight: 1.7 }}>
              <li>Publicar a base do site e garantir domínio + deploy.</li>
              <li>Definir estrutura de pastas e componentes.</li>
              <li>Preparar o layout para receber as próximas funcionalidades.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <CTAButton variant="solid">Voltar ao início</CTAButton>
            </Link>

            {/* AGORA abre e-mail direto */}
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
