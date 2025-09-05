import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function NavLink({ href, children, onClick }) {
  const router = useRouter();
  const isActive = router.pathname === href;
  return (
    <Link href={href} legacyBehavior>
      <a className={`nav-link ${isActive ? "active" : ""}`} onClick={onClick}>
        {children}
      </a>
    </Link>
  );
}

export default function Header() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // fecha o menu ao trocar de rota
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  // muda estilo ao rolar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <div className="brand">
          <Link href="/" legacyBehavior>
            <a>RadarCrypto.space</a>
          </Link>
        </div>

        <button
          className={`menu-toggle ${open ? "open" : ""}`}
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? "open" : ""}`}>
          <NavLink href="/">Início</NavLink>
          <NavLink href="/sobre">Sobre</NavLink>
          <NavLink href="/contato">Contato</NavLink>
        </nav>
      </div>
    </header>
  );
}
