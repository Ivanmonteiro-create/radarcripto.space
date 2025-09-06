// /pages/index.js
export default function Home() {
  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <section
        style={{
          margin: "24px auto",
          maxWidth: 720,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "#cfe5ff",
            fontSize: 12,
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          SIMULADOR DE TRADING
        </div>

        <h1
          style={{
            fontSize: 36,
            lineHeight: 1.2,
            margin: "0 0 10px 0",
            color: "#ffffff",
            fontWeight: 800,
          }}
        >
          Aprenda de verdade sem perder nada.
        </h1>

        <p
          style={{
            fontSize: 20,
            lineHeight: 1.5,
            margin: "8px 0 16px 0",
            color: "#d4ffe1",
            fontWeight: 700,
            textShadow: "0 0 12px rgba(22,163,74,0.25)",
          }}
        >
          Um simulador prático para testar estratégias e evoluir{" "}
          <span style={{ color: "#16a34a" }}>sem risco</span>.
        </p>

        {/* selo de status */}
        <div
          style={{
            marginTop: 6,
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            fontSize: 12,
            opacity: 0.85,
          }}
        >
          🚧 Em construção — Fase 1 (site base online)
        </div>
      </section>
    </main>
  );
}
