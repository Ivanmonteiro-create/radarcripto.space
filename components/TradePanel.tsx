"use client";

type Props = { className?: string };

export default function TradePanel({ className = "" }: Props) {
  return (
    <aside
      className={
        "w-full max-w-[380px] rounded-2xl border border-gray-800 bg-gray-900/50 p-4 " +
        className
      }
    >
      <h2 className="mb-3 font-semibold text-gray-200">Controles de Trade</h2>

      <div className="space-y-3">
        <label className="block text-sm text-gray-400">Par</label>
        <select className="w-full rounded bg-gray-950 border border-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
          <option>BTCUSDT</option>
          <option>ETHUSDT</option>
          <option>SOLUSDT</option>
          <option>BNBUSDT</option>
          <option>ADAUSDT</option>
          <option>XRPUSDT</option>
          <option>LINKUSDT</option>
          <option>DOGEUSDT</option>
        </select>

        <label className="block text-sm text-gray-400">Quantidade</label>
        <input className="w-full rounded bg-gray-950 border border-gray-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="0" />

        <div className="text-sm text-gray-400">Saldo (demo): $10.000</div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-2 font-medium">Comprar</button>
          <button className="rounded bg-red-600 hover:bg-red-500 px-3 py-2 font-medium">Vender</button>
          <button className="col-span-2 rounded bg-gray-800 hover:bg-gray-700 px-3 py-2">Resetar</button>
        </div>
      </div>
    </aside>
  );
}
