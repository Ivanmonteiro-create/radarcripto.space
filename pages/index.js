// /pages/index.js
import HeroBackground from "../components/HeroBackground";
import MarketTicker from "../components/MarketTicker";

export default function Home() {
  return (
    <main style={{ maxWidth: 1200, margin: "24px auto 0", padding: "0 16px" }}>
      {/* HERO – volta ao estilo anterior, porém MAIOR */}
      <section
        style={{
          position: "relative",
          margin: "16px auto 10px",
          maxWidth: 1080,                 // ↑ mais largo
          background: "rgba(255,255,255,0.035)", // volta ao look anterior (mais sutil)
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 20,
          padding: "48px 36px 42px",      // ↑ mais alto
          textAlign: "center",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)", // leve profundidade
        }}
      >
        <HeroBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.045)",
              color: "#cfe5ff",
              fontSize: 12,
              letterSpacing: 1,
              marginBottom: 14,
              fontWeight: 700,
            }}
          >
            SIMULADOR DE TRADING
          </div>

          <h1
            style={{
              fontSize: 48,                // ↑ título maior
              lineHeight: 1.12,
              margin: "0 0 14px 0",
              fontWeight: 900,
              background: "linear-gradient(90deg, #16a34a, #22c55e, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Aprenda de verdade sem perder nada.
          </h1>

          <p
            style={{
              fontSize: 22,
              lineHeight: 1.6,
              margin: "10px 0 22px 0",
              color: "#e2e8f0",
              fontWeight: 600,
              maxWidth: 860,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Um simulador prático para testar estratégias e evoluir{" "}
            <span
              style={{
                fontWeight: 800,
                background: "linear-gradient(90deg, #16a34a, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              sem risco
            </span>.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 6,
            }}
          >
            <Badge text="Conta demo — sem corretora" />
            <Badge text="Risco por trade configurável" />
            <Badge text="Histórico local no navegador" />
          </div>

          <div
            style={{
              marginTop: 20,
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.045)",
              fontSize: 12,
              color: "#dbeafe",
              opacity: 0.95,
            }}
          >
            🚧 Em construção — Fase 1 (site base online)
          </div>
        </div>
      </section>

      {/* Ticker encostando no rodapé */}
      <MarketTicker />
    </main>
  );
}

function Badge({ text }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "#dbeafe",
        padding: "7px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.045)",
        whiteSpace: "nowrap",
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );
}
