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
        <Link href="/" className="rcs-brand" aria-label="RadarCrypto.space">
          <span>RadarCrypto.space</span>
        </Link>

        <nav className="rcs-links">
          <Link
            href="/"
            className={`rcs-btn ${isActive("/") ? "is-active" : ""}`}
            aria-label="Ir para Início"
          >
            Início
          </Link>

          <Link
            href="/sobre"
            className={`rcs-btn ${isActive("/sobre") ? "is-active" : ""}`}
            aria-label="Ir para Sobre"
          >
            Sobre
          </Link>

          <Link
            href="/planos"
            className={`rcs-btn ${isActive("/planos") ? "is-active" : ""}`}
            aria-label="Ver Planos"
          >
            Planos
          </Link>

          <Link
            href="/simulador"
            className={`rcs-btn ${isActive("/simulador") ? "is-active" : ""}`}
            aria-label="Acessar simulador"
          >
            Acessar simulador
          </Link>

          <Link
            href="/contato"
            className={`rcs-btn ${isActive("/contato") ? "is-active" : ""}`}
            aria-label="Fale com a gente"
          >
            Fale com a gente
          </Link>
        </nav>
      </div>

      {/* estilos isolados via styled-jsx (não alteram o resto do site) */}
      <style jsx>{`
        .rcs-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: saturate(120%) blur(6px);
          background: rgba(8, 19, 28, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .rcs-nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .rcs-brand {
          font-weight: 800;
          letter-spacing: 0.2px;
          color: #e8f0ff;
          text-decoration: none;
        }
        .rcs-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        /* TODOS viram pílulas verdes chamativas */
        .rcs-btn {
          background: #18c964; /* verde forte */
          color: #07131b;
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 10px 14px;
          border-radius: 999px;
          font-weight: 700;
          text-decoration: none;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 24px rgba(24, 201, 100, 0.25);
          transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
          white-space: nowrap;
        }
        .rcs-btn:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow: 0 14px 28px rgba(24, 201, 100, 0.33);
        }
        .rcs-btn.is-active {
          outline: 2px solid rgba(24, 201, 100, 0.45);
        }

        @media (max-width: 820px) {
          .rcs-btn {
            padding: 9px 12px;
          }
        }
      `}</style>
    </header>
  );
}
