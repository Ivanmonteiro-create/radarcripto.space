'use client';
import React from 'react';

type Props = {
  onComprarPlano?: () => void;
  className?: string;
};

export default function TradePanel({ onComprarPlano, className }: Props) {
  // OBS: esta é só a “casca visual”. Mantém seus handlers originais se já existirem.
  const [side, setSide] = React.useState<'BUY'|'SELL'>('BUY');

  const onBuy = () => setSide('BUY');
  const onSell = () => setSide('SELL');
  const onReset = () => { /* sua lógica de reset aqui */ };

  return (
    <aside className={`trade-panel ${className ?? ''}`}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <h2 style={{fontSize:18,fontWeight:800}}>Painel de Trade</h2>
        <button className="btn btn-plan" onClick={onComprarPlano}>Comprar Plano</button>
      </header>

      {/* créditos / lucro realizado */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
        <div style={{background:'rgba(255,255,255,.04)',padding:10,borderRadius:10}}>
          <div style={{fontSize:12,color:'var(--muted)'}}>Créditos</div>
          <div style={{fontSize:18,fontWeight:700}}>US$ 100 000</div>
        </div>
        <div style={{background:'rgba(255,255,255,.04)',padding:10,borderRadius:10}}>
          <div style={{fontSize:12,color:'var(--muted)'}}>Lucro Realizado</div>
          <div style={{fontSize:18,fontWeight:700,color:'#22c55e'}}>US$ 0.00</div>
        </div>
      </div>

      {/* controls: lado / qtd / preço */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:10}}>
        <div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Lado</div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-buy" onClick={onBuy}>Buy</button>
            <button className="btn btn-sell" onClick={onSell}>Sell</button>
            <button className="btn btn-reset" onClick={onReset}>Reset</button>
          </div>
        </div>
        <div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Qtd</div>
          <input defaultValue={1} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,.12)',background:'transparent',color:'var(--text)'}} />
        </div>
        <div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Preço</div>
          <input defaultValue={10000} style={{width:'100%',padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,.12)',background:'transparent',color:'var(--text)'}} />
        </div>
      </div>

      {/* posição / PnL */}
      <div style={{background:'rgba(255,255,255,.04)',padding:10,borderRadius:10,marginBottom:10}}>
        <div style={{fontSize:12,color:'var(--muted)'}}>Posição</div>
        <div style={{fontSize:13,opacity:.85}}>— Fechado</div>
        <div style={{marginTop:6,fontSize:13,color:'#22c55e',fontWeight:700}}>
          PNL não realizado (mark=10 000): US$ 0.00
        </div>
      </div>

      {/* fills */}
      <div style={{background:'rgba(255,255,255,.04)',padding:10,borderRadius:10}}>
        <div style={{display:'flex',gap:8,marginBottom:8,fontSize:12,color:'var(--muted)'}}>
          <span>Fills</span><span>•</span><span>Histórico</span><span>•</span><span>Notas</span><span>•</span><span>Datas</span><span>•</span><span>Atalhos</span>
        </div>
        <div style={{fontSize:13,opacity:.8}}>Nenhum ainda</div>
      </div>
    </aside>
  );
}
