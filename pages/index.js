import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0f0f0f, #1a1a1a)",
      color: "#fff",
      fontFamily: "Arial, sans-serif"
    }}>
      <Header />

      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px"
      }}>
        <div>
          <h2>🚧 Em construção 🚧</h2>
          <p>RadarCripto.space — Fase 1 (site base online)</p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
