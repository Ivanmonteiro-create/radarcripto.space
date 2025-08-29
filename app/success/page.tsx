// app/success/page.tsx
export default function SuccessPage() {
  return (
    <main style={{ padding: 24, color: "#d1fae5" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>✅ Pagamento concluído!</h1>
      <p>Seu acesso será liberado em instantes. Obrigado por assinar o RadarCripto.space.</p>
      <a href="/simulador" style={{ display: "inline-block", marginTop: 16, padding: "10px 16px", background: "#3b82f6", borderRadius: 8 }}>Ir para o simulador</a>
    </main>
  );
}
