// /pages/index.js
import HeroBackground from "../components/HeroBackground";
import MarketTicker from "../components/MarketTicker";

export default function Home() {
  return (
    <main style={{ maxWidth: 1180, margin: "24px auto 0", padding: "0 16px" }}>
      {/* HERO – maior e com menos espaço externo */}
      <section
        style={{
          position: "relative",
          margin: "12px auto 8px",
          maxWidth: 980,                // ↑ largura maior
          background: "rgba(255,255,255,0.045)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 18,
          padding: "40px 28px 34px",    // ↑ mais altura/área interna
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <HeroBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
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
              marginBottom: 12,
            }}
          >
            SIMULADOR DE TRADING
          </div>

          <h1
            style={{
              fontSize: 42,              // ↑ título maior
              lineHeight: 1.15,
              margin: "0 0 12px 0",
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
              fontSize: 22,
              lineHeight: 1.55,
              margin: "8px 0 18px 0",
              color: "#e2e8f0",
              fontWeight: 600,
              maxWidth: 820,
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
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 14,
            }}
          >
            <Badge text="Conta demo — sem corretora" />
            <Badge text="Risco por trade configurável" />
            <Badge text="Histórico local no navegador" />
          </div>

          <div
            style={{
              marginTop: 18,
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              fontSize: 12,
              opacity: 0.95,
            }}
          >
            🚧 Em construção — Fase 1 (site base online)
          </div>
        </div>
      </section>

      {/* TICKER – encosta melhor no rodapé (sem espaço sobrando) */}
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
