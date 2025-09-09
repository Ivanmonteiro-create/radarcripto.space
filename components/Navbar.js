'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Navbar() {
  const pathname = usePathname();

  // Oculta a navbar nas rotas do simulador
  if (pathname?.startsWith('/simulador')) return null;

  const baseLinkStyle: React.CSSProperties = {
    display: 'block',
    padding: '10px 14px',
    borderRadius: 12,
    textDecoration: 'none',
    color: '#e5e7eb',        // cinza claro
    fontWeight: 600,
    lineHeight: 1,
    background: 'transparent',
    boxShadow: 'none',
    transition: 'transform .12s ease, opacity .12s ease',
  };

  const btnGreen: React.CSSProperties = {
    ...baseLinkStyle,
    background: '#16a34a',   // verde forte
    color: '#0b1112',        // contraste no seu tema escuro
    boxShadow: '0 0 0 1px rgba(22,163,74,.55) inset, 0 6px 18px rgba(22,163,74,.18)',
    fontSize: 15,
  };

  const wrapStyle: React.CSSProperties = {
    position: 'fixed',
    right: 18,
    top: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    zIndex: 40,
    userSelect: 'none',
  };

  const hoverStyle = { transform: 'translateY(-1px)', opacity: 0.95 };

  return (
    <nav aria-label="Navegação principal" style={wrapStyle}>
      <Link href="/" style={baseLinkStyle} onMouseEnter={e=>Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e=>Object.assign(e.currentTarget.style, {transform:'none', opacity:'1'})}>
        Início
      </Link>

      <Link href="/sobre" style={baseLinkStyle} onMouseEnter={e=>Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e=>Object.assign(e.currentTarget.style, {transform:'none', opacity:'1'})}>
        Sobre
      </Link>

      <Link href="/planos" style={btnGreen} onMouseEnter={e=>Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e=>Object.assign(e.currentTarget.style, {transform:'none', opacity:'1'})}>
        Planos
      </Link>

      <Link href="/simulador" style={btnGreen} onMouseEnter={e=>Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e=>Object.assign(e.currentTarget.style, {transform:'none', opacity:'1'})}>
        Acessar simulador
      </Link>

      <Link href="/contato" style={baseLinkStyle} onMouseEnter={e=>Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e=>Object.assign(e.currentTarget.style, {transform:'none', opacity:'1'})}>
        Fale com a gente
      </Link>
    </nav>
  );
}
