// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  return (
    <header className="rcs-nav">
      <div className="rcs-nav__inner">
        <Link href="/" className="rcs-brand">
          <span>RadarCrypto.space</span>
        </Link>

        <nav className="rcs-links">
          <Link
            href="/"
            className={`rcs-link ${isActive("/") ? "is-active" : ""}`}
          >
            Início
          </Link>

          <Link
            href="/sobre"
            className={`rcs-link ${isActive("/sobre") ? "is-active" : ""}`}
          >
            Sobre
          </Link>

          {/* NOVO: botão Planos (chamativo) */}
          <Link
            href="/planos"
            className="rcs-btn rcs-btn--accent"
            aria-label="Ver planos"
          >
            Planos
          </Link>

          <Link
            href="/simulador"
            className="rcs-btn rcs-btn--primary"
            aria-label="Acessar simulador"
          >
            Acessar simulador
          </Link>

          <Link
            href="/contato"
            className={`rcs-link ${isActive("/contato") ? "is-active" : ""}`}
          >
            Fale com a gente
          </Link>
        </nav>
      </div>

      {/* Estilos isolados para não mexer em nada do restante do site */}
      <style jsx>{`
        .rcs-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: saturate(120%) blur(6px);
          background: rgba(10, 18, 28, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .rcs-nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rcs-brand {
          font-weight: 700;
          letter-spacing: 0.2px;
          color: #e8f0ff;
          text-decoration: none;
        }
        .rcs-links {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .rcs-link {
          padding: 8px 12px;
          color: #cad6ff;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.15s ease;
        }
        .rcs-link:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
        }
        .rcs-link.is-active {
          color: #fff;
          background: rgba(255, 255, 255, 0.09);
        }
        .rcs-btn {
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          transition: transform 0.12s ease, box-shadow 0.12s ease,
            filter 0.12s ease;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .rcs-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        /* Botão existente “Acessar simulador” (mantido) */
        .rcs-btn--primary {
          background: #18c964; /* verde vivo já usado no site */
          color: #08131c;
          border-color: rgba(0, 0, 0, 0.08);
        }
        /* NOVO: “Planos” atraente, com destaque diferente */
        .rcs-btn--accent {
          background: linear-gradient(135deg, #00e0ff, #4effa1);
          color: #08131c;
          border-color: rgba(0, 0, 0, 0.08);
        }
        @media (max-width: 820px) {
          .rcs-links {
            gap: 8px;
          }
          .rcs-btn {
            padding: 9px 12px;
          }
          .rcs-link {
            padding: 6px 8px;
          }
        }
      `}</style>
    </header>
  );
}
