"use client";

type Pair = { label: string; symbol: string };

export default function TradePanel({
  symbol,
  onSymbolChange,
  pairs,
}: {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
  pairs: Pair[];
}) {
  return (
    <div className="h-full w-full flex">
      <div className="m-4 flex-1 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
        <h2 className="text-gray-200 font-semibold mb-4">Controles de Trade</h2>

        {/* seleção do par (espelha o seletor superior) */}
        <label className="block text-xs text-gray-400 mb-1">Par</label>
        <select
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          className="w-full bg-gray-950/60 border border-gray-700 rounded-md px-3 py-2 mb-4 outline-none"
        >
          {pairs.map((p) => (
            <option key={p.symbol} value={p.symbol}>
              {p.label}
            </option>
          ))}
        </select>

        {/* saldo demo */}
        <div className="text-sm text-gray-300 mb-2">Saldo (demo): <span className="font-semibold">$10 000</span></div>

        {/* quantidade */}
        <label className="block text-xs text-gray-400 mb-1">Quantidade</label>
        <input
          type="number"
          min={0}
          className="w-full bg-gray-950/60 border border-gray-700 rounded-md px-3 py-2 mb-4 outline-none"
          placeholder="0"
        />

        {/* ações */}
        <div className="grid grid-cols-2 gap-3">
          <button className="h-10 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
            Comprar
          </button>
          <button className="h-10 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-medium">
            Vender
          </button>
          <button className="col-span-2 h-10 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100">
            Resetar
          </button>
        </div>
      </div>
    </div>
  );
}
