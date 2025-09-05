// pages/index.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from "@/components/CTAButton";
export default function Home() {
  return (
    <>
      <Header />

      <main className="container" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, margin: '8px 0' }}>RadarCrypto.space</h1>
          <p style={{ fontSize: 18, marginBottom: 12 }}>Simulador de Trading</p>

          <div style={{
            display: 'inline-block',
            padding: '8px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            marginBottom: 10
          }}>
            🛠️ Em construção 🛠️
          </div>

          <p style={{ opacity: 0.85 }}>RadarCrypto.space — Fase 1 (site base online)</p>
        </div>
      </main>

      <Footer />
    </>
  );
}
