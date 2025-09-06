// /pages/index.js
import HeroBackground from "../components/HeroBackground";

export default function Home() {
  return (
    <main style={{ maxWidth: 1200, margin: "24px auto 0", padding: "0 16px" }}>
      {/* HERO: mantém o mesmo tamanho/estilo atual */}
      <section
        style={{
          position: "relative",
          margin: "16px auto 10px",
          maxWidth: 1080,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 20,
          padding: "48px 36px 42px",
          textAlign: "center",
          overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,0,0,0.30)",
        }}
      >
        <HeroBackground /> {/* fundo sutil + linha animada */}

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
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
              fontSize: 46,
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
              fontSize: 20,
              lineHeight: 1.6,
              margin: "10px 0 22px 0",
              color: "#e6eef8",
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
              background: "rgba(255,255,255,0.05)",
              fontSize: 12,
              color: "#dbeafe",
              opacity: 0.95,
            }}
          >
            🚧 Em construção — Fase 1 (site base online)
          </div>
        </div>
      </section>

      {/* TICKERS: de volta, abaixo do card, sem alterar o tamanho do herói */}
      <Tickers />
    </main>
  );
}

function Badge({ text }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "#e2eeff",
        padding: "7px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
        whiteSpace: "nowrap",
        fontWeight: 600,
      }}
    >
      {text}
    </span>
  );
}

/** Barra de moedas simples (mock) — podemos ligar a dados reais depois */
function Tickers() {
  const data = [
    { pair: "BTC/USDT", price: "$60,245.25", change: -0.85 },
    { pair: "ETH/USDT", price: "$2,448.57", change: -0.45 },
    { pair: "SOL/USDT", price: "$141.91", change: -0.05 },
    { pair: "BNB/USDT", price: "$561.37", change: 0.65 },
    { pair: "ADA/USDT", price: "$0.45", change: 0.45 },
  ];

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "10px auto 0",
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {data.map((d) => (
        <div
          key={d.pair}
          style={{
            minWidth: 190,
            padding: "10px 14px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "baseline",
            gap: 10,
          }}
        >
          <strong style={{ color: "#e6eef8", fontSize: 13 }}>{d.pair}</strong>
          <span style={{ color: "#cfe5ff", fontWeight: 700 }}>{d.price}</span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              fontWeight: 800,
              color: d.change >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {d.change >= 0 ? "▲" : "▼"} {Math.abs(d.change).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
