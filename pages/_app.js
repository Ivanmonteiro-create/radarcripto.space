import '@/styles/globals.css';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

export default function App({ Component, pageProps }) {
  const shell = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg,#0f1723 0%, #0a1320 100%)',
    color: '#e6eef5',
  };

  return (
    <div style={shell}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
