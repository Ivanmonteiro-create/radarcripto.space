// components/Navbar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const basePill =
    "inline-flex items-center rounded-full border border-white/15 px-3.5 py-2 text-sm transition";
  const neutral =
    "bg-white/5 text-zinc-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20";
  const green =
    "bg-emerald-600 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-300";

  // Links do menu
  const links = [
    { href: "/", label: "Início", pill: neutral },
    { href: "/sobre", label: "Sobre", pill: neutral },
    // ✅ Estes dois ficam VERDES
    { href: "/planos", label: "Planos", pill: green },
    { href: "/simulador", label: "Acessar simulador", pill: green },
    { href: "/contato", label: "Fale com a gente", pill: neutral },
  ];

  return (
    <nav className="fixed right-4 top-6 z-40 flex flex-wrap gap-2">
      {links.map(({ href, label, pill }) => {
        // realce sutil quando a rota está ativa (não muda cor)
        const active =
          pathname === href
            ? "ring-1 ring-white/20"
            : "";

        return (
          <Link
            key={href}
            href={href}
            className={`${basePill} ${pill} ${active}`}
            prefetch={false}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
