// app/simulador/page.tsx
import TradePanel from "../components/TradePanel";
import IframeChart from "../components/IframeChart";

export default function SimuladorPage() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Simulador de Criptomoedas</h1>
      <IframeChart />
      <TradePanel />
    </main>
  );
}
