// components/TradePanel.tsx
'use client';

import { useMemo, useState } from 'react';

type Pair = { label: string; value: string };

type Props = {
  /** Lista de pares. Se não vier, usa o default interno (8 pares). */
  pairs?: Pair[];
  /** Símbolo selecionado controlado externamente (opcional). */
  selectedSymbol?: string;
  /** Callback quando trocar o símbolo (opcional). */
  onChangeSymbol?: (value: string) => void;
};

export default function TradePanel({
  pairs,
  selectedSymbol,
  onChangeSymbol,
}: Props) {
  const defaultPairs: Pair[] = useMemo(
    () => [
      { label: 'BTC/USDT', value: 'BINANCE:BTCUSDT' },
      { label: 'ETH/USDT', value: 'BINANCE:ETHUSDT' },
      { label: 'XRP/USDT', value: 'BINANCE:XRPUSDT' },
      { label: 'SOL/USDT', value: 'BINANCE:SOLUSDT' },
      { label: 'LINK/USDT', value: 'BINANCE:LINKUSDT' },
      { label: 'ADA/USDT', value: 'BINANCE:ADAUSDT' },
      { label: 'BNB/USDT', value: 'BINANCE:BNBUSDT' },
      { label: 'DOGE/USDT', value: 'BINANCE:DOGEUSDT' },
    ],
    []
  );

  const list = pairs && pairs.length ? pairs : defaultPairs;

  // estado interno só se não vier controlado
  const [internalSymbol, setInternalSymbol] = useState<string>(list[0].value);
  const symbol = selectedSymbol ?? internalSymbol;

  const [balance, setBalance] = useState(10000);
  const [qty, setQty] = useState<number>(0);

  const handleChange = (val: string) => {
    if (onChangeSymbol) onChangeSymbol(val);
    else setInternalSymbol(val);
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h2 className="text-lg font-bold mb-4">Controles de Trade</h2>

      <label className="text-sm opacity-80">Par</label>
      <select
        className="mt-1 mb-4 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
        value={symbol}
        onChange={(e) => handleChange(e.target.value)}
      >
        {list.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <label className="text-sm opacity-80">Quantidade</label>
      <input
        type="number"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="mt-1 mb-4 w-full rounded-lg bg-gray-800 border border-gray-700 p-2"
        placeholder="0"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setBalance((b) => b - qty)}
          className="flex-1 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
        >
          Comprar
        </button>
        <button
          onClick={() => setBalance((b) => b + qty)}
          className="flex-1 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
        >
          Vender
        </button>
      </div>

      <div className="text-sm opacity-80">
        Saldo (demo): <span className="font-semibold">${balance.toFixed(2)}</span>
      </div>
    </div>
  );
}
