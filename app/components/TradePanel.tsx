// app/components/TradePanel.tsx
"use client";

import { useState } from "react";

export default function TradePanel() {
  const [amount, setAmount] = useState<number>(0);

  const handleBuy = () => alert(`Você comprou ${amount} moedas 🚀`);
  const handleSell = () => alert(`Você vendeu ${amount} moedas 📉`);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Painel de Trade</h2>
      <input
        type="number"
        placeholder="Quantidade"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handleBuy} style={{ marginRight: "10px" }}>
        Comprar
      </button>
      <button onClick={handleSell}>Vender</button>
    </div>
  );
}
