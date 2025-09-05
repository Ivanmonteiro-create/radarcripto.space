// /components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  const bar = {
    background: "rgba(255,255,255,0.04)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  };

  const wrap = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const brand = {
    color: "#d1d5db",
    fontWeight: 700,
    letterSpacing: 0.3,
  };

  const leftLinks = {
    display: "flex",
    gap: 12,
    alignItems: "center",
  };

  const rightCTAs = {
    display: "flex",
    gap: 10,
    alignItems: "center",
  };

  const link = (active = false) => ({
    padding: "6px 10px",
    borderRadius: 8,
    border: active ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
    color: "#E5E7EB",
    textDecoration: "none",
    fontSize: 14,
  });

  const btnGreen = {
    textDecoration: "none",
    fontSize: 14,
    padding: "8px 12px",
    borderRadius: 10,
    background: "#16a34a",
    color: "#fff",
    fontWeight: 600,
    border: "1px solid rgba(0,0,0,0.2)",
  };

  const btnGhost = {
    textDecoration: "none",
    fontSize: 14,
    padding: "8px 12px",
    borderRadius: 10,
    background: "transparent",
    color: "#E5E7EB",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.18)",
  };

  return (
    <nav style={bar}>
      <div style={wrap}>
        <Link href="/" style={brand}>RadarCrypto.space</Link>

        <div style={leftLinks}>
          <Link href="/" style={link(true)}>Início</Link>
          <Link href="/sobre" style={link(false)}>Sobre</Link>
        </div>

        <div style={rightCTAs}>
          <Link href="/simulador" style={btnGreen}>Acessar simulador</Link>
          <Link href="/contato" style={btnGhost}>Fale com a gente</Link>
        </div>
      </div>
    </nav>
  );
}
