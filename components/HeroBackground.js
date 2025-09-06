// /components/HeroBackground.js
import { useEffect, useRef } from "react";

/**
 * Fundo do herói: grid + glow + sparkline suave.
 * Não depende de libs externas.
 */
export default function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    let raf;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => {
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Gera pontos para um "sparkline" simples
    const N = 80;
    let pts = Array.from({ length: N }, (_, i) => ({
      x: (i / (N - 1)) * c.width,
      y: c.height * 0.55 + Math.sin(i * 0.25) * 18 * dpr,
    }));
    let t = 0;

    const draw = () => {
      t += 0.015;

      // fundo transparente
      ctx.clearRect(0, 0, c.width, c.height);

      // grid
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1 * dpr;

      const gap = 40 * dpr;
      for (let x = (t * 20) % gap; x < c.width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, c.height);
        ctx.stroke();
      }
      for (let y = (t * 12) % gap; y < c.height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(c.width, y);
        ctx.stroke();
      }
      ctx.restore();

      // anima sparkline
      pts = pts.map((p, i) => ({
        x: (i / (N - 1)) * c.width,
        y:
          c.height * 0.55 +
          Math.sin(i * 0.25 + t * 1.25) * (16 * dpr) +
          Math.cos(i * 0.07 + t) * (6 * dpr),
      }));

      // brilho
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, c.width, 0);
      grad.addColorStop(0, "#16a34a");
      grad.addColorStop(1, "#3b82f6");
      ctx.strokeStyle = grad;

      // glow largo
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 10 * dpr;
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();

      // linha fina
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: 16,
      }}
      aria-hidden="true"
    >
      {/* “vidro” de fundo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 600px at 50% 60%, rgba(16,185,129,0.10), transparent 60%), radial-gradient(1200px 600px at 60% 40%, rgba(59,130,246,0.10), transparent 60%)",
          filter: "blur(4px)",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
