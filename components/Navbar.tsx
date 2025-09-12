"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
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
  const active = useMemo(() => pathname, [pathname]);

  const onSimulador = active === "/simulador";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide text-emerald-400">RadarCrypto</Link>
        <ul className="flex items-center gap-5 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={
                  "px-2 py-1 rounded hover:bg-gray-800 transition " +
                  (active === l.href ? "text-emerald-400" : "text-gray-300")
                }
              >
                {l.label}
              </Link>
            </li>
          ))}
          {onSimulador && (
            <li className="ml-2">
              <FullscreenToggle />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
