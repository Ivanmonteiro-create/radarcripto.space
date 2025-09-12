'use client';

type Props = {
  pairs: string[];
  selectedSymbol: string;
  onChangeSymbol: (s: string) => void;
};

export default function TradePanel({
  pairs,
  selectedSymbol,
  onChangeSymbol,
}: Props) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-lg font-semibold">Controles de Trade</h2>

      <label className="text-sm opacity-80">Par</label>
      <select
        value={selectedSymbol}
        onChange={(e) => onChangeSymbol(e.target.value)}
        className="rounded-md bg-gray-800 border border-gray-700 p-2 outline-none"
      >
        {pairs.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <div className="mt-auto text-xs opacity-60">
        * Painel simplificado apenas para troca de par.
      </div>
    </div>
  );
}
