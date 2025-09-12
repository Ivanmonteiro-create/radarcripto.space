"use client";

import { useEffect, useState } from "react";

type Props = {
  className?: string;
  title?: string;
};

/** Ícone “tela cheia” (maximize) em SVG inline */
function IconMaximize({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 3h6v6" />
      <path d="M21 3l-7 7" />
      <path d="M9 21H3v-6" />
      <path d="M3 21l7-7" />
    </svg>
  );
}

/** Ícone “X/fechar” em SVG inline */
function IconClose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function FullscreenToggle({ className = "h-8 w-8", title }: Props) {
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = async () => {
    const root = document.getElementById("sim-root");
    if (!root) return;
    try {
      if (!document.fullscreenElement) {
        await root.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // silencioso
    }
  };

  return (
    <button
      onClick={toggle}
      title={title ?? (isFull ? "Sair da tela cheia (Esc)" : "Tela cheia (F)")}
      className={
        "inline-flex items-center justify-center rounded-md border border-gray-700 bg-gray-900/70 p-1 text-emerald-400 hover:bg-gray-800 " +
        className
      }
      aria-label={isFull ? "Sair da tela cheia" : "Tela cheia"}
    >
      {isFull ? <IconClose /> : <IconMaximize />}
    </button>
  );
}
