"use client";

import { useState } from "react";

export default function TradePanel() {
  const [balance, setBalance] = useState(10000);
  const [position, setPosition] = useState<number | null>(null);

  const buy = () => {
    if (position === null) {
      setPosition(1000);
      setBalance(balance - 1000);
    }
  };

  const sell = () => {
    if (position !== null) {
      setBalance(balance + position);
      setPosition(null);
    }
  };

  return (
    <div style={{ padding: "10px", background: "#111", borderRadius: "8px" }}>
      <h3>Painel de Trade</h3>
      <p>Saldo: ${balance}</p>
      <p>Posição: {position ? `$${position}` : "Nenhuma"}</p>
      <button onClick={buy} style={{ marginRight: "10px" }}>Comprar</button>
      <button onClick={sell}>Vender</button>
    </div>
  );
}
