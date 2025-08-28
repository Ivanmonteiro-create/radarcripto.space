// app/cancel/page.tsx
export default function CancelPage() {
  return (
    <main style={{ padding: 32, maxWidth: 720, margin: "0 auto", color: "#e5e7eb" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Pagamento cancelado</h1>
      <p style={{ opacity: 0.9 }}>Tudo bem! Você pode tentar novamente quando quiser.</p>
      <a
        href="/planos"
        style={{
          display: "inline-block",
          marginTop: 24,
          padding: "10px 16px",
          borderRadius: 10,
          background: "#2563eb",
          color: "#fff",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Voltar aos planos
      </a>
    </main>
  );
}
