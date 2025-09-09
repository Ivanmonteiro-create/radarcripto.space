// /app/layout.js
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'RadarCrypto.space',
  description: 'Simulador de trading cripto — aprenda sem risco.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Navbar simples (Server Component) */}
        <header className="rc-nav">
          <nav className="rc-nav__inner">
            <ul className="rc-nav__list">
              <li><Link className="rc-link" href="/">Início</Link></li>
              <li><Link className="rc-link" href="/sobre">Sobre</Link></li>
              {/* Destaques em verde: Planos e Acessar simulador */}
              <li><Link className="rc-link rc-link--cta" href="/planos">Planos</Link></li>
              <li><Link className="rc-link rc-link--cta" href="/simulador">Acessar simulador</Link></li>
              <li><Link className="rc-link" href="/contato">Fale com a gente</Link></li>
            </ul>
          </nav>
        </header>

        <main className="rc-main">{children}</main>
      </body>
    </html>
  );
}
