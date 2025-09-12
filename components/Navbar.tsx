"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; variant?: "default" | "primary" };

const links: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/planos", label: "Planos", variant: "primary" },
  { href: "/simulador", label: "Acessar simulador", variant: "primary" },
  { href: "/contato", label: "Fale com a gente" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur">
      <nav className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold tracking-wide text-emerald-400 hover:text-emerald-300"
        >
          RadarCrypto
        </Link>

        <ul className="flex items-center gap-3 md:gap-5 text-base md:text-lg">
          {links.map((l) => {
            const isActive = pathname === l.href;
            const base =
              "px-2 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-emerald-500/40";
            const commonGreen = "text-emerald-400 hover:text-emerald-300";
            const active = "font-semibold underline underline-offset-4";

            if (l.variant === "primary") {
              // Destaque em “Planos” e “Acessar simulador”
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`${base} bg-emerald-600 hover:bg-emerald-500 text-gray-900 font-bold px-3 py-1.5`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            }

            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`${base} ${commonGreen} ${isActive ? active : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
