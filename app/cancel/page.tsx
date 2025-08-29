// app/cancel/page.tsx
export default function CancelPage() {
  return (
    <main style={{ padding: 24, color: "#fecaca" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>❌ Pagamento cancelado</h1>
      <p>Você pode tentar novamente quando quiser.</p>
      <a href="/planos" style={{ display: "inline-block", marginTop: 16, padding: "10px 16px", background: "#334155", borderRadius: 8 }}>Voltar aos planos</a>
    </main>
  );
}
