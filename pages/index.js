// /pages/index.js
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";

export default function Home() {
  const page = {
    minHeight: "100vh",
    background: "linear-gradient(180deg,#0f172a 0%, #0b1222 100%)",
    color: "#E5E7EB",
    display: "flex",
    flexDirection: "column",
  };

  const main = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
  };

  const card = {
    width: "100%",
    maxWidth: 900,
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "28px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const tag = {
    display: "inline-block",
    fontSize: 12,
    letterSpacing: 1.5,
    color: "#9CA3AF",
    marginBottom: 16,
  };

  const title = {
    margin: "0 0 10px 0",
    fontSize: 42,
    color: "#fff",
    textAlign: "center",
  };

  const subtitle = {
    margin: "0 0 14px 0",
    textAlign: "center",
    color: "#cbd5e1",
  };

  const status = {
    display: "inline-block",
    margin: "0 auto 6px",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(148,163,184,0.12)",
    border: "1px solid rgba(148,163,184,0.25)",
    color: "#cbd5e1",
    fontSize: 12,
  };

  return (
    <div style={page}>
      <Navbar />

      <main style={main}>
        <div style={card}>
          <div style={{ textAlign: "center" }}>
            <span style={tag}>SIMULADOR DE TRADING</span>
            <h1 style={title}>RadarCrypto.space</h1>
            <p style={subtitle}>Em construção — Fase 1 (site base online)</p>
            <div style={status}>🚧 Em construção</div>
          </div>

          {/* espaço reservado para o visual/hero da home na próxima etapa */}
          <div style={{ height: 16 }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
