// /pages/index.js
import Link from "next/link";

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
            margin: "0 0 8px 0",
            color: "#ffffff",
            fontWeight: 800,
          }}
        >
          Treine trading sem risco
        </h1>

        <p style={{ opacity: 0.85, marginBottom: 18 }}>
          Pratique estratégias e gestão de risco num ambiente didático.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/simulador"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "#16a34a",
              color: "#08130a",
              fontWeight: 800,
            }}
          >
            Acessar simulador
          </Link>

          <Link
            href="/contato"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Fale com a gente
          </Link>
        </div>

        <div
          style={{
            marginTop: 14,
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
