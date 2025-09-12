'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Início' },
  { href: '/about', label: 'Sobre' },
  { href: '/plans', label: 'Planos' },
  { href: '/simulator', label: 'Acessar simulador' },
  { href: '/contact', label: 'Fale com a gente' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-gray-800/50 bg-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-emerald-400 font-semibold tracking-wide">
          RadarCrypto
        </Link>
        <ul className="flex items-center gap-2">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={[
                    'rounded-md px-3 py-2 text-sm transition',
                    active
                      ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5',
                  ].join(' ')}
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
