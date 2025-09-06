// /pages/index.js
import HeroBackground from "../components/HeroBackground";
import MarketTicker from "../components/MarketTicker";

export default function Home() {
  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      {/* HERO */}
      <section
        style={{
          position: "relative",
          margin: "24px auto",
          maxWidth: 820,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "28px 20px 24px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <HeroBackground />

        <div
          style={{
            position: "relative",
            zIndex: 1,
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

          {/* Título com gradiente */}
          <h1
            style={{
              fontSize: 36,
              lineHeight: 1.2,
              margin: "0 0 10px 0",
              fontWeight: 800,
              background: "linear-gradient(90deg, #16a34a, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Aprenda de verdade sem perder nada.
          </h1>

          <p
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              margin: "8px 0 16px 0",
              color: "#e2e8f0",
              fontWeight: 600,
            }}
          >
            Um simulador prático para testar estratégias e evoluir{" "}
            <span
              style={{
                fontWeight: 700,
                background: "linear-gradient(90deg, #16a34a, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              sem risco
            </span>.
          </p>

          {/* Faixa de destaques (pílulas) */}
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 12,
            }}
          >
            <Badge text="Conta demo — sem corretora" />
            <Badge text="Risco por trade configurável" />
            <Badge text="Histórico local no navegador" />
          </div>

          {/* Selo de status */}
          <div
            style={{
              marginTop: 16,
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              fontSize: 12,
              opacity: 0.9,
            }}
          >
            🚧 Em construção — Fase 1 (site base online)
          </div>
        </div>
      </section>

      {/* TICKER de mercado (na região inferior da página) */}
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
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}
