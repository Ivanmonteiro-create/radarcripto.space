// /components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(8px)",
        background: "rgba(13,18,28,0.7)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          gap: 12,
        }}
      >
        <Link href="/" style={{ fontWeight: 700, color: "#cfe5ff" }}>
          RadarCrypto.space
        </Link>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link
            href="/"
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 14,
            }}
          >
            Início
          </Link>

          <Link
            href="/sobre"
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 14,
            }}
          >
            Sobre
          </Link>

          <Link
            href="/simulador"
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              background: "#16a34a",
              color: "#08130a",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Acessar simulador
          </Link>

          <Link
            href="/contato"
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              color: "#fff",
              fontSize: 14,
            }}
          >
            Fale com a gente
          </Link>
        </div>
      </div>
    </nav>
  );
}
