export default function Header() {
  const link = (href, label, active=false) => (
    <a className={`nav-link${active ? ' active':''}`} href={href}>{label}</a>
  );

  return (
    <header className="site-header">
      <nav className="nav">
        <div className="brand">RadarCrypto.space</div>
        <div className="nav-links">
          {link('/', 'Início', true)}
          {link('/sobre', 'Sobre')}
          {link('/contato', 'Contato')}
        </div>
      </nav>
    </header>
  );
}
