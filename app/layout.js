// app/layout.js
import "../styles/globals.css";

export const metadata = {
  title: "RadarCrypto.space",
  description: "Simulador de trading educacional com preços ao vivo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
