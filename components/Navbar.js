// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  const pill = {
    padding: "6px 10px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  };

  const cta = (bg) => ({
    padding: "8px 12px",
    borderRadius: 10,
    fontWeight: 600,
    background: bg,
    border: "1px solid rgba(0,0,0,0.25)",
    boxShadow: "0 2px 0 rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.15)",
  });

  return (
    <nav aria-label="Navegação principal" style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Link href="/" legacyBehavior><a style={pill}>Início</a></Link>
      <Link href="/sobre" legacyBehavior><a style={pill}>Sobre</a></Link>

      <div style={{ width: 12 }} />

      <Link href="/simulador" legacyBehavior>
        <a style={cta("linear-gradient(180deg,#16a34a,#15803d)")}>Acessar simulador</a>
      </Link>

      <a
        href="mailto:contato@radarcrypto.space?subject=[RadarCrypto]%20Falar%20com%20a%20equipe&body=Olá%2C%20quero%20falar%20sobre..."
        style={cta("rgba(255,255,255,0.06)")}
      >
        Fale com a gente
      </a>
    </nav>
  );
}
