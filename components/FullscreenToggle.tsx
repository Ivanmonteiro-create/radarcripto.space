"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  onChange?: (isFullscreen: boolean) => void;
};

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
      className="fixed right-4 bottom-4 z-50 rounded-full border border-gray-700 bg-gray-900/80 p-2 backdrop-blur hover:bg-gray-800"
      title={isFs ? "Sair da tela cheia (X)" : "Tela cheia (F)"}
    >
      {isFs ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
    </button>
  );
}
