// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-400 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} RadarCripto. Todos os direitos reservados.</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-gray-200">Sobre</Link>
          <Link href="/plans" className="hover:text-gray-200">Planos</Link>
          <Link href="/contact" className="hover:text-gray-200">Contato</Link>
        </div>
      </div>
    </footer>
  );
}
