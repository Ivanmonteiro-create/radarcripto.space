// app/layout.js
import "@/styles/globals.css";
import "@/styles/overrides.css"; // <- NOVO: deixa Planos e Acessar simulador em verde

export const metadata = {
  title: "RadarCrypto.space",
  description: "Simulador de trading educacional com preços ao vivo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
