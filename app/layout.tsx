// app/layout.tsx
import "../styles/globals.css"; // se seu arquivo for outro, ajuste (ex: "../styles/style.css")

export const metadata = {
  title: "RadarCripto.space",
  description: "Simulador de trading educacional com preços ao vivo da Binance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
