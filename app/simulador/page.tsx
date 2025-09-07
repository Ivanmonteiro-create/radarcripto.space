"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

/**
 * RadarCripto.space — Fase 2
 * Simulador spot com:
 *  - Feed em tempo real (Binance WebSocket)
 *  - Gráfico de velas (Lightweight Charts) + EMA(9/21)
 *  - Painel de trade (comprar/vender), P&L ao vivo, histórico
 *  - Persistência localStorage
 */

const LS_KEYS = {
  BALANCE: "rc_balance",
  HISTORY: "rc_history",
  POSITIONS: "rc_positions",
  SETTINGS: "rc_settings",
};

const DEFAULT_SYMBOLS = [
  { label: "BTC/USDT", value: "btcusdt" },
  { label: "ETH/USDT", value: "ethusdt" },
  { label: "SOL/USDT", value: "solusdt" },
  { label: "BNB/USDT", value: "bnbusdt" },
  { label: "ADA/USDT", value: "adausdt" },
  { label: "XRP/USDT", value: "xrpusdt" },
  { label: "LINK/USDT", value: "linkusdt" },
  { label: "DOGE/USDT", value: "dogeusdt" },
];

function formatUSD(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);
}

function pct(a: number, b: number) {
  if (b === 0) return 0;
  return (a / b) * 100;
}

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function computeEMA(period: number, closes: number[]): number[] {
  if (closes.length === 0) return [];
  const k = 2 / (period + 1);
  const ema: number[] = [];
  let prev = closes[0];
  ema.push(prev);
  for (let i = 1; i < closes.length; i++) {
    prev = closes[i] * k + prev * (1 - k);
    ema.push(prev);
  }
  return ema;
}

interface KlineBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Position {
  id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  qty: number;
  entry: number;
  openedAt: number;
}

interface TradeRecord {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  price: number;
  qty: number;
  pnl?: number;
  at: number;
}

export default function RadarSimulatorPro() {
  const [symbol, setSymbol] = useState<string>(() => loadLS(LS_KEYS.SETTINGS, { symbol: DEFAULT_SYMBOLS[0].value }).symbol);
  const [balance, setBalance] = useState<number>(() => loadLS(LS_KEYS.BALANCE, 10000));
  const [positions, setPositions] = useState<Position[]>(() => loadLS(LS_KEYS.POSITIONS, [] as Position[]));
  const [history, setHistory] = useState<TradeRecord[]>(() => loadLS(LS_KEYS.HISTORY, [] as TradeRecord[]));
  const [orderSize, setOrderSize] = useState<number>(100);
  const [allowShort, setAllowShort] = useState<boolean>(true);

  const [lastPrice, setLastPrice] = useState<number>(0);
  const [bars, setBars] = useState<KlineBar[]>([]);
  const [timeframe, setTimeframe] = useState<string>("1m");

  useEffect(() => saveLS(LS_KEYS.BALANCE, balance), [balance]);
  useEffect(() => saveLS(LS_KEYS.POSITIONS, positions), [positions]);
  useEffect(() => saveLS(LS_KEYS.HISTORY, history), [history]);
  useEffect(() => saveLS(LS_KEYS.SETTINGS, { symbol }), [symbol]);

  // ===== WebSocket Binance =====
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }

    const stream = `${symbol}@kline_${timeframe}`;
    const trade = `${symbol}@trade`;
    const url = `wss://stream.binance.com:9443/stream?streams=${stream}/${trade}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data?.data || !data?.stream) return;

        if (data.stream.includes("@kline_")) {
          const k = data.data.k;
          const bar: KlineBar = {
            time: Math.floor(k.t / 1000),
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
          };
          setBars((prev) => {
            const clone = [...prev];
            if (clone.length && clone[clone.length - 1].time === bar.time) {
              clone[clone.length - 1] = bar;
            } else {
              clone.push(bar);
              if (clone.length > 500) clone.shift();
            }
            return clone;
          });
        }

        if (data.stream.includes("@trade")) {
          const p = parseFloat(data.data.p);
          if (!Number.isNaN(p)) setLastPrice(p);
        }
      } catch {}
    };

    return () => {
      try { ws.close(); } catch {}
    };
  }, [symbol, timeframe]);

  // ===== Chart =====
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const ema9SeriesRef = useRef<any>(null);
  const ema21SeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = createChart(chartRef.current, {
      height: 420,
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false },
      layout: { background: { color: "transparent" }, textColor: "#e5e7eb" },
      grid: { vertLines: { color: "#111827" }, horzLines: { color: "#111827" } },
      crosshair: { mode: CrosshairMode.Normal },
    });
    chartInstance.current = chart;

    const candle = chart.addCandlestickSeries({ upColor: "#16a34a", downColor: "#dc2626", borderUpColor: "#16a34a", borderDownColor: "#dc2626", wickUpColor: "#6b7280", wickDownColor: "#6b7280" });
    candleSeriesRef.current = candle;

    const ema9 = chart.addLineSeries({ lineWidth: 2, color: "#facc15" });
    const ema21 = chart.addLineSeries({ lineWidth: 2, color: "#3b82f6" });
    ema9SeriesRef.current = ema9;
    ema21SeriesRef.current = ema21;

    const ro = new ResizeObserver(() => chart.applyOptions({ width: chartRef.current?.clientWidth || 600 }));
    ro.observe(chartRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || bars.length === 0) return;
    candleSeriesRef.current.setData(bars.map((b) => ({ time: b.time as any, open: b.open, high: b.high, low: b.low, close: b.close })));

    const closes = bars.map((b) => b.close);
    const ema9 = computeEMA(9, closes);
    const ema21 = computeEMA(21, closes);
    ema9SeriesRef.current?.setData(ema9.map((v, i) => ({ time: bars[i].time as any, value: v })));
    ema21SeriesRef.current?.setData(ema21.map((v, i) => ({ time: bars[i].time as any, value: v })));
  }, [bars]);

  // ===== Trading Logic =====
  const symbolLabel = useMemo(() => DEFAULT_SYMBOLS.find((s) => s.value === symbol)?.label || symbol.toUpperCase(), [symbol]);
  const position = useMemo(() => positions.find((p) => p.symbol === symbol) || null, [positions, symbol]);

  const unrealized = useMemo(() => {
    if (!position || !lastPrice) return 0;
    const dir = position.side === "LONG" ? 1 : -1;
    return (lastPrice - position.entry) * position.qty * dir;
  }, [position, lastPrice]);

  function placeOrder(side: "BUY" | "SELL") {
    if (!lastPrice || orderSize <= 0) return;
    let newPositions = [...positions];
    let newBalance = balance;
    const qtyFromUSDT = orderSize / lastPrice;

    if (!position) {
      const pos: Position = {
        id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
        symbol,
        side: side === "BUY" ? "LONG" : "SHORT",
        qty: qtyFromUSDT,
        entry: lastPrice,
        openedAt: Date.now(),
      };
      if (side === "SELL" && !allowShort) return;
      newPositions.push(pos);
      newBalance -= orderSize;
    } else {
      const opposite = position.side === "LONG" ? "SELL" : "BUY";
      if (side === opposite) {
        const pnl = unrealized;
        newBalance += orderSize + pnl;
        newPositions = newPositions.filter((p) => p.symbol !== symbol);
        setHistory((h) => [
          { id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()), symbol, side, price: lastPrice, qty: position.qty, pnl, at: Date.now() },
          ...h,
        ]);
        setBalance(newBalance);
        setPositions(newPositions);
        return;
      } else {
        const totalQty = position.qty + qtyFromUSDT;
        const newEntry = (position.entry * position.qty + lastPrice * qtyFromUSDT) / totalQty;
        newPositions = newPositions.map((p) => (p.symbol === symbol ? { ...p, qty: totalQty, entry: newEntry } : p));
        newBalance -= orderSize;
      }
    }

    setHistory((h) => [
      { id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()), symbol, side, price: lastPrice, qty: qtyFromUSDT, at: Date.now() },
      ...h,
    ]);
    setBalance(newBalance);
    setPositions(newPositions);
  }

  function resetAll() {
    if (!confirm("Resetar saldo e histórico?")) return;
    setBalance(10000);
    setPositions([]);
    setHistory([]);
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">RadarCripto — Simulador Spot</h1>
            <p className="text-xs text-gray-400">Educação • Preços em tempo real da Binance • Gráfico Lightweight Charts</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="rounded-xl bg-gray-800 px-3 py-2 text-sm outline-none ring-1 ring-gray-700"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            >
              {DEFAULT_SYMBOLS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              className="rounded-xl bg-gray-800 px-3 py-2 text-sm outline-none ring-1 ring-gray-700"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              {["1m","5m","15m","1h","4h","1d"].map((tf) => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
            <button onClick={resetAll} className="rounded-xl bg-gray-800 px-3 py-2 text-sm ring-1 ring-gray-700 hover:bg-gray-700">
              Resetar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Chart */}
          <div className="lg:col-span-3 rounded-2xl border border-gray-800 bg-gray-900/50 p-3 shadow">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm text-gray-300">{symbolLabel}</div>
              <div className="text-sm">
                Último preço: <span className="font-mono font-semibold">{lastPrice ? lastPrice.toFixed(2) : "--"}</span>
              </div>
            </div>
            <div ref={chartRef} className="w-full" />
            <div className="mt-2 text-xs text-gray-400">EMA 9 / EMA 21 • Velas: {timeframe}</div>
          </div>

          {/* Trade Panel */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 shadow">
            <div className="mb-4">
              <div className="text-xs uppercase text-gray-400">Saldo</div>
              <div className="text-2xl font-bold">{formatUSD(balance)}</div>
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-xs text-gray-400">Tamanho da ordem (USDT)</label>
              <input
                type="number"
                min={10}
                step={10}
                value={orderSize}
                onChange={(e) => setOrderSize(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl bg-gray-800 px-3 py-2 font-mono outline-none ring-1 ring-gray-700 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="mt-1 text-right text-[10px] text-gray-500">~ {(orderSize / (lastPrice || 1)).toFixed(6)} unidades</div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button onClick={() => placeOrder("BUY")} className="rounded-2xl bg-green-600 px-4 py-3 font-semibold shadow hover:bg-green-500">COMPRAR</button>
              <button onClick={() => placeOrder("SELL")} className="rounded-2xl bg-red-600 px-4 py-3 font-semibold shadow hover:bg-red-500">VENDER</button>
            </div>

            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="text-gray-400">Permitir Short</div>
              <input type="checkbox" checked={allowShort} onChange={(e) => setAllowShort(e.target.checked)} />
            </div>

            <div className="rounded-xl bg-gray-800 p-3">
              <div className="mb-1 text-xs uppercase text-gray-400">Posição atual</div>
              {!position ? (
                <div className="text-sm text-gray-400">Nenhuma posição em {symbolLabel}</div>
              ) : (
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-400">Lado:</span> {position.side}</div>
                  <div><span className="text-gray-400">Entrada:</span> {position.entry.toFixed(2)}</div>
                  <div><span className="text-gray-400">Qtd:</span> {position.qty.toFixed(6)}</div>
                  <div className={"font-semibold " + (unrealized >= 0 ? "text-green-400" : "text-red-400")}>
                    P&L: {formatUSD(unrealized)} ({pct(unrealized, orderSize).toFixed(2)}%)
                  </div>
                </div>
              )}
            </div>

            <p className="mt-4 text-[10px] leading-relaxed text-gray-500">
              Aviso educacional: este é um simulador sem execução real. Preços em tempo real da Binance. Sem recomendação de investimento.
            </p>
          </div>
        </div>

        {/* Histórico */}
        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900/50 p-4 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Histórico de operações</h2>
            <button
              onClick={() => setHistory([])}
              className="rounded-xl bg-gray-800 px-3 py-2 text-xs ring-1 ring-gray-700 hover:bg-gray-700"
            >
              Limpar
            </button>
          </div>

          {history.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">Sem operações ainda.</div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-800/60 text-left text-gray-300">
                  <tr>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Par</th>
                    <th className="px-3 py-2">Side</th>
                    <th className="px-3 py-2">Preço</th>
                    <th className="px-3 py-2">Qtd</th>
                    <th className="px-3 py-2">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((t) => (
                    <tr key={t.id} className="border-t border-gray-800">
                      <td className="px-3 py-2 text-gray-400">{new Date(t.at).toLocaleString()}</td>
                      <td className="px-3 py-2">{t.symbol.toUpperCase()}</td>
                      <td className="px-3 py-2">{t.side}</td>
                      <td className="px-3 py-2 font-mono">{t.price.toFixed(2)}</td>
                      <td className="px-3 py-2 font-mono">{t.qty.toFixed(6)}</td>
                      <td className={"px-3 py-2 font-mono " + (t.pnl === undefined ? "text-gray-400" : t.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                        {t.pnl === undefined ? "--" : formatUSD(t.pnl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
