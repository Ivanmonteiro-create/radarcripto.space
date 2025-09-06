// /pages/sobre.js
import Link from "next/link";

export default function Sobre() {
  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <section
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          O que é o RadarCrypto.space?
        </h1>

        <p style={{ opacity: 0.9, marginBottom: 16 }}>
          Um simulador de trading pensado para estudo e prática, com foco em
          métricas claras e decisões objetivas. Esta é a Fase 1: site base online.
        </p>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <strong>Objetivos desta fase</strong>
          <ul style={{ marginTop: 8, opacity: 0.9 }}>
            <li>Publicar a base do site e garantir domínio + deploy.</li>
            <li>Definir estrutura de pastas e componentes.</li>
            <li>Preparar o layout para receber as próximas funcionalidades.</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "#16a34a",
              color: "#08130a",
              fontWeight: 800,
            }}
          >
            Voltar ao início
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
      </section>
    </main>
  );
}
