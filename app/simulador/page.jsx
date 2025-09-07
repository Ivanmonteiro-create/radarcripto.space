// app/simulador/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function Simulador() {
  const [saldo, setSaldo] = useState(10000); // saldo inicial
  const [moeda, setMoeda] = useState("bitcoin");
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar preço em tempo real da CoinGecko
  useEffect(() => {
    async function fetchPreco() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${moeda}&vs_currencies=usd`
        );
        const data = await res.json();
        setPreco(data[moeda].usd);
      } catch (err) {
        console.error("Erro ao buscar preço:", err);
      }
      setLoading(false);
    }

    fetchPreco();
    const interval = setInterval(fetchPreco, 15000); // atualiza a cada 15s
    return () => clearInterval(interval);
  }, [moeda]);

  // Função de compra
  const comprar = () => {
    if (saldo <= 0 || preco <= 0) return;
    const qtd = saldo / preco;
    setQuantidade(qtd);
    setSaldo(0);
    setHistorico([
      ...historico,
      { tipo: "Compra", moeda, preco, qtd, data: new Date().toLocaleString() },
    ]);
  };

  // Função de venda
  const vender = () => {
    if (quantidade <= 0) return;
    const valor = quantidade * preco;
    setSaldo(valor);
    setHistorico([
      ...historico,
      { tipo: "Venda", moeda, preco, qtd: quantidade, data: new Date().toLocaleString() },
    ]);
    setQuantidade(0);
  };

  // Resetar simulador
  const resetar = () => {
    setSaldo(10000);
    setQuantidade(0);
    setHistorico([]);
  };

  // Formatar valores em USD
  const formatarUSD = (valor) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Simulador de Trading</h1>

      <div className="mb-4">
        <label className="block mb-2">Escolha a moeda:</label>
        <select
          value={moeda}
          onChange={(e) => setMoeda(e.target.value)}
          className="p-2 bg-gray-800 rounded"
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
          <option value="binancecoin">BNB</option>
          <option value="cardano">Cardano (ADA)</option>
          <option value="ripple">XRP</option>
          <option value="chainlink">Chainlink (LINK)</option>
          <option value="dogecoin">Dogecoin (DOGE)</option>
        </select>
      </div>

      <p className="mb-2">💰 Saldo: {formatarUSD(saldo)}</p>
      <p className="mb-4">
        📊 Preço atual ({moeda}):{" "}
        {loading ? "Carregando..." : formatarUSD(preco)}
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={comprar}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          Comprar
        </button>
        <button
          onClick={vender}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Vender
        </button>
        <button
          onClick={resetar}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
        >
          Resetar
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Histórico de Operações</h2>
      {historico.length === 0 ? (
        <p>Nenhuma operação realizada ainda.</p>
      ) : (
        <ul className="space-y-2">
          {historico.map((op, index) => (
            <li
              key={index}
              className="bg-gray-800 p-3 rounded flex justify-between"
            >
              <span>
                {op.tipo} {op.qtd.toFixed(6)} {op.moeda} a {formatarUSD(op.preco)}
              </span>
              <span className="text-sm text-gray-400">{op.data}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
