// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';

const linkBase = {
  padding: '8px 12px',
  borderRadius: 8,
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,.12)',
  background: 'rgba(255,255,255,.04)',
  fontWeight: 600,
};

export default function Header() {
  const router = useRouter();
  const is = (path) => router.pathname === path;

  const navItem = (href, label) => (
    <Link href={href} style={{
      ...linkBase,
      borderColor: is(href) ? 'rgba(34,197,94,.6)' : 'rgba(255,255,255,.12)',
      background: is(href) ? 'rgba(34,197,94,.15)' : 'rgba(255,255,255,.04)',
      color: '#fff',
    }}>
      {label}
    </Link>
  );

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(7,13,23,.9)', backdropFilter: 'blur(6px)',
      borderBottom: '1px solid rgba(255,255,255,.08)',
    }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto',
        padding: '10px 16px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ fontWeight: 700, textDecoration: 'none', color: '#fff' }}>
          RadarCrypto.space
        </Link>
        <nav style={{ display: 'flex', gap: 8 }}>
          {navItem('/', 'Início')}
          {navItem('/sobre', 'Sobre')}
          {navItem('/contato', 'Contato')}
          {navItem('/simulador', 'Simulador')} {/* NOVO */}
        </nav>
      </div>
    </header>
  );
}
