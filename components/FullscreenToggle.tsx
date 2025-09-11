"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  onChange?: (isFullscreen: boolean) => void;
};

function MaxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 9V4h5M20 15v5h-5" />
      <path d="M4 4l6 6M20 20l-6-6" />
    </svg>
  );
}
function MinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 4H4v5M15 20h5v-5" />
      <path d="M4 9l6-6M20 15l-6 6" />
    </svg>
  );
}

export default function FullscreenToggle({ onChange }: Props) {
  const [isFs, setIsFs] = useState(false);

  const getIsFs = () =>
    !!(
      document.fullscreenElement ||
      // @ts-expect-error vendor prefixes
      document.webkitFullscreenElement ||
      // @ts-expect-error vendor prefixes
      document.mozFullScreenElement ||
      // @ts-expect-error vendor prefixes
      document.msFullscreenElement
    );

  const exitFs = async () => {
    try {
      if (document.exitFullscreen) return await document.exitFullscreen();
      // @ts-expect-error vendor prefixes
      if (document.webkitExitFullscreen) return await document.webkitExitFullscreen();
      // @ts-expect-error vendor prefixes
      if (document.mozCancelFullScreen) return await document.mozCancelFullScreen();
      // @ts-expect-error vendor prefixes
      if (document.msExitFullscreen) return await document.msExitFullscreen();
    } catch (e) {
      console.error(e);
    }
  };

  const requestFs = async () => {
    const el = document.documentElement as any;
    try {
      if (el.requestFullscreen) return await el.requestFullscreen();
      if (el.webkitRequestFullscreen) return await el.webkitRequestFullscreen();
      if (el.mozRequestFullScreen) return await el.mozRequestFullScreen();
      if (el.msRequestFullscreen) return await el.msRequestFullscreen();
      console.warn("Fullscreen API não disponível neste navegador.");
    } catch (e) {
      console.error(e);
    }
  };

  const toggle = useCallback(async () => {
    if (getIsFs()) {
      await exitFs();
    } else {
      await requestFs();
    }
  }, []);

  useEffect(() => {
    const handleChange = () => {
      const v = getIsFs();
      setIsFs(v);
      onChange?.(v);
    };
    document.addEventListener("fullscreenchange", handleChange);
    // @ts-expect-error vendor prefixes
    document.addEventListener("webkitfullscreenchange", handleChange);
    // @ts-expect-error vendor prefixes
    document.addEventListener("mozfullscreenchange", handleChange);
    // @ts-expect-error vendor prefixes
    document.addEventListener("MSFullscreenChange", handleChange);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "f") toggle();
      if (e.key.toLowerCase() === "x" && getIsFs()) exitFs();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      // @ts-expect-error vendor prefixes
      document.removeEventListener("webkitfullscreenchange", handleChange);
      // @ts-expect-error vendor prefixes
      document.removeEventListener("mozfullscreenchange", handleChange);
      // @ts-expect-error vendor prefixes
      document.removeEventListener("MSFullscreenChange", handleChange);
      window.removeEventListener("keydown", onKey);
    };
  }, [onChange, toggle]);

  return (
    <button
      aria-label={isFs ? "Sair da tela cheia" : "Tela cheia"}
      onClick={toggle}
      className="fixed right-4 bottom-4 z-50 rounded-full border border-gray-700 bg-gray-900/80 p-2 text-gray-200 backdrop-blur hover:bg-gray-800"
      title={isFs ? "Sair da tela cheia (X)" : "Tela cheia (F)"}
    >
      {isFs ? <MinIcon /> : <MaxIcon />}
    </button>
  );
}
