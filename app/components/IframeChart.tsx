// app/components/IframeChart.tsx
export default function IframeChart() {
  return (
    <div style={{ margin: "20px 0" }}>
      <iframe
        src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview"
        width="100%"
        height="500"
        frameBorder="0"
        allowTransparency
        scrolling="no"
        title="TradingView Chart"
      ></iframe>
    </div>
  );
}
