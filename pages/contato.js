// pages/contato.js
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contato() {
  return (
    <>
      <Header />
      <main className="container" style={{ minHeight: '60vh' }}>
        <h1>Contato</h1>
        <p style={{ opacity: 0.85 }}>
          Em breve: formulário ou e-mail de contato.
        </p>
      </main>
      <Footer />
    </>
  );
}
