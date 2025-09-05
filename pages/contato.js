import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Link from 'next/link';

export default function Contato() {
  const shell = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg,#0f1723 0%, #0a1320 100%)',
    color: '#e6eef5',
  };
  const card = {
    maxWidth: 880,
    margin: '36px auto',
    padding: 24,
    borderRadius: 16,
    background: 'rgba(17,24,39,.45)',
    border: '1px solid rgba(255,255,255,.08)',
  };
  const input = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.06)', color: '#e6eef5'
  };
  const row = { display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' };
  const send = { padding:'10px 14px', borderRadius:10, border:'1px solid rgba(37,211,102,.5)', background:'#25d366', color:'#0b1a12', fontWeight:700 };
  const ghost= { padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)', background:'rgba(255,255,255,.06)', color:'#e6eef5' };

  return (
    <div style={shell}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Contato</h2>
          <p style={{ opacity: .85 }}>Tem uma sugestão, dúvida ou proposta? Envie uma mensagem. ✉️</p>

          <form action="mailto:radar@radarcrypto.space" method="post" encType="text/plain">
            <label>Nome<div><input name="nome" placeholder="Seu nome" style={input} /></div></label>
            <div style={{ height: 10 }} />
            <label>Email<div><input name="email" placeholder="voce@exemplo.com" style={input} /></div></label>
            <div style={{ height: 10 }} />
            <label>Mensagem<div><textarea name="mensagem" placeholder="Escreva sua mensagem..." rows={6} style={input} /></div></label>

            <div style={row}>
              <button type="submit" style={send}>Enviar</button>
              <Link href="/"><span style={ghost}>Voltar ao início</span></Link>
            </div>
          </form>

          <p style={{ marginTop: 12, opacity: .65, fontSize: 12 }}>
            *Este formulário abre seu app de e-mail (mailto). Depois podemos integrar um backend/serviço (Formspree, Resend etc.).
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
