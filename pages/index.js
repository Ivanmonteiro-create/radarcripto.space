import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function Home() {
  // ---------- helpers de preço "fake" só para visual ----------
  const makePrice = (base, vol = 0.03) => {
    const delta = (Math.random() * 2 - 1) * vol
    const price = base * (1 + delta)
    const change = delta * 100
    return { price, change }
  }

  const initial = useMemo(
    () => ({
      BTCUSDT: makePrice(60000),
      ETHUSDT: makePrice(2400),
      SOLUSDT: makePrice(140),
      BNBUSDT: makePrice(560),
      ADAUSDT: makePrice(0.85),
      XRPUSDT: makePrice(0.62),
      LINKUSDT: makePrice(15.2),
      DOGEUSDT: makePrice(0.18),
    }),
    []
  )

  const [prices, setPrices] = useState(initial)

  useEffect(() => {
    const id = setInterval(() => {
      setPrices((p) => {
        const next = { ...p }
        Object.keys(next).forEach((k) => {
          const base = next[k].price
          next[k] = makePrice(base, 0.01) // oscilações menores contínuas
        })
        return next
      })
    }, 2500)
    return () => clearInterval(id)
  }, [])

  // 4 de cima + 4 de baixo (ordem definida)
  const topRow = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT']
  const bottomRow = ['ADAUSDT', 'XRPUSDT', 'LINKUSDT', 'DOGEUSDT']

  return (
    <>
      <Head>
        <title>RadarCrypto.space — Simulador de Trading</title>
        <meta name="description" content="Aprenda de verdade sem perder nada. Um simulador prático para testar estratégias e evoluir sem risco." />
      </Head>

      <main className="min-h-screen bg-slate-950 text-slate-200">
        {/* GRADIENTE SUAVE DO FUNDO */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_20%,rgba(56,189,248,0.10),transparent_70%),radial-gradient(45%_35%_at_80%_10%,rgba(16,185,129,0.08),transparent_70%)]"></div>

        {/* CONTAINER */}
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-24">
          {/* TICKERS SUPERIORES */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            {topRow.map((sym) => (
              <TickerBadge key={sym} symbol={sym} data={prices[sym]} />
            ))}
          </div>

          {/* BLOCO PRINCIPAL (hero) */}
          <section className="relative mx-auto max-w-3xl rounded-2xl border border-slate-700/60 bg-[rgba(12,23,38,0.7)] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
            {/* grid sutil */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22 width=%2232%22 height=%2232%22><path d=%22M0 31.5h32M31.5 0v32%22 stroke=%22%232a3a4a%22 stroke-width=%220.8%22/></svg>')] opacity-60"></div>

            {/* curva "viva" */}
            <CurveLine />

            <div className="relative z-[1] text-center">
              <span className="mb-3 inline-block rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1 text-xs tracking-widest text-slate-300">
                SIMULADOR DE TRADING
              </span>

              <h1 className="mx-auto max-w-2xl text-3xl md:text-4xl font-extrabold leading-tight">
                <span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                  Aprenda de verdade
                </span>{' '}
                sem perder nada.
              </h1>

              <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-slate-300/90">
                Um simulador prático para testar estratégias e evoluir{' '}
                <span className="font-semibold text-sky-300">sem risco</span>.
              </p>

              <div className="mt-5 flex items-center justify-center gap-3">
                <Link
                  href="/simulador"
                  className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  Acessar simulador
                </Link>
                <a
                  href="mailto:contato@radarcrypto.space"
                  className="rounded-md border border-slate-600/70 bg-slate-800/60 px-4 py-2 text-sm font-semibold hover:bg-slate-700/60 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
                >
                  Fale com a gente
                </a>
              </div>

              <div className="mx-auto mt-4 w-fit rounded-full border border-slate-700/60 bg-slate-800/70 px-3 py-1 text-[11px] text-slate-300/90">
                🛠️ Em construção — Fase 1 (site base online)
              </div>
            </div>
          </section>

          {/* TICKERS INFERIORES */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {bottomRow.map((sym) => (
              <TickerBadge key={sym} symbol={sym} data={prices[sym]} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

/* ---------- COMPONENTES ---------- */

function TickerBadge({ symbol, data }) {
  if (!data) return null
  const price = formatPrice(data.price)
  const isUp = data.change >= 0
  const change = `${isUp ? '▲' : '▼'} ${Math.abs(data.change).toFixed(2)}%`
  const changeClass = isUp ? 'text-emerald-400' : 'text-rose-400'

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-1.5 text-xs shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <span className="font-semibold text-slate-200">{symbol}</span>
      <span className="tabular-nums text-slate-300">${price}</span>
      <span className={`tabular-nums ${changeClass}`}>{change}</span>
    </div>
  )
}

function formatPrice(n) {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (n >= 1) return n.toFixed(2)
  return n.toFixed(4)
}

function CurveLine() {
  // SVG simples com stroke animado
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-[0]"
      viewBox="0 0 800 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M-20 260 C 120 50, 320 50, 460 180 S 820 260, 820 100"
        stroke="url(#grad)"
        strokeWidth="4"
        strokeLinecap="round"
        className="animate-[dash_6s_ease-in-out_infinite]"
        style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.35))' }}
      />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <style>
          {`
            @keyframes dash {
              0% { stroke-dasharray: 0 1200; }
              50% { stroke-dasharray: 600 1200; }
              100% { stroke-dasharray: 0 1200; }
            }
          `}
        </style>
      </defs>
    </svg>
  )
}
