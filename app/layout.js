// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "RadarCripto — Simulador de Trading",
  description: "Aprenda análise técnica na prática com um simulador sem risco.",
  metadataBase: new URL("https://radarcripto.space"),
  openGraph: {
    title: "RadarCripto — Simulador de Trading",
    description:
      "Aprenda análise técnica na prática com um simulador sem risco.",
    url: "https://radarcripto.space",
    siteName: "RadarCripto",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="bg-gray-950 text-gray-100">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
