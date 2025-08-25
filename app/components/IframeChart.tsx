"use client";

interface Props {
  symbol: string;
}

export default function IframeChart({ symbol }: Props) {
  return (
    <iframe
      src={`https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=1h&theme=dark`}
      style={{
        width: "100%",
        height: "500px",
        border: "none",
        borderRadius: "8px",
      }}
    ></iframe>
  );
}
