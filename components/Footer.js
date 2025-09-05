export default function Footer() {
  return (
    <footer style={{
      background: "#111",
      color: "#aaa",
      padding: "10px",
      textAlign: "center",
      marginTop: "20px",
      fontSize: "14px"
    }}>
      <p>© {new Date().getFullYear()} RadarCripto.space — Todos os direitos reservados</p>
    </footer>
  )
}
