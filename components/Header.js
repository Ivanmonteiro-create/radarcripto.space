// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const links = [
    { href: '/', label: 'Início' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contato' },
  ];

  const isActive = (href) => router.pathname === href;

  const headerStyle = {
    background: 'rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    position: 'sticky',
    top: 0,
    backdropFilter: 'blur(8px)',
  };

  const navStyle = { display: 'flex', gap: 16, alignItems: 'center' };
  const brandStyle = { fontWeight: 700, fontSize: 20, marginRight: 24 };

  return (
    <header style={headerStyle}>
      <div className="container" style={{display: 'flex', alignItems:'center', justifyContent:'space-between'}}>
        <Link href="/" style={brandStyle}>RadarCrypto.space</Link>

        <nav style={navStyle}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: isActive(l.href) ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
                background: isActive(l.href) ? 'rgba(255,255,255,0.08)' : 'transparent',
                fontWeight: isActive(l.href) ? 600 : 500
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
