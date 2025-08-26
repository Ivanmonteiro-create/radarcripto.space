// app/simulador/page.tsx
import TradePanel from '../components/TradePanel';

export default function SimuladorPage() {
  return (
    <main style={container}>
      {/* COLUNA 1 – gráfico via TradingView (iframe na sua rota atual) */}
      <section style={chartBox}>
        <iframe
          title="TradingView"
          src="https://s.tradingview.com/widgetembed/?symbol=BINANCE:BTCUSDT&interval=60&hidesidetoolbar=1&symboledit=1&studies=[]&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1"
          style={iframe}
        />
      </section>

      {/* COLUNA 2 – painel de trade */}
      <aside style={aside}>
        <h2 style={{ margin: '0 0 8px' }}>Painel de Trade</h2>
        <TradePanel />
      </aside>
    </main>
  );
}

const container: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 360px',
  gap: 16,
  padding: 16,
};

const chartBox: React.CSSProperties = {
  background: '#0b0f14',
  border: '1px solid #2a2f36',
  borderRadius: 12,
  overflow: 'hidden',
  minHeight: '70vh',
};

const iframe: React.CSSProperties = {
  width: '100%',
  height: '70vh',
  border: 'none',
};

const aside: React.CSSProperties = {
  color: '#e5e7eb',
};
