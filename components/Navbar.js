"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NavLink = ({ href, children }) => {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-xl text-sm font-medium transition
        ${active ? "text-white/90 bg-white/10" : "text-white/70 hover:text-white/90 hover:bg-white/5"}`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 bg-slate-900/80 border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-white font-semibold tracking-tight">
          RadarCrypto.space
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink href="/">Início</NavLink>
          <NavLink href="/sobre">Sobre</NavLink>
          <NavLink href="/simulador">Acessar simulador</NavLink>
          <NavLink href="/contato">Fale com agente</NavLink>

          {/* === NOVO: Botão Planos (CTA) === */}
          <Link
            href="/planos"
            className="
              ml-2 inline-flex items-center gap-2 rounded-xl px-4 py-2
              text-sm font-semibold text-white
              bg-gradient-to-r from-emerald-500 to-cyan-500
              shadow-[0_8px_24px_rgb(16_185_129_/0.35)]
              hover:shadow-[0_10px_28px_rgb(16_185_129_/0.45)]
              hover:scale-[1.02] active:scale-[0.99] transition
              focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2 focus:ring-offset-slate-900
            "
            aria-label="Ver planos e recursos premium"
          >
            💎 Planos
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex flex-col gap-2">
            <NavLink href="/">Início</NavLink>
            <NavLink href="/sobre">Sobre</NavLink>
            <NavLink href="/simulador">Acessar simulador</NavLink>
            <NavLink href="/contato">Fale com agente</NavLink>
            {/* CTA nos dispositivos móveis */}
            <Link
              href="/planos"
              className="
                mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2
                text-sm font-semibold text-white
                bg-gradient-to-r from-emerald-500 to-cyan-500
                shadow-[0_8px_24px_rgb(16_185_129_/0.35)]
                hover:shadow-[0_10px_28px_rgb(16_185_129_/0.45)]
                transition focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2 focus:ring-offset-slate-900
              "
              aria-label="Ver planos e recursos premium"
              onClick={() => setOpen(false)}
            >
              💎 Planos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
