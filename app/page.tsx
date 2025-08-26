// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Bem-vindo ao RadarCripto.space</h1>
      <ul>
        <li><Link href="/simulador">Ir para o Simulador</Link></li>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/planos">Planos</Link></li>
      </ul>
    </main>
  );
}
