// app/simulador/page.tsx
import TVChart from "../components/TVChart";
import TradePanel from "../components/TradePanel";

export default function SimuladorPage() {
  return (
    <main style={container}>
      {/* COLUNA ESQUERDA — GRÁFICO */}
      <section style={chartBox}>
        <TVChart symbol="BTCUSD" interval="60" />
      </section>

      {/* COLUNA DIREITA — PAINEL */}
      <aside style={aside}>
        <h2 style={{ margin: "0 0 8px" }}>Painel de Trade</h2>
        <TradePanel />
      </aside>
    </main>
  );
}

/* ===== estilos ===== */
const container: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 360px", // gráfico ocupa o espaço, painel fixo 360px
  gap: "12px",
  height: "calc(100vh - 24px)",
  padding: "12px",
  boxSizing: "border-box",
};

const chartBox: React.CSSProperties = {
  background: "#0f1216",
  border: "1px solid #2b2b2b",
  borderRadius: 8,
  overflow: "hidden",
};

const aside: React.CSSProperties = {
  height: "100%",
  overflow: "auto",
};
