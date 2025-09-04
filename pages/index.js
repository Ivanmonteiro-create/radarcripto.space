export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12,
      padding: 24,
      background: 'linear-gradient(180deg,#0b1220,#0f1b31)',
      color: '#e6f0ff',
      textAlign: 'center',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif'
    }}>
      <div style={{
        fontSize: 16,
        padding: '6px 12px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)'
      }}>
        🚧 Em construção
      </div>
      <h1 style={{ fontSize: 36, margin: 0 }}>RadarCripto.space</h1>
      <p style={{ opacity: 0.9, margin: 0 }}>
        Simulador de trading — fase 1 (site base online)
      </p>
    </main>
  );
}
