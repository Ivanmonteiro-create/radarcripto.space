// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const links = [
  { href: "/", label: "Início" },
  { href: "/about", label: "Sobre" },
  { href: "/plans", label: "Planos" },
  { href: "/simulator", label: "Acessar simulador" },
  { href: "/contact", label: "Fale com a gente" },
];

export default function Navbar() {
  const pathname = usePathname();
  const qs = useSearchParams(); // evita hydration mismatch

  const active = useMemo(() => pathname, [pathname, qs?.toString()]);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-950/90 backdrop-blur">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">
          RadarCripto
        </Link>
        <ul className="flex items-center gap-4 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-2 py-1 rounded hover:bg-gray-800 transition ${
                  active === l.href ? "bg-gray-800" : ""
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
