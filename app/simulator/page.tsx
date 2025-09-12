// app/simulador/page.tsx
export const metadata = {
  title: 'Simulador | RadarCripto',
};

import SimuladorClient from './SimuladorClient';

export default function SimuladorPage() {
  // Esta página é SERVER (sem "use client")
  return <SimuladorClient />;
}
