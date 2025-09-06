// app/layout.tsx
import "./globals.css"; // se seu CSS global estiver em styles/globals.css, ajuste o caminho

export const metadata = {
  title: "RadarCripto.space",
  description: "Simulador de trading educacional com preços ao vivo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
