import CTAButton from '@components/CTAButton';

export default function Home() {
  const hero = {
    maxWidth: 880,
    margin: '48px auto',
    padding: '28px 28px',
    borderRadius: 16,
    background: 'rgba(17,24,39,.45)',
    border: '1px solid rgba(255,255,255,.08)',
    textAlign: 'center',
  };
  const kbd = {
    fontSize: 12, padding: '6px 10px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,.10)', background: 'rgba(255,255,255,.06)',
    display: 'inline-block', marginBottom: 10, letterSpacing: .6,
  };
  const h1 = { fontSize: 38, margin: '4px 0 10px', fontWeight: 800 };
  const sub = { opacity: .85, marginBottom: 14 };
  const row = { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' };

  return (
    <section style={hero}>
      <span style={kbd}>SIMULADOR DE TRADING</span>
      <h1 style={h1}>Treine trading sem risco</h1>
      <p style={sub}>Pratique estratégias e gestão de risco num ambiente didático.</p>
      <div style={row}>
        <CTAButton href="/simulador" variant="primary">Acessar simulador</CTAButton>
        <CTAButton href="mailto:radar@radarcrypto.space" variant="ghost">Fale com a gente</CTAButton>
      </div>
      <div style={{ marginTop: 12 }}>
        <span style={{ fontSize: 12, opacity: .8, padding: '6px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,.10)', background: 'rgba(255,255,255,.06)' }}>
          🛠 Em construção — Fase 1 (site base online)
        </span>
      </div>
    </section>
  );
}
