import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <ul className="flex gap-4">
        <li><Link href="/">Início</Link></li>
        <li><Link href="/sobre">Sobre</Link></li>
        <li><Link href="/planos">Planos</Link></li>
        <li><Link href="/simulador">Acessar simulador</Link></li>
        <li><Link href="/fale-com-agente">Fale com a gente</Link></li>
      </ul>
    </nav>
  );
}
