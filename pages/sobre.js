// pages/sobre.js
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Sobre() {
  return (
    <>
      <Header />
      <main className="container" style={{ minHeight: '60vh' }}>
        <h1>Sobre</h1>
        <p style={{ opacity: 0.85 }}>
          Este é o projeto RadarCrypto.space — um simulador de trading (fase 1).
        </p>
      </main>
      <Footer />
    </>
  );
}
