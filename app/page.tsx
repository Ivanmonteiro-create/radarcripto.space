// app/page.tsx
export default function HomePage() {
  const coins = [
    { s: "BTC/USDT", p: 60245.25, ch: -0.85 },
    { s: "ETH/USDT", p: 2448.57, ch: -0.45 },
    { s: "SOL/USDT", p: 141.91, ch: 0.04 },
    { s: "BNB/USDT", p: 561.37, ch: 0.65 },
    { s: "ADA/USDT", p: 0.45, ch: 1.10 },
    { s: "XRP/USDT", p: 0.62, ch: -0.25 },
    { s: "LINK/USDT", p: 15.2, ch: 1.10 },
    { s: "DOGE/USDT", p: 0.18, ch: 0.75 },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      {/* HERO “cartão” com grade e borda arredondada */}
      <div
        className="
          relative rounded-[28px] border border-gray-700
          bg-gray-900/40 p-6 md:p-10
        "
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 40px)," +
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 40px)",
        }}
      >
        <div className="inline-flex items-center rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300 mb-5">
          SIMULADOR DE TRADING
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Aprenda de verdade{" "}
          <span className="text-emerald-400">sem perder nada.</span>
        </h1>

        <p className="mt-4 text-lg text-gray-200 max-w-3xl">
          Um simulador prático para testar estratégias e evoluir{" "}
          <span className="text-emerald-400">sem risco</span>.
        </p>

        {/* Badges de features */}
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            "Conta demo — sem corretora",
            "Risco por trade configurável",
            "Histórico local no navegador",
          ].map((t) => (
            <span
              key={t}
              className="rounded-full border border-gray-600/70 bg-gray-900/60 px-4 py-1 text-sm text-gray-200"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Selo de progresso */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-600/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
          🧱 Em construção — Fase 1 (site base online)
        </div>
      </div>

      {/* Tickers em “pílulas” */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {coins.map((c) => (
          <div
            key={c.s}
            className="rounded-2xl border border-gray-700 bg-gray-900/60 px-4 py-3 flex items-center justify-between"
          >
            <div className="font-medium">{c.s}</div>
            <div className="text-right">
              <div className="text-sm text-gray-200">
                ${c.p.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className={c.ch >= 0 ? "text-emerald-400 text-xs" : "text-red-400 text-xs"}>
                {c.ch >= 0 ? "▲" : "▼"} {Math.abs(c.ch).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
