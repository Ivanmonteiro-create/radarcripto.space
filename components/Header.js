// components/Header.js
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const isActive = (href) => router.pathname === href;

  const Link = ({ href, children }) => (
    <a className={`nav-link${isActive(href) ? ' active' : ''}`} href={href}>
      {children}
    </a>
  );

  return (
    <header className="site-header">
      <nav className="nav">
        <div className="brand">RadarCrypto.space</div>
        <div className="nav-links">
          <Link href="/">Início</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/contato">Contato</Link>
        </div>
      </nav>
    </header>
  );
}
