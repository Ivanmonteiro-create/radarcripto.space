"use client";

import React, { useMemo, useState } from "react";

type Side = "LONG" | "SHORT" | null;

type Fill = {
  time: string;
  side: "BUY" | "SELL";
  qty: number;
  price: number;
  pnl?: number; // preenchido no fechamento
};

const START_EQUITY = 10000;

export default function TradePanel() {
  const [equity, setEquity] = useState<number>(START_EQUITY);

  const [side, setSide] = useState<Side>(null);
  const [avgPrice, setAvgPrice] = useState<number>(0);
  const [qty, setQty] = useState<number>(0);
  const [price, setPrice] = useState<number>(0); // preço “atual” digitado
  const [fills, setFills] = useState<Fill[]>([]);

  // PnL não-realizado
  const unrealizedPnL = useMemo(() => {
    if (!side || qty === 0 || price <= 0) return 0;

    if (side === "LONG") {
      return (price - avgPrice) * qty;
    } else {
      return (avgPrice - price) * qty;
    }
  }, [side, qty, price, avgPrice]);

  function addFill(fill: Fill) {
    setFills((prev) => [{ ...fill, time: new Date().toLocaleString() }, ...prev]);
  }

  function onBuy() {
    if (price <= 0) return alert("Informe um preço válido.");
    const buyQty = Number(prompt("Quantidade a comprar:", "0.1")) || 0;
    if (buyQty <= 0) return;

    if (side === "SHORT") {
      // reduz/fecha short
      const closeQty = Math.min(qty, buyQty);
      const realized = (avgPrice - price) * closeQty; // lucro de short
      setEquity((e) => e + realized);
      addFill({ side: "BUY", qty: closeQty, price, pnl: realized });

      const remaining = qty - closeQty;
      if (remaining === 0) {
        setSide(null);
        setAvgPrice(0);
        setQty(0);
      } else {
        setQty(remaining);
      }

      // se comprou mais do que precisava pra zerar, abre LONG no excedente
      const leftover = buyQty - closeQty;
      if (leftover > 0) {
        // nova posição LONG a partir do excedente
        setSide("LONG");
        setAvgPrice(price);
        setQty(leftover);
        addFill({ side: "BUY", qty: leftover, price });
      }
    } else if (side === "LONG") {
      // média de preço da long
      const newQty = qty + buyQty;
      const newAvg = (avgPrice * qty + price * buyQty) / newQty;
      setQty(newQty);
      setAvgPrice(newAvg);
      setSide("LONG");
      addFill({ side: "BUY", qty: buyQty, price });
    } else {
      // abrir LONG do zero
      setSide("LONG");
      setAvgPrice(price);
      setQty(buyQty);
      addFill({ side: "BUY", qty: buyQty, price });
    }
  }

  function onSell() {
    if (price <= 0) return alert("Informe um preço válido.");
    const sellQty = Number(prompt("Quantidade a vender:", "0.1")) || 0;
    if (sellQty <= 0) return;

    if (side === "LONG") {
      // reduz/fecha long
      const closeQty = Math.min(qty, sellQty);
      const realized = (price - avgPrice) * closeQty; // lucro de long
      setEquity((e) => e + realized);
      addFill({ side: "SELL", qty: closeQty, price, pnl: realized });

      const remaining = qty - closeQty;
      if (remaining === 0) {
        setSide(null);
        setAvgPrice(0);
        setQty(0);
      } else {
        setQty(remaining);
      }

      // se vendeu mais do que precisava pra zerar, abre SHORT no excedente
      const leftover = sellQty - closeQty;
      if (leftover > 0) {
        setSide("SHORT");
        setAvgPrice(price);
        setQty(leftover);
        addFill({ side: "SELL", qty: leftover, price });
      }
    } else if (side === "SHORT") {
      // média de preço da short
      const newQty = qty + sellQty;
      const newAvg = (avgPrice * qty + price * sellQty) / newQty;
      setQty(newQty);
      setAvgPrice(newAvg);
      setSide("SHORT");
      addFill({ side: "SELL", qty: sellQty, price });
    } else {
      // abrir SHORT do zero
      setSide("SHORT");
      setAvgPrice(price);
      setQty(sellQty);
      addFill({ side: "SELL", qty: sellQty, price });
    }
  }

  function onClosePosition() {
    if (!side || qty === 0) return;
    if (price <= 0) return alert("Informe um preço válido.");

    let realized = 0;
    if (side === "LONG") realized = (price - avgPrice) * qty;
    if (side === "SHORT") realized = (avgPrice - price) * qty;

    setEquity((e) => e + realized);
    addFill({
      side: side === "LONG" ? "SELL" : "BUY",
      qty,
      price,
      pnl: realized,
    });

    setSide(null);
    setAvgPrice(0);
    setQty(0);
  }

  function onReset() {
    if (!confirm("Resetar tudo?")) return;
    setEquity(START_EQUITY);
    setSide(null);
    setAvgPrice(0);
    setQty(0);
    setPrice(0);
    setFills([]);
  }

  return (
    <div
      style={{
        background: "#151a21",
        color: "#e8eef6",
        border: "1px solid #222b36",
        padding: 16,
        borderRadius: 12,
        maxWidth: 900,
        margin: "24px auto",
      }}
    >
      <h2 style={{ marginTop: 0 }}>Painel de Trade (demo)</h2>

      {/* Linha de status */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Stat label="Equity" value={`$ ${equity.toFixed(2)}`} />
        <Stat label="Posição" value={side ?? "—"} />
        <Stat label="Qtd" value={qty.toFixed(4)} />
        <Stat label="Preço médio" value={avgPrice ? avgPrice.toFixed(2) : "—"} />
        <Stat
          label="PnL não-realizado"
          value={(unrealizedPnL >= 0 ? "+ " : "− ") + Math.abs(unrealizedPnL).toFixed(2)}
        />
      </div>

      {/* Controles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 16,
        }}
      >
        <div
          style={{
            border: "1px solid #222b36",
            borderRadius: 10,
            padding: 12,
          }}
        >
          <label style={{ display: "block", marginBottom: 8 }}>Preço atual</label>
          <input
            type="number"
            step="0.01"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Ex: 117000.00"
            style={{
              width: "100%",
              background: "#0f1216",
              color: "#e8eef6",
              border: "1px solid #293241",
              borderRadius: 8,
              padding: "10px 12px",
            }}
          />
          <p style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>
            Dica: pegue o preço pelo crosshair do TradingView e digite aqui.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 8,
            alignContent: "start",
          }}
        >
          <button className="btn-green" onClick={onBuy}>
            Comprar (LONG)
          </button>
          <button className="btn-red" onClick={onSell}>
            Vender (SHORT)
          </button>
          <button className="btn-gray" onClick={onClosePosition}>
            Fechar posição
          </button>
          <button className="btn-gray" onClick={onReset}>
            Resetar
          </button>
        </div>
      </div>

      {/* Histórico */}
      <div style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 8 }}>Histórico</h3>
        {fills.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Sem operações ainda.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 520,
                border: "1px solid #222b36",
              }}
            >
              <thead>
                <tr>
                  <Th>Data/Hora</Th>
                  <Th>Side</Th>
                  <Th>Qtd</Th>
                  <Th>Preço</Th>
                  <Th>Realizado</Th>
                </tr>
              </thead>
              <tbody>
                {fills.map((f, i) => (
                  <tr key={i}>
                    <Td>{f.time}</Td>
                    <Td>{f.side}</Td>
                    <Td>{f.qty}</Td>
                    <Td>{f.price.toFixed(2)}</Td>
                    <Td style={{ color: f.pnl ? (f.pnl >= 0 ? "#16a34a" : "#ef4444") : "#e8eef6" }}>
                      {f.pnl !== undefined ? f.pnl.toFixed(2) : "—"}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .btn-green,
        .btn-red,
        .btn-gray {
          padding: 12px 10px;
          border: 0;
          border-radius: 10px;
          cursor: pointer;
          color: white;
          font-weight: 600;
          background: #334155;
        }
        .btn-green {
          background: #16a34a;
        }
        .btn-red {
          background: #ef4444;
        }
        .btn-gray {
          background: #334155;
        }
        .btn-green:hover {
          filter: brightness(1.05);
        }
        .btn-red:hover {
          filter: brightness(1.05);
        }
        .btn-gray:hover {
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#0f1216",
        border: "1px solid #222b36",
        borderRadius: 10,
        padding: "10px 12px",
        minWidth: 150,
      }}
    >
      <div style={{ opacity: 0.7, fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 18, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        borderBottom: "1px solid #222b36",
        background: "#0f1216",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: "10px 12px", borderBottom: "1px solid #222b36", ...style }}>{children}</td>
  );
}
