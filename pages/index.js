// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <section style={{ display: "grid", placeItems: "center", minHeight: "72vh" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          padding: "28px 24px",
          borderRadius: 14,
          background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.06)",
          textAlign: "center",
        }}
      >
        <div style={{ opacity: .75, fontSize: 12, letterSpacing: ".18em" }}>SIMULADOR DE TRADING</div>
        <h1 style={{ fontSize: 40, margin: "12px 0 4px" }}>RadarCrypto.space</h1>
        <p style={{ opacity: .85, marginBottom: 14 }}>Em construção — Fase 1 (site base online)</p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginTop: 6,
          }}
        >
          <Link href="/simulador" legacyBehavior>
            <a
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                fontWeight: 700,
                background: "linear-gradient(180deg,#16a34a,#15803d)",
                border: "1px solid rgba(0,0,0,.25)",
                boxShadow: "0 2px 0 rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.15)",
              }}
            >
              Acessar simulador
            </a>
          </Link>

          <a
            href="mailto:contato@radarcrypto.space?subject=[RadarCrypto] Falar%20com%20a%20equipe&body=Olá%2C%20quero%20falar%20sobre..."
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              fontWeight: 700,
              background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.15)",
            }}
          >
            Fale com a gente
          </a>
        </div>
      </div>
    </section>
  );
}
