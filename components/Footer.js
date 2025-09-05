// components/Footer.js
export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.12)',
      marginTop: 32
    }}>
      <div className="container" style={{textAlign:'center', opacity: 0.7}}>
        © {new Date().getFullYear()} RadarCrypto.space — Todos os direitos reservados
      </div>
    </footer>
  );
}
