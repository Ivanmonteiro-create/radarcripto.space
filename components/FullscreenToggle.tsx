"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  /** id do elemento que vai entrar em tela cheia */
  targetId: string;
  /** avisa a página se está em fullscreen (pra esconder o painel) */
  onChange?: (isFullscreen: boolean) => void;
  className?: string;
};

export default function FullscreenToggle({ targetId, onChange, className }: Props) {
  const [isFs, setIsFs] = useState(false);

  const getTarget = () => document.getElementById(targetId) ?? document.documentElement;

  const request = useCallback(() => {
    const el: any = getTarget();
    (el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen ||
      el.mozRequestFullScreen)?.call(el);
  }, [targetId]);

  const exit = useCallback(() => {
    const d: any = document;
    (d.exitFullscreen || d.webkitExitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen)?.call(d);
  }, []);

  const refresh = useCallback(() => {
    const d: any = document;
    const active =
      d.fullscreenElement ||
      d.webkitFullscreenElement ||
      d.msFullscreenElement ||
      d.mozFullScreenElement
        ? true
        : false;
    setIsFs(active);
    onChange?.(active);
  }, [onChange]);

  const toggle = useCallback(() => {
    if (isFs) exit();
    else request();
  }, [isFs, exit, request]);

  useEffect(() => {
    const evts = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"] as const;
    evts.forEach((e) => document.addEventListener(e, refresh));
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") toggle();
      if (e.key === "Escape") refresh();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      evts.forEach((e) => document.removeEventListener(e, refresh));
      document.removeEventListener("keydown", onKey);
    };
  }, [toggle, refresh]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isFs ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
      title={isFs ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-emerald-600/40 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 " +
        (className ?? "")
      }
    >
      {/* Ícone inline (sem libs) */}
      {isFs ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M9 3H3v6h2V5h4V3zm12 0h-6v2h4v4h2V3zM5 15H3v6h6v-2H5v-4zm16 0h-2v4h-4v2h6v-6z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M14 3v2h3.59L13 9.59 14.41 11 19 6.41V10h2V3h-7zM3 21h7v-2H6.41L11 14.41 9.59 13 5 17.59V14H3v7z" />
        </svg>
      )}
    </button>
  );
}
