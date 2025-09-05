import Link from 'next/link';

export default function Navbar() {
  const bar = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '10px 16px',
    background: 'rgba(15,20,28,.85)',
    borderBottom: '1px solid rgba(255,255,255,.06)',
    backdropFilter: 'blur(6px)',
  };

  const brand = {
    fontWeight: 700,
    color: '#cfe9ff',
    letterSpacing: .2,
  };

  const row = { display: 'flex', gap: 8, alignItems: 'center' };

  const chip = (active) => ({
    padding: '6px 10px',
    borderRadius: 10,
    fontSize: 13,
    border: '1px solid rgba(255,255,255,.10)',
    background: active ? 'rgba(23, 178, 106, .25)' : 'rgba(255,255,255,.06)',
  });

  const cta = {
    padding: '8px 12px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: '#0b1a12',
    background: '#25d366',
    border: '1px solid rgba(37,211,102,.6)',
  };

  const ghost = {
    padding: '8px 12px',
    borderRadius: 10,
    fontSize: 13,
    border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(255,255,255,.06)',
    color: '#e6eef5',
  };

  return (
    <nav style={bar}>
      <div style={row}>
        <span style={brand}>RadarCrypto.space</span>
      </div>

      <div style={row}>
        <Link href="/"><span style={chip(false)}>Início</span></Link>
        <Link href="/sobre"><span style={chip(false)}>Sobre</span></Link>
        <Link href="/simulador"><button style={cta}>Acessar simulador</button></Link>
        <a href="mailto:radar@radarcrypto.space" style={ghost}>Fale com a gente</a>
      </div>
    </nav>
  );
}
