// components/Navbar.js
import Link from "next/link";
import styles from "@styles/globals.module.css";

export default function Navbar() {
  return (
    <nav
      aria-label="Navegação principal"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Itens básicos */}
      <Link href="/" legacyBehavior>
        <a
          className={styles.navItem}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Início
        </a>
      </Link>

      <Link href="/sobre" legacyBehavior>
        <a
          className={styles.navItem}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Sobre
        </a>
      </Link>

      {/* separador pequeno, só p/ respiração */}
      <div style={{ width: 8 }} />

      {/* CTAs em destaque (ficam próximos) */}
      <Link href="/simulador" legacyBehavior>
        <a
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            fontWeight: 600,
            background: "linear-gradient(180deg,#16a34a,#15803d)",
            border: "1px solid rgba(0,0,0,0.25)",
            boxShadow: "0 2px 0 rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.15)",
          }}
        >
          Acessar simulador
        </a>
      </Link>

      <a
        href="mailto:contato@radarcrypto.space?subject=[RadarCrypto] Falar com a equipe&body=Olá%2C%20quero%20falar%20sobre..."
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          fontWeight: 600,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        Fale com a gente
      </a>
    </nav>
  );
}
