"use client";

import { useCallback, useEffect, useState } from "react";

type FullscreenToggleProps = {
  targetId: string;
  onChange?: (active: boolean) => void;
  className?: string;
};

export default function FullscreenToggle({
  targetId,
  onChange,
  className,
}: FullscreenToggleProps) {
  const [active, setActive] = useState(false);

  const getTarget = () =>
    (document.getElementById(targetId) as any) ?? (document.documentElement as any);

  const enter = useCallback(() => {
    const el: any = getTarget();
    const fn =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen ||
      el.mozRequestFullScreen;
    fn?.call(el);
  }, [targetId]);

  const exit = useCallback(() => {
    const d: any = document;
    const fn =
      d.exitFullscreen || d.webkitExitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen;
    fn?.call(d);
  }, []);

  const refresh = useCallback(() => {
    const d: any = document;
    const isOn =
      !!(d.fullscreenElement ||
        d.webkitFullscreenElement ||
        d.msFullscreenElement ||
        d.mozFullScreenElement);
    setActive(isOn);
    onChange?.(isOn);
  }, [onChange]);

  const toggle = useCallback(() => {
    if (active) exit();
    else enter();
  }, [active, enter, exit]);

  useEffect(() => {
    const evts = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
    ];
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
      aria-label={active ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
      title={active ? "Sair da tela cheia (F)" : "Tela cheia (F)"}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-emerald-600/40 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20 " +
        (className ?? "")
      }
    >
      {/* ícone compacto (sem dependências) */}
      {active ? (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M9 3H3v6h2V5h4V3zm12 0h-6v2h4v4h2V3zM5 15H3v6h6v-2H5v-4zm16 0h-2v4h-4v2h6v-6z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M14 3v2h3.59L13 9.59 14.41 11 19 6.41V10h2V3h-7zM3 21h7v-2H6.41L11 14.41 9.59 13 5 17.59V14H3v7z" />
        </svg>
      )}
    </button>
  );
}
