import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RadarCrypto.space",
  description: "Simulador de trading — estude e pratique sem risco.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-950 text-gray-200 antialiased">
        {/* raiz usada pelo fullscreen do simulador, não afeta outras páginas */}
        <div id="sim-root" className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
