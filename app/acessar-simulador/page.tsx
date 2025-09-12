// app/acessar-simulador/page.tsx
export const metadata = { title: 'Acessar simulador | RadarCripto' };

export default function AcessarSimuladorRedirect() {
  // redireciono para /simulador pra manter o link do menu funcionando
  if (typeof window !== 'undefined') {
    window.location.href = '/simulador';
  }
  return null;
}
