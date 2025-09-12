'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/planos', label: 'Planos' },
  { href: '/simulador', label: 'Acessar simulador' },
  { href: '/contato', label: 'Fale com a gente' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-3 md:px-6">
        <Link href="/" className="text-emerald-400 font-semibold">
          RadarCrypto
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'rounded-md px-3 py-1 text-sm transition',
                pathname === l.href
                  ? 'bg-emerald-600 text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
