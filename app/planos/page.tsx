export default function PlanosPage() {
  return (
    <main style={{maxWidth:900, margin:"40px auto", padding:"0 16px", color:"#e6eef8"}}>
      <h1 style={{marginBottom:8}}>Planos</h1>
      <p style={{opacity:.8, marginBottom:24}}>
        Comece no simulador com créditos virtuais. Quando estiver pronto, escolha um plano para liberar recursos avançados.
      </p>

      <div style={{display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))"}}>
        {[
          {nome:"Starter", preco:"R$ 39/mês", itens:["Gráfico TradingView", "Simulador com taxa 0,10%"]},
          {nome:"Pro", preco:"R$ 99/mês", itens:["Tudo do Starter", "Histórico de fills ilimitado", "Exportar trades (CSV)"]},
          {nome:"Elite", preco:"R$ 199/mês", itens:["Tudo do Pro", "Salas e desafios", "Suporte prioritário"]},
        ].map((p) => (
          <div key={p.nome} style={{background:"#0b1220", border:"1px solid #1f2a44", borderRadius:12, padding:16}}>
            <h3 style={{margin:"6px 0"}}>{p.nome}</h3>
            <div style={{fontSize:22, fontWeight:700, marginBottom:10}}>{p.preco}</div>
            <ul style={{margin:"0 0 12px 16px"}}>
              {p.itens.map((i) => <li key={i} style={{marginBottom:6}}>{i}</li>)}
            </ul>
            <button style={{background:"#f59e0b", color:"#1b1b1b", border:"none", padding:"10px 12px", borderRadius:8, cursor:"pointer"}}>
              Assinar {p.nome}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
