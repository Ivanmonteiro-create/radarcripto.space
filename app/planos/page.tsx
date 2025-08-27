export default function PlanosPage() {
  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px", color: "#e6eef8" }}>
      <h1 style={{ marginBottom: 12 }}>Planos</h1>
      <p style={{ opacity: .8, marginBottom: 24 }}>
        Treine no simulador com créditos virtuais. Quando estiver pronto, escolha um plano para liberar recursos avançados
        (indicadores extras, salvar setups, histórico de fills, ranking, etc.).
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16
      }}>
        {[
          { nome: "Starter", preco: "US$ 9/mês", itens: ["Simulador", "2 pares", "Suporte básico"] },
          { nome: "Trader", preco: "US$ 19/mês", itens: ["Tudo do Starter", "10 pares", "Indicadores extras"] },
          { nome: "Pro", preco: "US$ 39/mês", itens: ["Tudo do Trader", "Paineis avançados", "Histórico & export"] },
        ].map((p) => (
          <div key={p.nome} style={{
            background: "#0b1220",
            border: "1px solid #1f2a44",
            borderRadius: 12,
            padding: 16
          }}>
            <h2 style={{ margin: "0 0 8px" }}>{p.nome}</h2>
            <div style={{ marginBottom: 10, fontWeight: 700 }}>{p.preco}</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {p.itens.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <button style={{
              marginTop: 14,
              background: "#22c55e",
              border: "none",
              color: "#071017",
              padding: "10px 14px",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}>
              Assinar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
