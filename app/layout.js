// app/layout.js
import "../styles/globals.css"; // ajuste se seu CSS tiver outro nome/caminho

export const metadata = {
  title: "RadarCripto.space",
  description: "Simulador de trading educacional com preços ao vivo da Binance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
