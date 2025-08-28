// app/success/page.tsx
export default function SuccessPage({ searchParams }: { searchParams: { plan?: string } }) {
  const plan = (searchParams?.plan || "").toUpperCase();
  return (
    <main style={{ padding: 32, maxWidth: 720, margin: "0 auto", color: "#e5e7eb" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Pagamento confirmado ✅</h1>
      <p style={{ opacity: 0.9 }}>
        Obrigado! Sua assinatura {plan || ""} foi criada. Em breve enviaremos o acesso ao seu e-mail.
      </p>
      <a
        href="/simulador"
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
        Ir para o simulador
      </a>
    </main>
  );
}
