// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="nav__brand">
        <Link href="/" className="brand">RadarCrypto.space</Link>
      </div>

      <ul className="nav__links">
        <li><Link href="/" className="link">Início</Link></li>
        <li><Link href="/sobre" className="link">Sobre</Link></li>

        {/* Destaques em verde */}
        <li>
          <Link href="/planos" className="link link--primary" aria-label="Ver Planos">
            Planos
          </Link>
        </li>
        <li>
          <Link href="/simulador" className="link link--primary" aria-label="Acessar simulador">
            Acessar simulador
          </Link>
        </li>

        <li><Link href="/contato" className="link">Fale com a gente</Link></li>
      </ul>

      <style jsx>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 18px;
          background: rgba(5, 12, 18, 0.7);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .nav__brand .brand {
          color: #cfe4ff;
          font-weight: 800;
          text-decoration: none;
          letter-spacing: .2px;
        }
        .nav__links {
          display: flex;
          align-items: center;
          gap: 10px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          padding: 0 12px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 700;
          color: #9fb6d6;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(9, 18, 28, 0.35);
          transition: transform .12s ease, filter .12s ease, background .12s ease;
        }
        .link:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          background: rgba(14, 26, 38, 0.55);
        }

        /* Destaque verde (Planos e Acessar simulador) */
        .link--primary {
          color: #07131b;
          background: #18c964; /* verde vibrante */
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 10px 24px rgba(24, 201, 100, 0.28);
        }
        .link--primary:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        @media (max-width: 900px) {
          .nav { padding: 10px 12px; }
          .nav__links { gap: 8px; flex-wrap: wrap; }
          .link { height: 34px; padding: 0 10px; font-size: 14px; }
        }
      `}</style>
    </nav>
  );
}
