// components/Header.js
import Link from "next/link";
import Navbar from "@components/Navbar";

export default function Header({ showNav = true }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "saturate(120%) blur(6px)",
        background: "rgba(7,16,26,.75)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link href="/" legacyBehavior>
          <a
            aria-label="Voltar ao início"
            style={{
              fontWeight: 700,
              letterSpacing: ".2px",
              opacity: .9,
            }}
          >
            RadarCrypto.space
          </a>
        </Link>

        {showNav ? <Navbar /> : null}
      </div>
    </header>
  );
}
