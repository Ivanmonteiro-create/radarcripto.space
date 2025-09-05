// pages/sobre.js
import Link from "next/link";

export default function Sobre() {
  const shell = { maxWidth: 960, margin: "0 auto" };

  const card = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  };

  const btn = (bg) => ({
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 600,
    background: bg,
    border: "1px solid rgba(0,0,0,0.25)",
    boxShadow: "0 2px 0 rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.12)",
  });

  return (
    <section style={shell}>
      {/* ATENÇÃO: Não renderizamos Header aqui.
          A navbar já vem de _app.js — isso evita a barra duplicada. */}

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>O que é o RadarCrypto.space?</h1>
      <p style={{ opacity: 0.85 }}>
        Um simulador de trading pensado para estudo e prática, com foco em métricas claras e decisões objetivas.
        Esta é a Fase 1: site base online.
      </p>

      <div style={card}>
        <h2 style={{ fontSize: 18, marginBottom: 6, opacity: 0.9 }}>Objetivos desta fase</h2>
        <ul style={{ marginLeft: 18, opacity: 0.85 }}>
          <li>Publicar a base do site e garantir domínio + deploy.</li>
          <li>Definir estrutura de pastas e componentes.</li>
          <li>Preparar o layout para receber as próximas funcionalidades.</li>
        </ul>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Link href="/" legacyBehavior>
          <a style={btn("linear-gradient(180deg,#16a34a,#15803d)")}>Voltar ao início</a>
        </Link>
        <Link href="/contato" legacyBehavior>
          <a style={btn("rgba(255,255,255,0.06)")}>Fale com a gente</a>
        </Link>
      </div>
    </section>
  );
}
