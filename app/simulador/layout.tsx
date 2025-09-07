// app/layout.tsx
import "../styles/globals.css"; // garante que o Tailwind/CSS global seja aplicado

export const metadata = {
  title: "RadarCripto.space",
  description: "Simulador de trading educacional com preços ao vivo da Binance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
