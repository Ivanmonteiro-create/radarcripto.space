// /pages/contato.js
export default function Contato() {
  return (
    <main style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <section
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
          Contato
        </h1>
        <p style={{ opacity: 0.9, marginBottom: 16 }}>
          Tem uma sugestão, dúvida ou proposta? Envie uma mensagem. 🙂
        </p>

        <form
          action="mailto:seuemail@exemplo.com"
          method="post"
          encType="text/plain"
          style={{ display: "grid", gap: 12, maxWidth: 680 }}
        >
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="voce@exemplo.com"
            style={inputStyle}
          />
          <textarea
            name="mensagem"
            placeholder="Escreva sua mensagem..."
            rows={6}
            style={inputStyle}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button type="submit" style={btnGreen}>
              Enviar
            </button>
            <a href="/" style={btnGhost}>
              Voltar ao início
            </a>
          </div>
          <small style={{ opacity: 0.7 }}>
            *Este formulário abre seu app de e-mail (mailto). Depois podemos
            integrar um backend/serviço (Formspree, Resend etc.).
          </small>
        </form>
      </section>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
};

const btnGreen = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "#16a34a",
  color: "#08130a",
  fontWeight: 800,
  border: "none",
  cursor: "pointer",
};

const btnGhost = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontWeight: 600,
};
