"use client";

import React, { useMemo, useState } from "react";

/** Tipos básicos */
type Side = "BUY" | "SELL";

type Fill = {
  time: number;      // timestamp (ms)
  side: Side;
  qty: number;
  price: number;
  pnl: number;       // PnL realizado deste fill
};

type Position =
  | {
      side: Side;
      qty: number;        // quantidade aberta
      avgPrice: number;   // preço médio
    }
  | null;

/** Componente */
export default function TradePanel() {
  // Configuração simples
  const START_EQUITY = 10000;

  // Estados principais
  const [equity, setEquity] = useState<number>(START_EQUITY);
  const [position, setPosition] = useState<Position>(null);
  const [qty, setQty] = useState<number>(0.1);
  const [price, setPrice] = useState<number>(0); // usuário informa o preço atual manualmente
  const [fills, setFills] = useState<Fill[]>([]);

  // Helper seguro: registra um fill e injeta o time
  const addFill = (p: Omit<Fill, "time">) => {
    setFills((prev) => [{ time: Date.now(), ...p }, ...prev]);
  };

  // PnL não realizado (mark-to-market)
  const unrealizedPnl = useMemo(() => {
    if (!position || price <= 0) return 0;
    const dir = position.side === "BUY" ? 1 : -1;
    return (price - position.avgPrice) * position.qty * dir;
  }, [position, price]);

  // Valor da conta (equity + PnL não realizado)
  const accountValue = useMemo(() => equity + unrealizedPnl, [equity, unrealizedPnl]);

  /** Abrir/Aumentar/Reduzir posição */
  const execute = (side: Side) => {
    if (price <= 0 || qty <= 0) return;

    // Se não existe posição, abrimos uma
    if (!position) {
      setPosition({ side, qty, avgPrice: price });
      addFill({ side, qty, price, pnl: 0 });
      return;
    }

    // Mesma direção -> aumenta posição e recalcula preço médio
    if (position.side === side) {
      const newQty = round(position.qty + qty);
      const newAvg =
        (position.avgPrice * position.qty + price * qty) / (position.qty + qty);
      setPosition({ side, qty: newQty, avgPrice: newAvg });
      addFill({ side, qty, price, pnl: 0 });
      return;
    }

    // Direção oposta -> reduz/fecha posição existente
    // Quantidade que será fechada nesta execução
    const closeQty = Math.min(position.qty, qty);

    // PnL realizado desta redução
    const dir = position.side === "BUY" ? 1 : -1; // BUY ganha quando preço sobe
    const realized = (price - position.avgPrice) * closeQty * dir;

    setEquity((e) => e + realized);
    addFill({ side, qty: closeQty, price, pnl: realized });

    // Atualiza posição remanescente
    const remaining = round(position.qty - closeQty);

    if (remaining === 0) {
      // posição fechada
      if (qty > closeQty) {
        // sobrou lote para abrir na direção oposta
        const openQty = round(qty - closeQty);
        setPosition({ side, qty: openQty, avgPrice: price });
      } else {
        setPosition(null);
      }
    } else {
      // reduzimos apenas
      setPosition({ side: position.side, qty: remaining, avgPrice: position.avgPrice });
    }
  };

  /** Fecha 100% da posição ao preço informado */
  const closePosition = () => {
    if (!position || price <= 0) return;
    const sideToClose: Side = position.side === "BUY" ? "SELL" : "BUY";
    const dir = position.side === "BUY" ? 1 : -1;
    const realized = (price - position.avgPrice) * position.qty * dir;
    setEquity((e) => e + realized);
    addFill({ side: sideToClose, qty: position.qty, price, pnl: realized });
    setPosition(null);
  };

  /** Reset total */
  const resetAll = () => {
    setEquity(START_EQUITY);
    setPosition(null);
    setQty(0.1);
    setPrice(0);
    setFills([]);
  };

  /** Helpers de UI */
  const setPresetQty = (val: number) => setQty(val);
  const round = (n: number) => Math.round(n * 1000000) / 1000000;

  return (
    <div style={styles.wrapper}>
      {/* Cabeçalho */}
      <div style={styles.headerRow}>
        <h2 style={{ margin: 0 }}>Painel de Trade (simulador)</h2>
        <button style={styles.resetBtn} onClick={resetAll} title="Resetar tudo">
          Resetar
        </button>
      </div>

      {/* Linha 1: Equity e posição */}
      <div style={styles.row}>
        <InfoCard label="Equity (USD)" value={equity} />
        <InfoCard label="Valor da Conta" value={accountValue} />
        <InfoCard
          label="Posição"
          value={
            position
              ? `${position.side} ${position.qty} @ ${position.avgPrice}`
              : "—"
          }
        />
        <InfoCard label="PnL não realizado" value={unrealizedPnl} colored />
      </div>

      {/* Linha 2: Preço e Quantidade */}
      <div style={styles.row}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Preço atual</div>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={price || ""}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="ex: 116000.00"
            style={styles.input}
          />
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            (Informe o preço do TradingView manualmente)
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Quantidade</div>
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={qty}
            onChange={(e) => setQty(Math.max(0, Number(e.target.value)))}
            style={styles.input}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {[0.1, 0.5, 1, 5].map((v) => (
              <button key={v} style={styles.qtyBtn} onClick={() => setPresetQty(v)}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Linha 3: Botões de ação */}
      <div style={styles.row}>
        <button style={{ ...styles.actionBtn, background: "#16a34a" }} onClick={() => execute("BUY")}>
          Comprar
        </button>
        <button style={{ ...styles.actionBtn, background: "#dc2626" }} onClick={() => execute("SELL")}>
          Vender
        </button>
        <button style={{ ...styles.actionBtn, background: "#6b7280" }} onClick={closePosition}>
          Fechar posição
        </button>
      </div>

      {/* Histórico */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Histórico</div>
        {fills.length === 0 ? (
          <div style={{ opacity: 0.7 }}>Sem operações ainda.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Lado</th>
                <th>Qtd</th>
                <th>Preço</th>
                <th>PnL</th>
              </tr>
            </thead>
            <tbody>
              {fills.map((f, i) => (
                <tr key={i}>
                  <td>{new Date(f.time).toLocaleTimeString()}</td>
                  <td>{f.side}</td>
                  <td>{f.qty}</td>
                  <td>{f.price}</td>
                  <td style={{ color: f.pnl > 0 ? "#16a34a" : f.pnl < 0 ? "#dc2626" : undefined }}>
                    {f.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/** Subcomponente de informação rápida */
function InfoCard(props: { label: string; value: number | string; colored?: boolean }) {
  const { label, value, colored } = props;
  const isNum = typeof value === "number";
  const color =
    colored && isNum ? (value > 0 ? "#16a34a" : value < 0 ? "#dc2626" : "#e5e7eb") : "#e5e7eb";

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{isNum ? value.toFixed(2) : value}</div>
    </div>
  );
}

/** Estilos inline simples (sem Tailwind para evitar dependências) */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 16,
    background: "#0f1216",
    color: "#e8eef6",
    borderRadius: 12,
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  card: {
    background: "#151a21",
    border: "1px solid #1f2937",
    borderRadius: 12,
    padding: 12,
    minWidth: 260,
    flex: "1 1 260px",
  },
  cardTitle: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    background: "#0b0f14",
    border: "1px solid #334155",
    color: "#e8eef6",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
  },
  qtyBtn: {
    background: "#0b0f14",
    border: "1px solid #334155",
    color: "#e8eef6",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
  },
  actionBtn: {
    flex: "1 1 180px",
    minWidth: 180,
    border: "none",
    color: "white",
    fontWeight: 700 as const,
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
  },
  resetBtn: {
    background: "#111827",
    border: "1px solid #374151",
    color: "#e8eef6",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};
