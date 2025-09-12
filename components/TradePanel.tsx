// components/TradePanel.tsx
'use client';

import { useState } from 'react';

export default function TradePanel() {
  const [balance, setBalance] = useState(10000);
  const [position, setPosition] = useState(0);

  const buy = () => {
    setBalance((b) => b - 100);
    setPosition((p) => p + 1);
  };

  const sell = () => {
    setBalance((b) => b + 100);
    setPosition((p) => Math.max(0, p - 1));
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
      <h2 className="text-lg font-bold mb-4">Painel de Trade</h2>
      <p className="mb-2">Saldo: ${balance}</p>
      <p className="mb-4">Posições: {position}</p>
      <div className="flex gap-2">
        <button
          onClick={buy}
          className="flex-1 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
        >
          Comprar
        </button>
        <button
          onClick={sell}
          className="flex-1 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
        >
          Vender
        </button>
      </div>
    </div>
  );
}
