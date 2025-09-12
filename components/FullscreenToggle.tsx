"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";

type FullscreenToggleProps = {
  isFull: boolean;
  onToggle: () => void;
  className?: string;
  title?: string;
};

/**
 * Botão compacto para alternar tela cheia.
 * - Tecla "F" entra/sai de tela cheia
 * - Tecla "Esc" sai de tela cheia
 * - NÃO depende de nenhuma lib de ícones
 */
export default function FullscreenToggle({
  isFull,
  onToggle,
  className,
  title,
}: FullscreenToggleProps) {
  // Entrar/Sair de fullscreen via API
  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;

    const isDocFull = !!document.fullscreenElement;
    if (!isDocFull) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    onToggle();
  };

  // Teclas de atalho: F e Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        if (isFull) onToggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFull]);

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-label={isFull ? "Sair da tela cheia" : "Tela cheia"}
      title={title || (isFull ? "Sair da tela cheia (Esc)" : "Tela cheia (F)")}
      className={cn(
        // botão pequeno, redondo, com foco/hover
        "inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-900/60 px-0 text-emerald-400",
        "hover:border-emerald-500 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
        // tamanhos default caso a página não passe h/w
        "h-8 w-8",
        className
      )}
    >
      {/* Ícone SVG (sem dependências) */}
      {isFull ? (
        // Minimize (sair do fullscreen)
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 14H5v4M9 14L4 19M15 10h4V6M15 10l5-5" />
        </svg>
      ) : (
        // Maximize (entrar em fullscreen)
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 5H5v4M9 5L4 10M15 19h4v-4M15 19l5-5" />
        </svg>
      )}
    </button>
  );
}
