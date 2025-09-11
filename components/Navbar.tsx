"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/about", label: "Sobre" },
  { href: "/plans", label: "Planos" },
  { href: "/simulator", label: "Acessar simulador" },
  { href: "/contact", label: "Fale com a gente" },
];

function NavbarContent() {
  const pathname = usePathname();
  const qs = useSearchParams();
  const active = useMemo(() => pathname + qs.toString(), [pathname, qs]);

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-semibold tracking-wide text-lg"
        >
          RadarCripto
        </Link>

        <ul className="flex items-center gap-6 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-2 py-1 transition ${
                  isHome
                    ? "text-emerald-400 hover:text-emerald-300"
                    : active.startsWith(l.href)
                    ? "text-emerald-400"
                    : "text-gray-300 hover:text-gray-100"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-400">Carregando...</div>}>
      <NavbarContent />
    </Suspense>
  );
}
