// pages/contato.js
import Link from "next/link";

export default function Contato() {
  const card = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 16,
  };

  const input = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e5e7eb",
    outline: "none",
  };

  const btn = (bg) => ({
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 600,
    background: bg,
    border: "1px solid rgba(0,0,0,0.25)",
    boxShadow: "0 2px 0 rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.12)",
  });

  return (
    <section>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Contato</h1>
      <p style={{ opacity: .8, marginBottom: 16 }}>
        Tem uma sugestão, dúvida ou proposta? Envie uma mensagem. 🙂
      </p>

      <div style={card}>
        <form action="mailto:contato@radarcrypto.space" method="post" encType="text/plain">
          <div style={{ display: "grid", gap: 12 }}>
            <label>
              <div style={{ marginBottom: 6, opacity: .8 }}>Nome</div>
              <input type="text" name="nome" placeholder="Seu nome" style={input} required />
            </label>

            <label>
              <div style={{ marginBottom: 6, opacity: .8 }}>Email</div>
              <input type="email" name="email" placeholder="voce@exemplo.com" style={input} required />
            </label>

            <label>
              <div style={{ marginBottom: 6, opacity: .8 }}>Mensagem</div>
              <textarea name="mensagem" placeholder="Escreva sua mensagem..." rows={6} style={input} required />
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button type="submit" style={btn("linear-gradient(180deg,#16a34a,#15803d)")}>Enviar</button>
              <Link href="/" legacyBehavior>
                <a style={btn("rgba(255,255,255,0.06)")}>Voltar ao início</a>
              </Link>
            </div>
          </div>
        </form>
      </div>

      <p style={{ fontSize: 12, opacity: .6, marginTop: 10 }}>
        *Este formulário abre seu app de e-mail (mailto). Depois podemos integrar um backend/serviço (Formspree, Resend etc.).
      </p>
    </section>
  );
}
