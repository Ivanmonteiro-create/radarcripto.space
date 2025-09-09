import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RadarCripto.space",
  description: "Simulador de trading em tempo real",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        {/* Cabeçalho / Menu */}
        <header className="site-header">
          <nav>
            <a href="/">Início</a>
            <a href="/sobre">Sobre</a>
            <a href="/planos">Planos</a>
            <a href="/simulador">Acessar simulador</a>
            <a href="/contato">Fale com a gente</a>
          </nav>
        </header>

        {/* Conteúdo da página */}
        {children}

        {/* Estilo global injetado */}
        <style jsx global>{`
          header nav a,
          .site-header nav a,
          nav.main a {
            font-size: 16.5px;
            line-height: 1;
            font-weight: 700;
            letter-spacing: 0.2px;
            padding: 10px 14px;
            border-radius: 10px;
            text-decoration: none;
            transition: transform 0.15s ease, box-shadow 0.15s ease,
              background-color 0.15s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          /* Links normais */
          header nav a:not([href*="/planos"]):not([href*="/simulador"]),
          .site-header nav a:not([href*="/planos"]):not([href*="/simulador"]),
          nav.main a:not([href*="/planos"]):not([href*="/simulador"]) {
            color: #cfe3ff;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          header nav a:not([href*="/planos"]):not([href*="/simulador"]):hover,
          .site-header
            nav
            a:not([href*="/planos"]):not([href*="/simulador"]):hover,
          nav.main a:not([href*="/planos"]):not([href*="/simulador"]):hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
          }

          /* Destaques verdes: Planos + Acessar simulador */
          header nav a[href*="/planos"],
          .site-header nav a[href*="/planos"],
          nav.main a[href*="/planos"],
          header nav a[href*="/simulador"],
          .site-header nav a[href*="/simulador"],
          nav.main a[href*="/simulador"] {
            font-size: 18px !important;
            padding: 12px 18px !important;
            color: #041e11 !important;
            background: #1fe15f !important;
            border: 1px solid #11b84a !important;
            border-radius: 14px !important;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25),
              0 8px 22px rgba(31, 225, 95, 0.28) !important;
          }

          header nav a[href*="/planos"]:hover,
          .site-header nav a[href*="/planos"]:hover,
          nav.main a[href*="/planos"]:hover,
          header nav a[href*="/simulador"]:hover,
          .site-header nav a[href*="/simulador"]:hover,
          nav.main a[href*="/simulador"]:hover {
            background: #19cc55 !important;
            border-color: #10a945 !important;
            transform: translateY(-1.5px);
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3),
              0 12px 26px rgba(31, 225, 95, 0.35) !important;
          }
        `}</style>
      </body>
    </html>
  );
}
