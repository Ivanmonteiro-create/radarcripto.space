// app/planos/page.jsx
import Link from "next/link";

export const metadata = {
  title: "Planos — RadarCrypto.space",
  description: "Compare os planos e escolha o melhor para você.",
};

export default function PlanosPage() {
  return (
    <main className="planos-wrap">
      <header className="planos-head">
        <h1>Planos</h1>
        <Link href="/" className="back-btn" aria-label="Voltar ao Início">
          Voltar ao Início
        </Link>
      </header>

      <p className="lead">
        Escolha um plano para estudar, praticar e evoluir com nosso simulador.
      </p>

      <section className="grid">
        {/* Free */}
        <article className="card">
          <h2>Gratuito</h2>
          <p className="price">R$ 0/mês</p>
          <ul className="feat">
            <li>Simulador com dados ao vivo (BTC, ETH, etc.)</li>
            <li>Histórico local no navegador</li>
            <li>Indicadores básicos (RSI, MACD, MME, BB)</li>
            <li>Suporte comunitário</li>
          </ul>
          <Link href="/simulador" className="cta">
            Começar agora
          </Link>
        </article>

        {/* Pro */}
        <article className="card card--pro">
          <div className="badge">Mais popular</div>
          <h2>Pro</h2>
          <p className="price">R$ 29/mês</p>
          <ul className="feat">
            <li>Todas as moedas e intervalos extras</li>
            <li>Backtests locais e exportação</li>
            <li>Alertas e metas de estudo</li>
            <li>Suporte prioritário</li>
          </ul>
          <Link href="/simulador" className="cta">
            Assinar Pro
          </Link>
        </article>

        {/* Expert */}
        <article className="card">
          <h2>Expert</h2>
          <p className="price">R$ 79/mês</p>
          <ul className="feat">
            <li>Tudo do Pro + cenários avançados</li>
            <li>Salas privadas e relatórios</li>
            <li>Mentorias em grupo</li>
            <li>Atendimento dedicado</li>
          </ul>
          <Link href="/simulador" className="cta">
            Ficar Expert
          </Link>
        </article>
      </section>

      <style jsx>{`
        .planos-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 20px 64px;
        }
        .planos-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 8px;
        }
        h1 {
          font-size: 28px;
          color: #eaf2ff;
        }
        .back-btn {
          background: #18c964;
          color: #07131b;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 999px;
          font-weight: 800;
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 10px 24px rgba(24, 201, 100, 0.25);
          transition: transform 0.12s ease, filter 0.12s ease;
          white-space: nowrap;
        }
        .back-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        .lead {
          color: #bcd0ff;
          margin: 4px 0 24px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }
        .card {
          background: rgba(10, 18, 28, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .card--pro {
          outline: 2px solid rgba(24, 201, 100, 0.45);
          background: rgba(10, 24, 18, 0.75);
        }
        .badge {
          align-self: flex-start;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #18c964;
          color: #07131b;
          font-weight: 800;
          margin-bottom: 4px;
        }
        h2 {
          color: #eaf2ff;
          margin: 0;
        }
        .price {
          color: #9ed7b7;
          font-weight: 800;
          margin: 0 0 8px;
        }
        .feat {
          color: #c9d7ff;
          margin: 0 0 12px;
          padding-left: 18px;
        }
        .feat li + li {
          margin-top: 6px;
        }
        .cta {
          margin-top: auto;
          align-self: flex-start;
          background: #18c964;
          color: #07131b;
          text-decoration: none;
          padding: 10px 14px;
          border-radius: 10px;
          font-weight: 800;
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 10px 24px rgba(24, 201, 100, 0.25);
          transition: transform 0.12s ease, filter 0.12s ease;
        }
        .cta:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
