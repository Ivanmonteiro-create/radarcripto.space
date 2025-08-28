'use client';

import React from 'react';

export default function TradePanel() {
  return (
    <div className="rc-panel">
      <div className="rc-head">
        <h2>Painel de Trade</h2>
      </div>

      <div className="rc-grid2">
        <Stat title="Créditos" value="US$ 100 000" />
        <Stat title="Lucro Realizado" value="US$ 0.00" accent />
      </div>

      <div className="rc-block">
        <label className="rc-label">Lado</label>
        <select className="rc-input" defaultValue="BUY (Long)" aria-label="Lado">
          <option>BUY (Long)</option>
          <option>SELL (Short)</option>
        </select>

        <label className="rc-label">Qtd</label>
        <input className="rc-input" type="number" defaultValue={1} min={1} />

        <label className="rc-label">Preço</label>
        <input className="rc-input" type="number" defaultValue={10000} />

        <div className="rc-actions">
          <button className="rc-btn rc-buy">Buy</button>
          <button className="rc-btn rc-sell">Sell</button>
          <button className="rc-btn rc-reset">Reset</button>
        </div>
      </div>

      <div className="rc-card">
        <div className="rc-label">Posição</div>
        <div className="rc-muted">Lote 0 | Preço Médio: —</div>
        <div className="rc-pnl">PNL não realizado (mark=10 000): US$ 0.00</div>
      </div>

      <div className="rc-card rc-flex1">
        <div className="rc-label">Fills</div>
        <div className="rc-muted">Nenhum ainda</div>
      </div>

      <button className="rc-plan" onClick={() => (window.location.href = '/planos')}>
        Comprar Plano
      </button>

      <style>{`
        .rc-panel{
          width:360px;min-height:100%;
          padding:12px;border-radius:16px;box-sizing:border-box;
          background:linear-gradient(180deg,#0b1222,#0a1324);
          border:1px solid rgba(148,163,184,.22);
          box-shadow:0 14px 36px rgba(2,8,23,.55), inset 0 1px 0 rgba(255,255,255,.04);
          display:flex;flex-direction:column;gap:12px;color:#e5e7eb;
        }
        .rc-head h2{margin:0;font-size:18px;letter-spacing:.3px}
        .rc-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .rc-card{
          border:1px solid rgba(148,163,184,.22);
          background:rgba(2,6,23,.45);border-radius:12px;padding:10px
        }
        .rc-flex1{flex:1}
        .rc-block{
          display:grid;grid-template-columns:72px 1fr;gap:8px;align-items:center;
          border:1px solid rgba(148,163,184,.22);background:rgba(2,6,23,.45);border-radius:12px;padding:10px
        }
        .rc-label{font-size:12px;opacity:.85}
        .rc-input{
          width:100%;border-radius:10px;border:1px solid rgba(148,163,184,.35);
          background:rgba(15,23,42,.7);color:#e5e7eb;padding:8px 10px;outline:none;
          transition:border-color .18s ease, box-shadow .18s ease;
        }
        .rc-input:focus{border-color:#60a5fa;box-shadow:0 0 0 3px rgba(96,165,250,.2)}
        .rc-actions{grid-column:1 / -1;display:flex;gap:10px;margin-top:4px}

        /* Botões AINDA mais fortes */
        .rc-btn{
          border:none;border-radius:12px;padding:11px 16px;font-weight:900;cursor:pointer;
          color:#0b1220;letter-spacing:.2px;
          transition:transform .12s ease, box-shadow .12s ease, filter .12s ease;
        }
        .rc-buy{background:linear-gradient(180deg,#22e7a5,#00c38a);box-shadow:0 10px 16px rgba(0,195,138,.25)}
        .rc-sell{background:linear-gradient(180deg,#ff6b7a,#ff2d55);box-shadow:0 10px 16px rgba(255,45,85,.25)}
        .rc-reset{background:linear-gradient(180deg,#cbd5e1,#94a3b8);color:#0f172a;box-shadow:0 10px 16px rgba(148,163,184,.25)}
        .rc-btn:hover{transform:translateY(-1px);filter:saturate(1.18)}
        .rc-btn:active{transform:translateY(0)}

        .rc-muted{opacity:.7;font-size:12px;margin-top:6px}
        .rc-pnl{
          margin-top:10px;padding:8px;border-radius:10px;
          background:rgba(34,197,94,.12);color:#22c55e;font-weight:900;font-size:13px
        }
        .rc-plan{
          width:100%;border:none;border-radius:14px;padding:12px 14px;
          font-weight:900;cursor:pointer;color:#111827;
          background:linear-gradient(180deg,#ffd86b,#ffb020);
          box-shadow:0 12px 24px rgba(255,176,32,.35), inset 0 1px 0 rgba(255,255,255,.55);
          transition:transform .12s ease, box-shadow .12s ease, filter .12s ease
        }
        .rc-plan:hover{transform:translateY(-1px);filter:saturate(1.1);box-shadow:0 16px 28px rgba(255,176,32,.45)}
      `}</style>
    </div>
  );
}

function Stat({ title, value, accent }: { title: string; value: string; accent?: boolean }) {
  return (
    <div className="rc-card">
      <div className="rc-label">{title}</div>
      <div style={{ fontWeight: 900, marginTop: 4, color: accent ? '#22c55e' : '#fff' }}>{value}</div>
    </div>
  );
}
