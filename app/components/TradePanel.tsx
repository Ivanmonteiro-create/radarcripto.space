"use client";
import React from "react";

type Side = "BUY" | "SELL";
type Fill = { time: string; side: Side; qty: number; price: number };

type State = {
  balance: number;        // caixa (USD)
  realizedPnl: number;    // PnL realizado acumulado
  positionQty: number;    // +long / -short (em “unidades” do ativo)
  avgPrice: number;       // preço médio da posição aberta (0 se não há posição)
  fills: Fill[];          // histórico de execuções
};

const FEE_RATE = 0.001;   // 0.10%

const LS_KEY = "rcp_sim_state_v1";

function loadState(): State {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as State;
    // sanity defaults
    return {
      balance: parsed.balance ?? 100_000,
      realizedPnl: parsed.realizedPnl ?? 0,
      positionQty: parsed.positionQty ?? 0,
      avgPrice: parsed.avgPrice ?? 0,
      fills: Array.isArray(parsed.fills) ? parsed.fills : [],
    };
  } catch {
    return defaultState;
  }
}

const defaultState: State = {
  balance: 100_000,
  realizedPnl: 0,
  positionQty: 0,
  avgPrice: 0,
  fills: [],
};

export default function TradePanel() {
  const [state, setState] = React.useState<State>(defaultState);
  const [price, setPrice] = React.useState<number>(10000);
  const [qty, setQty] = React.useState<number>(1);

  // carregar do localStorage
  React.useEffect(() => {
    setState(loadState());
  }, []);

  // salvar a cada mudança
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LS_KEY, JSON.stringify(state));
    }
  }, [state]);

  const equity = state.balance + state.realizedPnl + unrealizedPnl(state, price);

  function unrealizedPnl(s: State, mark: number) {
    if (s.positionQty === 0) return 0;
    const diff = (mark - s.avgPrice) * s.positionQty; // se qty < 0 vira short
    return diff;
  }

  function addFill(side: Side, q: number, p: number) {
    setState((prev) => ({
      ...prev,
      fills: [{ time: new Date().toLocaleTimeString(), side, qty: q, price: p }, ...prev.fills].slice(0, 100),
    }));
  }

  function trade(side: Side) {
    if (qty <= 0 || price <= 0) return;

    // custo bruto e taxa
    const notional = qty * price;
    const fee = notional * FEE_RATE;

    setState((prev) => {
      let { balance, realizedPnl, positionQty, avgPrice } = prev;

      if (side === "BUY") {
        // se estamos short (qty negativa) e compramos, pode fechar parcial/total
        if (positionQty < 0) {
          const closingQty = Math.min(qty, Math.abs(positionQty));
          // PnL realizado sobre a parte fechada
          realizedPnl += (avgPrice - price) * closingQty; // short: ganha quando preço cai
          positionQty += closingQty; // aproximando a zero
          // taxa
          balance -= fee;
          // ainda há sobra para abrir long?
          const remainder = qty - closingQty;
          if (remainder > 0) {
            // abre/incrementa long
            const newNotional = remainder * price;
            const newQty = positionQty + remainder; // agora >= 0
            avgPrice = newQty === 0 ? 0 : (positionQty * avgPrice + remainder * price) / newQty;
            positionQty = newQty;
            balance -= newNotional * FEE_RATE; // taxa da sobra também
          }
        } else {
          // abrir/incrementar long
          const newQty = positionQty + qty;
          avgPrice = newQty === 0 ? 0 : (positionQty * avgPrice + qty * price) / newQty;
          positionQty = newQty;
          balance -= fee;
        }
      } else {
        // SELL
        if (positionQty > 0) {
          const closingQty = Math.min(qty, Math.abs(positionQty));
          realizedPnl += (price - avgPrice) * closingQty; // long: ganha quando sobe
          positionQty -= closingQty;
          balance -= fee;
          const remainder = qty - closingQty;
          if (remainder > 0) {
            // abre/incrementa short
            const newQty = positionQty - remainder; // mais negativo
            avgPrice = newQty === 0 ? 0 : (positionQty * avgPrice + remainder * price) / newQty;
            positionQty = newQty;
            balance -= (remainder * price) * FEE_RATE;
          }
        } else {
          // abrir/incrementar short
          const newQty = positionQty - qty; // vai diminuindo
          avgPrice = newQty === 0 ? 0 : (positionQty * avgPrice + qty * price) / Math.abs(newQty) * (newQty < 0 ? -1 : 1);
          // a fórmula acima mantém avgPrice numericamente correto; alternativa simples:
          avgPrice = positionQty === 0 ? price : avgPrice; // para short simples, isso basta
          positionQty = newQty;
          balance -= fee;
        }
      }

      addFill(side, qty, price);
      return { balance, realizedPnl, positionQty, avgPrice: positionQty === 0 ? 0 : avgPrice, fills: prev.fills };
    });
  }

  function zeroPosition() {
    setState((prev) => {
      if (prev.positionQty === 0) return prev;
      const p = price;
      let realizedPnl = prev.realizedPnl;
      if (prev.positionQty > 0) {
        // fechar long
        realizedPnl += (p - prev.avgPrice) * prev.positionQty;
      } else {
        // fechar short
        realizedPnl += (prev.avgPrice - p) * Math.abs(prev.positionQty);
      }
      const fee = Math.abs(prev.positionQty) * p * FEE_RATE;
      addFill(prev.positionQty > 0 ? "SELL" : "BUY", Math.abs(prev.positionQty), p);
      return {
        ...prev,
        realizedPnl,
        positionQty: 0,
        avgPrice: 0,
        balance: prev.balance - fee,
      };
    });
  }

  function resetAccount() {
    setState(defaultState);
  }

  return (
    <div style={panelShell}>
      <h2 style={title}>Painel de Trade</h2>

      <div style={row}>
        <div style={statBox}>
          <div style={statLabel}>Créditos</div>
          <div style={statValue}>US$ {state.balance.toLocaleString()}</div>
        </div>
        <div style={statBox}>
          <div style={statLabel}>Lucro Realizado</div>
          <div style={{...statValue, color: state.realizedPnl >= 0 ? "#12d98a" : "#ff6b6b"}}>
            US$ {state.realizedPnl.toFixed(2)}
          </div>
        </div>
        <div style={statBox}>
          <div style={statLabel}>Equity (c/ não realizado)</div>
          <div style={{...statValue, color: equity >= state.balance ? "#12d98a" : "#ff6b6b"}}>
            US$ {equity.toFixed(2)}
          </div>
        </div>
      </div>

      <div style={row}>
        <label style={label}>Preço</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={input}
        />
        <label style={label}>Qtd</label>
        <input
          type="number"
          value={qty}
          min={0}
          onChange={(e) => setQty(Number(e.target.value))}
          style={input}
        />

        <button onClick={() => trade("BUY")} style={{...btn, background:"#16a34a"}}>Buy</button>
        <button onClick={() => trade("SELL")} style={{...btn, background:"#dc2626"}}>Sell</button>
        <button onClick={zeroPosition} style={{...btn, background:"#334155"}}>Zerar posição</button>
        <button onClick={resetAccount} style={{...btn, background:"#0ea5e9"}}>Resetar conta</button>
      </div>

      <div style={posBox}>
        <div>Posição: <b>{state.positionQty}</b> @ {state.avgPrice ? state.avgPrice.toFixed(2) : "-"}</div>
        <div>PNL não realizado (mark={price}):{" "}
          <b style={{color: unrealizedPnl(state, price) >= 0 ? "#12d98a" : "#ff6b6b"}}>
            US$ {unrealizedPnl(state, price).toFixed(2)}
          </b>
        </div>
        <div style={{opacity:.6, fontSize:12}}>Taxa por ordem: {(FEE_RATE*100).toFixed(2)}%</div>
      </div>

      <h3 style={{margin:"12px 0 6px"}}>Fills</h3>
      <div style={fillsTable}>
        <div style={fillsHead}>
          <span>Hora</span><span>Lado</span><span>Qtd</span><span>Preço</span>
        </div>
        <div>
          {state.fills.length === 0 ? (
            <div style={{opacity:.5, padding:"6px"}}>Nenhum ainda</div>
          ) : state.fills.map((f, i) => (
            <div key={i} style={fillsRow}>
              <span>{f.time}</span>
              <span style={{color: f.side === "BUY" ? "#12d98a" : "#ff6b6b"}}>{f.side}</span>
              <span>{f.qty}</span>
              <span>{f.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======== estilos inline simples (seguindo seu visual) ======== */
const panelShell: React.CSSProperties = {
  background:"#0b1220",
  border:"1px solid #1f2a44",
  borderRadius:10,
  padding:"12px 12px 16px",
  color:"#e6eef8",
};
const title: React.CSSProperties = { margin:"0 0 8px", fontSize:20, letterSpacing:.2 };
const row: React.CSSProperties = { display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", margin:"6px 0" };
const label: React.CSSProperties = { fontSize:12, opacity:.7 };
const input: React.CSSProperties = { background:"#0f172a", color:"#e6eef8", border:"1px solid #23314f", padding:"6px 8px", borderRadius:6, width:110 };
const btn: React.CSSProperties = { color:"#fff", border:"none", padding:"8px 10px", borderRadius:8, cursor:"pointer" };
const statBox: React.CSSProperties = { background:"#0f172a", border:"1px solid #23314f", borderRadius:8, padding:"8px 10px", minWidth:180 };
const statLabel: React.CSSProperties = { fontSize:12, opacity:.7, marginBottom:4 };
const statValue: React.CSSProperties = { fontSize:18, fontWeight:700 };
const posBox: React.CSSProperties = { background:"#0f172a", border:"1px solid #23314f", borderRadius:8, padding:"8px 10px", marginTop:6, display:"flex", gap:16, flexWrap:"wrap" };
const fillsTable: React.CSSProperties = { border:"1px solid #23314f", borderRadius:8, overflow:"hidden" };
const fillsHead: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", background:"#101a33", padding:"6px 8px", fontSize:12, opacity:.8 };
const fillsRow: React.CSSProperties = { display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"6px 8px", borderTop:"1px solid #1a2744", fontSize:13 };
