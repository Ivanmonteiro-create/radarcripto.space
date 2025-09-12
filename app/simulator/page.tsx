// app/simulador/page.tsx
export const metadata = {
  title: 'Simulador | RadarCripto',
};

import SimuladorClient from './SimuladorClient';

export default function SimuladorPage() {
  // Página server; o estado fica no Client.
  return <SimuladorClient />;
}
