"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FullscreenToggle from "@/components/FullscreenToggle";

const links = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/planos", label: "Planos" },
  { href: "/simulador", label: "Acessar simulador" },
  { href: "/contato", label: "Fale com a gente" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isSimulator = pathname?.startsWith("/simulador");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold tracking-wide text-emerald-400">
          RadarCrypto
        </Link>

        <ul className="flex items-center gap-5 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={
                  "transition hover:text-emerald-300 " +
                  (pathname === l.href ? "text-emerald-400" : "text-gray-200")
                }
              >
                {l.label}
              </Link>
            </li>
          ))}

          {/* Botão de Tela Cheia aparece só no simulador, à direita do último link */}
          {isSimulator && <FullscreenToggle className="h-8 w-8" title="Tela cheia (F)" />}
        </ul>
      </nav>
    </header>
  );
}
