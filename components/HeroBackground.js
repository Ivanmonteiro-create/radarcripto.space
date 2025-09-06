// /components/HeroBackground.js
export default function HeroBackground() {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox="0 0 1200 420"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.55, // controle geral
      }}
    >
      {/* Vinheta suave nas bordas */}
      <defs>
        <radialGradient id="fade" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
        </radialGradient>
        <linearGradient id="curve" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Grid MUITO sutil */}
      <g opacity="0.12">
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={(i * 50) + 0.5}
            y1="0"
            x2={(i * 50) + 0.5}
            y2="420"
            stroke="#9ec5ff"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={(i * 48) + 0.5}
            x2="1200"
            y2={(i * 48) + 0.5}
            stroke="#9ec5ff"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Curva sutil */}
      <path
        d="M-20,320 C180,180 380,260 580,200 C780,140 980,200 1220,130"
        fill="none"
        stroke="url(#curve)"
        strokeWidth="6"
        style={{ filter: "blur(0.3px)" }}
      />

      {/* vinheta nas bordas, bem leve */}
      <rect x="0" y="0" width="1200" height="420" fill="url(#fade)" opacity="0.35" />
    </svg>
  );
}
