export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="container" style={{padding: "24px 16px", textAlign: "center", opacity: .85, fontSize: 14}}>
        © {new Date().getFullYear()} RadarCrypto.space — Todos os direitos reservados
      </div>
    </footer>
  );
}
