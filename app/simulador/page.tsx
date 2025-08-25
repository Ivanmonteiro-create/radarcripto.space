import IframeChart from "../../components/IframeChart";
import TradePanel from "../../components/TradePanel";

export default function Simulador() {
  return (
    <main style={{ display: "flex", gap: "20px", padding: "20px" }}>
      <div style={{ flex: 2 }}>
        <IframeChart symbol="BINANCE:BTCUSDT" />
      </div>
      <div style={{ flex: 1 }}>
        <TradePanel />
      </div>
    </main>
  );
}
