import CTAButton from '@components/CTAButton';
import Link from 'next/link';

export default function Sobre() {
  const card = {
    maxWidth: 880, margin: '36px auto', padding: 24, borderRadius: 16,
    background: 'rgba(17,24,39,.45)', border: '1px solid rgba(255,255,255,.08)',
  };
  const box = {
    padding: 16, borderRadius: 12, background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.08)', marginTop: 16,
  };
  const row = { display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' };

  return (
    <section style={card}>
      <h2 style={{ fontSize: 28, marginBottom: 6 }}>O que é o RadarCrypto.space?</h2>
      <p style={{ opacity: .9 }}>
        Um simulador de trading para estudo e prática, com foco em métricas claras e decisões objetivas.
        Esta é a Fase 1: site base online.
      </p>

      <div style={box}>
        <strong>Objetivos desta fase</strong>
        <ul style={{ marginTop: 8, lineHeight: 1.7 }}>
          <li>Publicar a base do site e garantir domínio + deploy.</li>
          <li>Definir estrutura de pastas e componentes.</li>
          <li>Preparar o layout para receber as próximas funcionalidades.</li>
        </ul>
      </div>

      <div style={row}>
        <Link href="/"><CTAButton variant="primary">Voltar ao início</CTAButton></Link>
        <CTAButton href="mailto:radar@radarcrypto.space" variant="ghost">Fale com a gente</CTAButton>
      </div>
    </section>
  );
}
