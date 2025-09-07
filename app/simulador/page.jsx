// app/simulador/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------
   Simulador – versão visual refinada (dark, responsivo)
   - Preço ao vivo (CoinGecko)
   - Saldo, posição, comprar/vender, reset
   - Histórico em tabela (bonita), estados vazios/erro
-------------------------------------------------------- */

const COINS = [
  { id: "bitcoin", label: "Bitcoin (BTC)" },
  { id: "ethereum", label: "Ethereum (ETH)" },
  { id: "solana", label: "Solana (SOL)" },
  { id: "binancecoin", label: "BNB" },
  { id: "cardano", label: "Cardano (ADA)" },
  { id: "ripple", label: "XRP" },
  { id: "chainlink", label: "Chainlink (LINK)" },
  { id: "dogecoin", label: "Dogecoin (DOGE)" },
];

const fmtUSD = (v) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number.isFinite(v) ? v : 0
  );

export default function SimuladorBonito() {
  // estado principal
  const [moeda, setMoeda] = useState("bitcoin");
  const [preco, setPreco] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const [saldo, setSaldo] = useState(10000);
  const [qtd, setQtd] = useState(0);
  const [tamanhoOrdem, setTamanhoOrdem] = useState(100); // em USDT
  const [historico, setHistorico] = useState([]);

  // preço ao vivo (CoinGecko)
  useEffect(() => {
    let cancelado = false;

    async function fetchPreco() {
      setCarregando(true);
      setErro("");
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${moeda}&vs_currencies=usd`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Falha ao buscar preço");
        const data = await res.json();
        if (!cancelado) setPreco(data[moeda]?.usd ?? 0);
      } catch (e) {
        if (!cancelado) setErro("Não foi possível atualizar o preço agora.");
        console.error(e);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    fetchPreco();
    const id = setInterval(fetchPreco, 15000);
    return () => {
      cancelado = true;
      clearInterval(id);
    };
  }, [moeda]);

  const valorPosicao = useMemo(() => qtd * preco, [qtd, preco]);
  const pnl = useMemo(() => valorPosicao, [valorPosicao]); // como é spot simples, sem entrada fixa

  function comprar() {
    if (preco <= 0 || tamanhoOrdem <= 0 || tamanhoOrdem > saldo) return;
    const q = tamanhoOrdem / preco;
    setQtd((x) => x + q);
    setSaldo((s) => s - tamanhoOrdem);
    setHistorico((h) => [
      {
        tipo: "Compra",
        preco,
        qtd: q,
        data: new Date().toISOString(),
      },
      ...h,
    ]);
  }

  function vender() {
    if (qtd <= 0 || preco <= 0) return;
    const valor = qtd * preco;
    setSaldo((s) => s + valor);
    setHistorico((h) => [
      {
        tipo: "Venda",
        preco,
        qtd,
        data: new Date().toISOString(),
      },
      ...h,
    ]);
    setQtd(0);
  }

  function resetar() {
    if (!confirm("Deseja resetar saldo, posição e histórico?")) return;
    setSaldo(10000);
    setQtd(0);
    setHistorico([]);
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 text-gray-100">
      {/* topo */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Simulador de Trading
            </h1>
            <p className="text-sm text-gray-400">
              Treine estratégias de forma segura — dados ao vivo, sem risco real.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={moeda}
              onChange={(e) => setMoeda(e.target.value)}
              className="rounded-xl bg-gray-900 px-3 py-2 text-sm ring-1 ring-gray-800 outline-none focus:ring-indigo-500"
            >
              {COINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <button
              onClick={resetar}
              className="rounded-xl bg-gray-800 px-3 py-2 text-sm ring-1 ring-gray-700 hover:bg-gray-700"
            >
              Resetar
            </button>
          </div>
        </div>

        {/* cards principais */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card Preço */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5 shadow">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">
              Preço atual
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold leading-tight">
                {carregando ? "..." : fmtUSD(preco)}
              </div>
              <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
                {COINS.find((c) => c.id === moeda)?.label}
              </span>
            </div>
            {erro && (
              <p className="mt-2 text-sm text-amber-400">
                {erro} — tente novamente em instantes.
              </p>
            )}
          </div>

          {/* Card Saldo / Posição */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5 shadow">
            <div className="mb-2 text-xs uppercase tracking-wide text-gray-400">
              Sua conta (demo)
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Saldo</span>
                <span className="text-xl font-semibold">{fmtUSD(saldo)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Quantidade</span>
                <span className="font-mono">{qtd.toFixed(6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Valor da posição</span>
                <span className="font-semibold">{fmtUSD(valorPosicao)}</span>
              </div>
              <div
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  pnl >= 0 ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                }`}
              >
                <span>P&L (não realizado)</span>
                <span className="font-semibold">{fmtUSD(pnl)}</span>
              </div>
            </div>
          </div>

          {/* Card Ações */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-5 shadow">
            <div className="mb-3 text-xs uppercase tracking-wide text-gray-400">
              Ações
            </div>

            <label className="mb-2 block text-sm text-gray-300">
              Tamanho da ordem (USDT)
            </label>
            <input
              type="number"
              min={10}
              step={10}
              value={tamanhoOrdem}
              onChange={(e) =>
                setTamanhoOrdem(Math.max(0, Number(e.target.value || 0)))
              }
              className="mb-4 w-full rounded-xl bg-gray-900 px-3 py-2 font-mono ring-1 ring-gray-800 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="100"
            />
            <div className="mb-4 text-right text-xs text-gray-500">
              ≈ {(tamanhoOrdem / (preco || 1)).toFixed(6)} {COINS.find((c) => c.id === moeda)?.label.split(" ")[1]?.replace(/[()]/g,"")}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={comprar}
                className="rounded-2xl bg-green-600 px-4 py-3 font-semibold shadow hover:bg-green-500 disabled:opacity-50"
                disabled={preco <= 0 || tamanhoOrdem <= 0 || tamanhoOrdem > saldo}
                title={
                  tamanhoOrdem > saldo
                    ? "Saldo insuficiente"
                    : tamanhoOrdem <= 0
                    ? "Informe um valor > 0"
                    : ""
                }
              >
                Comprar
              </button>
              <button
                onClick={vender}
                className="rounded-2xl bg-red-600 px-4 py-3 font-semibold shadow hover:bg-red-500 disabled:opacity-50"
                disabled={qtd <= 0}
                title={qtd <= 0 ? "Sem posição para vender" : ""}
              >
                Vender
              </button>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-gray-500">
              Este simulador é apenas educacional. Não constitui recomendação
              de investimento. Os dados podem sofrer atrasos ocasionais.
            </p>
          </div>
        </div>

        {/* Histórico */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-5 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Histórico de operações</h2>
            {historico.length > 0 && (
              <button
                onClick={() => setHistorico([])}
                className="rounded-xl bg-gray-800 px-3 py-2 text-xs ring-1 ring-gray-700 hover:bg-gray-700"
              >
                Limpar histórico
              </button>
            )}
          </div>

          {historico.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              Sem operações por enquanto. Faça uma compra ou venda para começar.
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-900/60 text-left text-gray-300">
                  <tr>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">Moeda</th>
                    <th className="px-3 py-2">Preço</th>
                    <th className="px-3 py-2">Qtd</th>
                    <th className="px-3 py-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((h, i) => (
                    <tr key={i} className="border-t border-gray-800">
                      <td className="px-3 py-2 text-gray-400">
                        {new Date(h.data).toLocaleString()}
                      </td>
                      <td
                        className={
                          "px-3 py-2 font-semibold " +
                          (h.tipo === "Compra" ? "text-green-400" : "text-red-400")
                        }
                      >
                        {h.tipo}
                      </td>
                      <td className="px-3 py-2">
                        {COINS.find((c) => c.id === moeda)?.label || moeda}
                      </td>
                      <td className="px-3 py-2 font-mono">{fmtUSD(h.preco)}</td>
                      <td className="px-3 py-2 font-mono">{h.qtd.toFixed(6)}</td>
                      <td className="px-3 py-2 font-mono">
                        {fmtUSD(h.qtd * h.preco)}
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
