"use client";

import { useEffect, useState } from "react";

type Props = {
  onChange?: (isFullscreen: boolean) => void;
};

function MaximizeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 9V4h5" />
      <path d="M20 15v5h-5" />
      <path d="M4 4l6 6" />
      <path d="M20 20l-6-6" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 4H4v5" />
      <path d="M15 20h5v-5" />
      <path d="M4 9l6-6" />
      <path d="M20 15l-6 6" />
    </svg>
  );
}

export default function FullscreenToggle({ onChange }: Props) {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const handler = () => {
      const active = !!document.fullscreenElement;
      setIsFs(active);
      onChange?.(active);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [onChange]);

  const toggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen error", e);
    }
  };

  return (
    <button
      aria-label={isFs ? "Sair da tela cheia" : "Entrar em tela cheia"}
      onClick={toggle}
      className="fixed right-4 bottom-4 z-50 rounded-full border border-gray-700 bg-gray-900/80 p-2 text-gray-200 backdrop-blur hover:bg-gray-800"
      title={isFs ? "Sair da tela cheia (X)" : "Tela cheia (F)"}
    >
      {isFs ? <MinimizeIcon /> : <MaximizeIcon />}
    </button>
  );
}
