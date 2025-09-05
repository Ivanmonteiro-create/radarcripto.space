// pages/contato.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';
import { useState } from 'react';

// 👉 Ajuste este e-mail quando tiver a caixa criada
const CONTACT_EMAIL = 'contato@radarcrypto.space';

export default function Contato() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const assunto = encodeURIComponent(`Contato via site - ${nome || 'Visitante'}`);
    const corpo = encodeURIComponent(
      `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${assunto}&body=${corpo}`;
  }

  const card = {
    maxWidth: 720,
    margin: '32px auto 56px',
    padding: 20,
    borderRadius: 12,
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.08)',
  };

  const input = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,.12)',
    background: 'rgba(0,0,0,.15)',
    color: '#e6edf3',
    outline: 'none',
  };

  const label = { fontSize: 14, opacity: .9, marginBottom: 6, display: 'block' };

  return (
    <>
      <Header />
      <main className="container">
        <section style={{maxWidth: 900, margin: '32px auto 16px'}}>
          <span className="kicker">Fale com a gente</span>
          <h1 className="title" style={{fontSize: 34, marginTop: 8}}>Contato</h1>
          <p className="subtitle" style={{marginTop: 8}}>
            Tem uma sugestão, dúvida ou proposta? Envie uma mensagem. 😉
          </p>
        </section>

        <section style={card}>
          <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gap: 16}}>
              <div>
                <label style={label} htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  style={input}
                  type="text"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={label} htmlFor="email">Email</label>
                <input
                  id="email"
                  style={input}
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={label} htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  style={{...input, minHeight: 140, resize: 'vertical'}}
                  placeholder="Escreva sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  required
                />
              </div>

              <div style={{display: 'flex', gap: 12}}>
                <CTAButton type="submit">Enviar</CTAButton>
                <CTAButton href="/" variant="ghost">Voltar ao início</CTAButton>
              </div>

              <p style={{opacity: .7, fontSize: 13, marginTop: 8}}>
                *Este formulário abre seu app de e-mail (mailto). Depois podemos
                integrar um backend/serviço (Formspree, Resend, etc.).
              </p>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
