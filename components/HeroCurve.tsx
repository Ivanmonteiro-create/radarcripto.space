"use client";

export default function HeroCurve() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg viewBox="0 0 1200 360" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="heroCurveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.0" />
            <stop offset="40%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
          </linearGradient>

          {/* leve brilho */}
          <filter id="curveGlow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* curva “dashed” com animação */}
        <path
          d="M 30 300 C 300 120, 600 360, 1150 140"
          stroke="url(#heroCurveGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="12 10"
          className="curveDash"
          filter="url(#curveGlow)"
        />
      </svg>

      <style jsx>{`
        .curveDash {
          animation: dashmove 6s linear infinite, floaty 6s ease-in-out infinite alternate;
        }
        @keyframes dashmove {
          to {
            stroke-dashoffset: -44;
          }
        }
        @keyframes floaty {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
