// components/TradeControls.tsx
"use client";

type Props = {
  symbol: string;
  onChangeSymbol: (s: string) => void;
  interval: string;
  onChangeInterval: (i: string) => void;
  balance?: number;
};

const PAIRS: { label: string; value: string }[] = [
  { label: "BTC/USDT", value: "BINANCE:BTCUSDT" },
  { label: "ETH/USDT", value: "BINANCE:ETHUSDT" },
  { label: "XRP/USDT", value: "BINANCE:XRPUSDT" },
  { label: "ADA/USDT", value: "BINANCE:ADAUSDT" },
  { label: "SOL/USDT", value: "BINANCE:SOLUSDT" },
  { label: "LINK/USDT", value: "BINANCE:LINKUSDT" },
  { label: "DOGE/USDT", value: "BINANCE:DOGEUSDT" },
  { label: "BNB/USDT", value: "BINANCE:BNBUSDT" },
];

const INTERVALS = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1h", value: "60" },
  { label: "4h", value: "240" },
  { label: "1D", value: "D" },
];

export default function TradeControls({
  symbol,
  onChangeSymbol,
  interval,
  onChangeInterval,
  balance = 10000,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-700/60 bg-gray-900/30 p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Controles de Trade</h2>

      <div className="mb-4 space-y-2">
        <label className="block text-sm text-gray-300">Par</label>
        <select
          value={symbol}
          onChange={(e) => onChangeSymbol(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-800/70 p-2 text-white"
        >
          {PAIRS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6 space-y-2">
        <label className="block text-sm text-gray-300">Intervalo</label>
        <select
          value={interval}
          onChange={(e) => onChangeInterval(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-800/70 p-2 text-white"
        >
          {INTERVALS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
      </div>

      {/* controles básicos (por enquanto desabilitados) */}
      <div className="mb-3 text-sm text-gray-400">Saldo (demo): ${balance.toLocaleString()}</div>

      <div className="grid grid-cols-2 gap-3">
        <button
          disabled
          className="cursor-not-allowed rounded-md bg-emerald-600/70 px-3 py-2 font-medium text-white"
          title="Em breve"
        >
          Comprar
        </button>
        <button
          disabled
          className="cursor-not-allowed rounded-md bg-rose-600/70 px-3 py-2 font-medium text-white"
          title="Em breve"
        >
          Vender
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400">Execução de ordens e PnL entram na próxima etapa.</p>
    </div>
  );
}
