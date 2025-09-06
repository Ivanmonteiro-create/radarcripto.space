import Link from "next/link";

export default function Sobre() {
  return (
    <main className="sobre">
      <section className="card">
        <h1>O que é o <span className="brand">RadarCrypto.space</span>?</h1>

        <p className="lead">
          Um simulador de trading pensado para <strong>estudo e prática</strong>,
          com foco em <strong>métricas claras</strong> e <strong>decisões objetivas</strong>.
          Esta é a <strong>Fase 1</strong>: site base online.
        </p>

        <div className="divider" />

        <h2>Objetivos desta fase</h2>
        <ul className="bullets">
          <li>Publicar a base do site e garantir domínio + deploy.</li>
          <li>Definir estrutura de pastas e componentes.</li>
          <li>Preparar o layout para receber as próximas funcionalidades.</li>
        </ul>

        <div className="actions">
          <Link href="/" className="btn btn-green">Voltar ao início</Link>
          {/* Botão “Fale com a gente” removido conforme pedido */}
        </div>
      </section>

      <style jsx>{`
        .sobre {
          min-height: 100vh;
          padding: 72px 16px 96px;
          display: grid;
          place-items: start center;
          background: radial-gradient(1200px 600px at 50% -10%, rgba(0, 255, 200, 0.08), transparent 60%),
                      radial-gradient(900px 600px at 10% 110%, rgba(0, 180, 255, 0.06), transparent 60%),
                      #0e1525;
          color: #e6edf3;
        }
        .card {
          width: min(980px, 100%);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.05);
          border-radius: 18px;
          padding: 28px;
        }
        h1 {
          margin: 0 0 6px;
          font-size: clamp(28px, 4.2vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: #e6f6ff;
        }
        .brand {
          background: linear-gradient(90deg, #34d399, #22d3ee);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }
        .lead {
          margin: 8px 0 20px;
          color: #b8c2cc;
          font-size: 16px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          margin: 18px 0 14px;
        }
        h2 {
          margin: 0 0 10px;
          font-size: 18px;
          color: #cfe7ff;
        }
        .bullets {
          margin: 0 0 18px;
          padding-left: 18px;
          color: #c1c9d2;
        }
        .bullets li { margin: 6px 0; }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 14px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
          border: 1px solid rgba(255,255,255,0.12);
          color: #e6edf3;
          background: rgba(255,255,255,0.04);
        }
        .btn:hover { transform: translateY(-1px); }
        .btn-green {
          background: linear-gradient(180deg, #34d399, #10b981);
          border-color: rgba(0,0,0,0.2);
          color: #04140f;
          text-shadow: 0 1px 0 rgba(255,255,255,0.3);
          box-shadow: 0 6px 18px rgba(16,185,129,0.35);
        }
        .btn-green:hover { filter: brightness(1.05); }
        @media (max-width: 640px) {
          .card { padding: 20px; }
        }
      `}</style>
    </main>
  );
}
