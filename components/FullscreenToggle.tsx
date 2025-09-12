"use client";

import { useEffect, useState } from "react";
import { Maximize2, X as Close } from "lucide-react";

type Props = {
  className?: string;
  title?: string;
};

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
      // ignora
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
      {isFull ? <Close className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
    </button>
  );
}
