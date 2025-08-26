'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Side = 'LONG' | 'SHORT' | null;

type Ticker = 'BTCUSDT';

const format = (n: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n);

export default function TradePanel() {
  // ---- estado do mercado / símbolo ----
  const [symbol, setSymbol] = useState<Ticker>('BTCUSDT');
  const [price, setPrice] = useState<number>(0);
  const [loadingPx, setLoadingPx] = useState(false);

  // ---- inputs de ordem ----
  const [qtyInput, setQtyInput] = useState<string>('0.01'); // 0.01 BTC
  const qty = useMemo(() => Math.max(0, Number(qtyInput) || 0), [qtyInput]);

  // ---- posição ----
  const [side, setSide] = useState<Side>(null);
  const [positionQty, setPositionQty] = useState(0);   // em BTC
  const [avgPrice, setAvgPrice] = useState(0);         // USD
  const [realizedPnl, setRealizedPnl] = useState(0);   // USD

  // PnL não realizado (mark to market)
  const unrealizedPnl = useMemo(() => {
    if (!side || positionQty <= 0) return 0;
    if (side === 'LONG') return (price - avgPrice) * positionQty;
    return (avgPrice - price) * positionQty;
  }, [side, positionQty, avgPrice, price]);

  const leverage = 1; // simples (poderemos adicionar depois)

  // --------- feed de preço (Binance público) ----------
  useEffect(() => {
    let timer: number | undefined;

    async function fetchPx() {
      try {
        setLoadingPx(true);
        // BTCUSDT → preço em USDT ~= USD
        const r = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
          { cache: 'no-store' }
        );
        const j = await r.json();
        const p = Number(j.price);
        if (!Number.isNaN(p)) setPrice(p);
      } catch {
        // silencia; mantém último preço
      } finally {
        setLoadingPx(false);
      }
    }

    fetchPx();
    timer = window.setInterval(fetchPx, 10_000); // atualiza a cada 10s
    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [symbol]);

  // --------- engine de execução / netting ----------
  function marketBuy() {
    if (qty <= 0 || price <= 0) return;

    // se posição atual é SHORT, fecha até onde der
    if (side === 'SHORT' && positionQty > 0) {
      const closeQty = Math.min(positionQty, qty);
      // PnL do fechamento de short: (avg - exec) * closeQty
      const pnl = (avgPrice - price) * closeQty;
      setRealizedPnl((p) => p + pnl);
      const rem = positionQty - closeQty;

      if (rem === 0) {
        // zerou short
        if (qty > closeQty) {
          // abre LONG com o resto
          const openQty = qty - closeQty;
          setSide('LONG');
          setPositionQty(openQty);
          setAvgPrice(price);
        } else {
          setSide(null);
          setPositionQty(0);
          setAvgPrice(0);
        }
      } else {
        // ainda resta short
        setPositionQty(rem);
        // avgPrice permanece
      }
      return;
    }

    // se não tinha posição ou já era LONG → média de preço
    if (side !== 'LONG') {
      setSide('LONG');
      setAvgPrice(price);
      setPositionQty(qty);
    } else {
      const newQty = positionQty + qty;
      const newAvg = (avgPrice * positionQty + price * qty) / newQty;
      setPositionQty(newQty);
      setAvgPrice(newAvg);
    }
  }

  function marketSell() {
    if (qty <= 0 || price <= 0) return;

    // se posição atual é LONG, fecha até onde der
    if (side === 'LONG' && positionQty > 0) {
      const closeQty = Math.min(positionQty, qty);
      // PnL de fechamento de long: (exec - avg) * closeQty
      const pnl = (price - avgPrice) * closeQty;
      setRealizedPnl((p) => p + pnl);
      const rem = positionQty - closeQty;

      if (rem === 0) {
        // zerou long
        if (qty > closeQty) {
          // abre SHORT com o resto
          const openQty = qty - closeQty;
          setSide('SHORT');
          setPositionQty(openQty);
          setAvgPrice(price);
        } else {
          setSide(null);
          setPositionQty(0);
          setAvgPrice(0);
        }
      } else {
        // ainda resta long
        setPositionQty(rem);
        // avgPrice permanece
      }
      return;
    }

    // se não tinha posição ou já era SHORT → média de preço
    if (side !== 'SHORT') {
      setSide('SHORT');
      setAvgPrice(price);
      setPositionQty(qty);
    } else {
      const newQty = positionQty + qty;
      const newAvg = (avgPrice * positionQty + price * qty) / newQty;
      setPositionQty(newQty);
      setAvgPrice(newAvg);
    }
  }

  function closePercent(pct: number) {
    if (!side || positionQty <= 0) return;
    const closeQty = Math.max(0, Math.min(positionQty, (positionQty * pct) / 100));
    if (closeQty === 0) return;

    if (side === 'LONG') {
      const pnl = (price - avgPrice) * closeQty;
      setRealizedPnl((p) => p + pnl);
    } else {
      const pnl = (avgPrice - price) * closeQty;
      setRealizedPnl((p) => p + pnl);
    }

    const rem = positionQty - closeQty;
    if (rem <= 0.0000001) {
      setSide(null);
      setPositionQty(0);
      setAvgPrice(0);
    } else {
      setPositionQty(rem);
      // avgPrice permanece
    }
  }

  function resetAll() {
    setSide(null);
    setPositionQty(0);
    setAvgPrice(0);
    setRealizedPnl(0);
  }

  return (
    <div style={panel}>
      <div style={row}>
        <strong>Ativo:</strong>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value as Ticker)}
          style={select}
        >
          <option value="BTCUSDT">BTCUSDT</option>
          {/* futuros: ETHUSDT, etc */}
        </select>
        <span style={{ marginLeft: 8 }}>
          {loadingPx ? 'Atualizando…' : `Preço: ${price ? format(price) : '—'}`}
        </span>
      </div>

      <div style={row}>
        <label style={{ marginRight: 8 }}>Qtd (BTC):</label>
        <input
          style={input}
          value={qtyInput}
          onChange={(e) => setQtyInput(e.target.value)}
          inputMode="decimal"
        />
      </div>

      <div style={row}>
        <button style={btnBuy} onClick={marketBuy}>Comprar (Market)</button>
        <button style={btnSell} onClick={marketSell}>Vender (Market)</button>
      </div>

      <div style={row}>
        <button style={btn} onClick={() => closePercent(25)}>Fechar 25%</button>
        <button style={btn} onClick={() => closePercent(50)}>Fechar 50%</button>
        <button style={btn} onClick={() => closePercent(100)}>Fechar 100%</button>
      </div>

      <div style={card}>
        <div style={statRow}>
          <span>Posição:</span>
          <strong>
            {side ?? '—'} {positionQty > 0 ? `· ${positionQty.toFixed(5)} BTC` : ''}
          </strong>
        </div>
        <div style={statRow}>
          <span>Preço Médio:</span>
          <strong>{avgPrice ? format(avgPrice) : '—'}</strong>
        </div>
        <div style={statRow}>
          <span>PNL Não Realizado:</span>
          <strong style={{ color: unrealizedPnl >= 0 ? '#16a34a' : '#dc2626' }}>
            {format(unrealizedPnl * leverage)}
          </strong>
        </div>
        <div style={statRow}>
          <span>PNL Realizado:</span>
          <strong style={{ color: realizedPnl >= 0 ? '#16a34a' : '#dc2626' }}>
            {format(realizedPnl)}
          </strong>
        </div>
      </div>

      <div style={row}>
        <button style={btnReset} onClick={resetAll}>Resetar</button>
      </div>
    </div>
  );
}

// ---- estilos inline simples (evita mexer no seu CSS) ----
const panel: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  border: '1px solid #333',
  borderRadius: 12,
  background: '#111418',
  color: '#e5e7eb',
  minWidth: 320,
};

const row: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
};

const input: React.CSSProperties = {
  background: '#0b0f14',
  color: '#e5e7eb',
  border: '1px solid #2a2f36',
  padding: '8px 10px',
  borderRadius: 10,
  minWidth: 110,
};

const select: React.CSSProperties = {
  ...input,
} as React.CSSProperties;

const btn: React.CSSProperties = {
  background: '#1f2937',
  color: '#e5e7eb',
  border: '1px solid #2a2f36',
  padding: '8px 12px',
  borderRadius: 10,
  cursor: 'pointer',
};

const btnBuy: React.CSSProperties = {
  ...btn,
  background: '#064e3b',
  borderColor: '#065f46',
};

const btnSell: React.CSSProperties = {
  ...btn,
  background: '#7f1d1d',
  borderColor: '#991b1b',
};

const btnReset: React.CSSProperties = {
  ...btn,
  background: '#374151',
};

const card: React.CSSProperties = {
  borderTop: '1px dashed #2a2f36',
  paddingTop: 10,
  marginTop: 4,
};

const statRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '6px 0',
};
