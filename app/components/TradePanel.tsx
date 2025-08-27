'use client';

import React, { useMemo, useState } from 'react';

// Tipos
type Side = 'BUY' | 'SELL';

type Fill = {
  time: string;
  side: Side;
  qty: number;
  price: number;
  realized?: number; // PnL realizado nesta execução (se fechar posição)
};

type Goal = {
  id: string;
  label: string;
  target: number;
  value: number;
  unit?: string;
};

// Estilos rápidos
const card: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(180deg,#0f172a,#0b1224)',
  borderRadius: 12,
  padding: 12,
  boxShadow: '0 0 0 1px rgba(255,255,255,0.06) inset, 0 8px 30px rgba(0,0,0,.35)',
  color: '#e5e7eb',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const row: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center' };
const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8 };

const stat: React.CSSProperties = {
  background: 'rgba(2,6,23,0.6)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10,
  padding: 10,
};

const statTitle: React.CSSProperties = { fontSize: 12, opacity: 0.8 };
const statValue: React.CSSProperties = { fontSize: 16, fontWeight: 800 };

const input: React.CSSProperties = {
  background: '#0b1224',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#e2e8f0',
  borderRadius: 8,
  padding: '8px 10px',
  width: '100%',
  outline: 'none',
};

const select: React.CSSProperties = input;

const btn: React.CSSProperties = {
  background: '#1f2937',
  color: '#e5e7eb',
  border: 'none',
  borderRadius: 10,
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
};

const btnBuy: React.CSSProperties = { ...btn, background: '#10b981', color: '#052e2b' };
const btnSell: React.CSSProperties = { ...btn, background: '#ef4444', color: '#3b0a0a' };
const btnReset: React.CSSProperties = { ...btn, background: '#334155' };
const btnCTA: React.CSSProperties = {
  ...btn,
  background: '#f59e0b',
  color: '#0b1224',
  width: '100%',
  marginTop: 6,
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 12,
};

const thtd: React.CSSProperties = {
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  padding: '6px 8px',
  textAlign: 'left',
};

const tabs: React.CSSProperties = { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' };
const tabBtn = (active: boolean): React.CSSProperties => ({
  ...btn,
  padding: '6px 10px',
  background: active ? '#0ea5e9' : '#111827',
  color: active ? '#0b1224' : '#e5e7eb',
  borderRadius: 8,
  fontSize: 12,
});

// Componente
export default function TradePanel() {
  // banca e pnl
  const [credits, setCredits] = useState<number>(100_000);
  const [realized, setRealized] = useState<number>(0);

  // ordem
  const [side, setSide] = useState<Side>('BUY');
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(10_000);

  // posição aberta (simplificado)
  const [posSize, setPosSize] = useState<number>(0);
  const [posAvg, setPosAvg] = useState<number>(0);

  // fills e histórico
  const [fills, setFills] = useState<Fill[]>([]);
  const [history, setHistory] = useState<Fill[]>([]);

  // abas
  const [tab, setTab] = useState<'fills' | 'history' | 'goals' | 'tips' | 'hotkeys'>('fills');

  // metas (gamificação)
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'trades', label: 'Fazer 3 trades', target: 3, value: 0, unit: 'trades' },
    { id: 'pnl', label: 'Lucro do dia +US$ 200', target: 200, value: 0, unit: 'US$' },
  ]);

  // termômetro de risco (exposição atual)
  const exposurePct = useMemo(() => {
    if (!credits) return 0;
    const notional = Math.abs(posSize) * posAvg || Math.abs(qty) * price;
    return (notional / credits) * 100;
  }, [posSize, posAvg, qty, price, credits]);

  const riskColor =
    exposurePct <= 0.5 ? '#10b981' : exposurePct <= 1.5 ? '#f59e0b' : '#ef4444';

  const goalsProgress = useMemo(() => {
    const total = goals.reduce((acc, g) => acc + (g.value / g.target), 0);
    return Math.min(total / goals.length, 1);
  }, [goals]);

  function addFill(side: Side, q: number, p: number, realizedNow?: number) {
    const f: Fill = {
      time: new Date().toLocaleTimeString(),
      side,
      qty: q,
      price: p,
      realized: realizedNow,
    };
    setFills((arr) => [f, ...arr.slice(0, 9)]); // últimos 10
    setHistory((arr) => [f, ...arr]);
    // atualiza metas
    setGoals((arr) =>
      arr.map((g) =>
        g.id === 'trades'
          ? { ...g, value: Math.min(g.target, g.value + 1) }
          : g.id === 'pnl'
          ? { ...g, value: Math.min(g.target, Math.max(0, (realized + (realizedNow || 0)))) }
          : g
      )
    );
  }

  function exec(sideExec: Side) {
    const q = Math.max(1, Math.floor(qty));
    const p = Math.max(1, Math.floor(price));

    if (sideExec === 'BUY') {
      // aumenta long ou reduz short
      if (posSize >= 0) {
        const newSize = posSize + q;
        const newAvg = (posAvg * posSize + p * q) / newSize;
        setPosSize(newSize);
        setPosAvg(newAvg);
        addFill('BUY', q, p);
      } else {
        // fechando short
        const closing = Math.min(q, Math.abs(posSize));
        const remain = q - closing;
        const pnlReal = closing * (posAvg - p); // short: ganho se preço cai
        setRealized((r) => r + pnlReal);
        if (closing === Math.abs(posSize)) {
          setPosSize(0);
          setPosAvg(0);
        } else {
          setPosSize(posSize + closing); // menos negativo
        }
        addFill('BUY', q, p, pnlReal);
        if (remain > 0) {
          // virou long
          setPosSize(remain);
          setPosAvg(p);
        }
      }
    } else {
      // SELL
      if (posSize <= 0) {
        // aumenta short ou reduz long negativo inexistente
        if (posSize < 0) {
          const newSize = posSize - q;
          const newAvg = (Math.abs(posAvg * posSize) + p * q) / Math.abs(newSize);
          setPosSize(newSize);
          setPosAvg(newAvg);
        } else {
          setPosSize(-q);
          setPosAvg(p);
        }
        addFill('SELL', q, p);
      } else {
        // fechando long
        const closing = Math.min(q, posSize);
        const remain = q - closing;
        const pnlReal = closing * (p - posAvg); // long: ganho se preço sobe
        setRealized((r) => r + pnlReal);
        if (closing === posSize) {
          setPosSize(0);
          setPosAvg(0);
        } else {
          setPosSize(posSize - closing);
        }
        addFill('SELL', q, p, pnlReal);
        if (remain > 0) {
          // virou short
          setPosSize(-remain);
          setPosAvg(p);
        }
      }
    }
  }

  function resetAll() {
    setPosSize(0);
    setPosAvg(0);
    setFills([]);
    setRealized(0);
    // metas do dia voltam só o PnL (trades mantidas como progresso)
    setGoals((arr) => arr.map((g) => (g.id === 'pnl' ? { ...g, value: 0 } : g)));
  }

  return (
    <div style={card}>
      {/* Cabeçalho + saldo + CTA */}
      <div style={{ ...row, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Painel de Trade</div>
        {goalsProgress >= 0.8 && (
          <a href="/planos" style={btnCTA}>Comprar Plano</a>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={stat}>
          <div style={statTitle}>Créditos</div>
          <div style={statValue}>US$ {credits.toLocaleString()}</div>
        </div>
        <div style={stat}>
          <div style={statTitle}>Lucro Realizado</div>
          <div style={{ ...statValue, color: realized >= 0 ? '#10b981' : '#ef4444' }}>
            US$ {realized.toFixed(2)}
          </div>
        </div>
      </div>

      {/* termômetro */}
      <div style={{ ...row, gap: 10 }}>
        <div style={{ fontSize: 12, opacity: 0.85, width: 90 }}>Risco atual</div>
        <div style={{ flex: 1, height: 10, background: '#0b1224', borderRadius: 999 }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(exposurePct, 100)}%`,
              background: riskColor,
              borderRadius: 999,
              transition: 'width .2s',
            }}
          />
        </div>
        <div style={{ width: 70, textAlign: 'right', fontSize: 12 }}>
          {exposurePct.toFixed(2)}%
        </div>
      </div>

      {/* ordem */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <div style={col}>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Lado</label>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value as Side)}
            style={select}
          >
            <option value="BUY">BUY (Long)</option>
            <option value="SELL">SELL (Short)</option>
          </select>
        </div>
        <div style={col}>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Qtd</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            style={input}
          />
        </div>
        <div style={col}>
          <label style={{ fontSize: 12, opacity: 0.8 }}>Preço</label>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={input}
          />
        </div>
      </div>

      <div style={{ ...row, gap: 8, marginTop: 2 }}>
        <button style={btnBuy} onClick={() => exec('BUY')}>Buy</button>
        <button style={btnSell} onClick={() => exec('SELL')}>Sell</button>
        <button style={btnReset} onClick={resetAll}>Reset</button>
      </div>

      {/* posição atual */}
      <div style={stat}>
        <div style={{ fontSize: 12, opacity: 0.75 }}>Posição</div>
        <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.35 }}>
          Lote: <b>{posSize}</b> &nbsp; | &nbsp; Preço Médio: <b>{posAvg || 0}</b>
          <br />
          PnL não realizado (mark={price}):{' '}
          <b style={{ color: (posSize >= 0 ? (price - posAvg) : (posAvg - price)) * Math.abs(posSize) >= 0 ? '#10b981' : '#ef4444' }}>
            US$ {((posSize >= 0 ? (price - posAvg) : (posAvg - price)) * Math.abs(posSize) || 0).toFixed(2)}
          </b>
        </div>
      </div>

      {/* abas de rodapé */}
      <div style={tabs}>
        {(['fills', 'history', 'goals', 'tips', 'hotkeys'] as const).map((k) => (
          <button key={k} style={tabBtn(tab === k)} onClick={() => setTab(k)}>
            {k === 'fills' ? 'Fills'
              : k === 'history' ? 'Histórico'
              : k === 'goals' ? 'Metas'
              : k === 'tips' ? 'Dicas'
              : 'Atalhos'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Fills */}
        {tab === 'fills' && (
          <div style={{ padding: 8 }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={thtd}>Hora</th>
                  <th style={thtd}>Lado</th>
                  <th style={thtd}>Qtd</th>
                  <th style={thtd}>Preço</th>
                </tr>
              </thead>
              <tbody>
                {fills.length === 0 && (
                  <tr>
                    <td style={thtd} colSpan={4}>(Nenhum ainda)</td>
                  </tr>
                )}
                {fills.map((f, i) => (
                  <tr key={i}>
                    <td style={thtd}>{f.time}</td>
                    <td style={{ ...thtd, color: f.side === 'BUY' ? '#10b981' : '#ef4444' }}>{f.side}</td>
                    <td style={thtd}>{f.qty}</td>
                    <td style={thtd}>{f.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Histórico */}
        {tab === 'history' && (
          <div style={{ padding: 8 }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={thtd}>Hora</th>
                  <th style={thtd}>Lado</th>
                  <th style={thtd}>Qtd</th>
                  <th style={thtd}>Preço</th>
                  <th style={thtd}>PnL</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 && (
                  <tr>
                    <td style={thtd} colSpan={5}>(Sem histórico)</td>
                  </tr>
                )}
                {history.map((f, i) => (
                  <tr key={i}>
                    <td style={thtd}>{f.time}</td>
                    <td style={{ ...thtd, color: f.side === 'BUY' ? '#10b981' : '#ef4444' }}>{f.side}</td>
                    <td style={thtd}>{f.qty}</td>
                    <td style={thtd}>{f.price}</td>
                    <td style={{ ...thtd, color: (f.realized ?? 0) >= 0 ? '#10b981' : '#ef4444' }}>
                      {f.realized !== undefined ? `US$ ${f.realized.toFixed(2)}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Metas */}
        {tab === 'goals' && (
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {goals.map((g) => {
              const pct = Math.min((g.value / g.target) * 100, 100);
              return (
                <div key={g.id}>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>
                    {g.label} &nbsp;
                    <span style={{ opacity: 0.7 }}>
                      ({g.value}/{g.target}{g.unit ? ` ${g.unit}` : ''})
                    </span>
                  </div>
                  <div style={{ height: 8, background: '#0b1224', borderRadius: 999 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#0ea5e9', borderRadius: 999 }} />
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Progresso total: {(goalsProgress * 100).toFixed(0)}%
            </div>
          </div>
        )}

        {/* Dicas */}
        {tab === 'tips' && (
          <div style={{ padding: 12, fontSize: 13, lineHeight: 1.5 }}>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li>Risco por trade ≤ <b>1%</b> da banca.</li>
              <li>Defina o <b>stop</b> antes do gatilho.</li>
              <li>Não mova o stop contra a posição.</li>
              <li>Evite overtrade: máximo <b>5</b> operações por sessão.</li>
              <li>Revise o diário no final do dia.</li>
            </ul>
            <div style={{ marginTop: 10 }}>
              Quer conteúdos completos? <a href="/planos" style={{ color: '#60a5fa' }}>Conheça os planos</a>.
            </div>
          </div>
        )}

        {/* Atalhos */}
        {tab === 'hotkeys' && (
          <div style={{ padding: 12, fontSize: 13 }}>
            <div style={{ marginBottom: 8 }}>Atalhos úteis:</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li><b>B</b> = Buy</li>
              <li><b>S</b> = Sell</li>
              <li><b>R</b> = Reset</li>
              <li><b>F</b> = Tela cheia do navegador (F11 / ⌃⌘F)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
