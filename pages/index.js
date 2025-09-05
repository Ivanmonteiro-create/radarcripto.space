// pages/index.js
export default function Home() {
  const shell = {
    maxWidth: 960,
    margin: "0 auto",
  };

  const hero = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "28px 22px",
  };

  const badge = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: 12,
    letterSpacing: ".12em",
  };

  const title = {
    fontSize: 42,
    lineHeight: 1.1,
    margin: "10px 0 8px 0",
    // destaque chamativo:
    color: "#22c55e", // verde neon
    textShadow: "0 0 24px rgba(34,197,94,.35)",
  };

  const sub = { opacity: 0.85, marginBottom: 10 };

  return (
    <section style={shell}>
      <div style={hero}>
        <div style={badge}>SIMULADOR DE TRADING</div>
        <h1 style={title}>RadarCrypto.space</h1>
        <p style={sub}>Em construção — Fase 1 (site base online)</p>

        {/* Mantemos apenas o selo de status. 
            Os CTAs foram removidos do herói como solicitado,
            pois já existem na navbar. */}
        <div
          style={{
            display: "inline-flex",
            gap: 8,
            alignItems: "center",
            marginTop: 6,
            padding: "6px 10px",
            borderRadius: 10,
            background: "rgba(0,0,0,.25)",
            border: "1px solid rgba(255,255,255,.1)",
            fontSize: 12,
          }}
        >
          <span style={{ opacity: 0.9 }}>🛠️ Em construção</span>
        </div>
      </div>
    </section>
  );
}
