// app/layout.js
import "../styles/globals.css";

export const metadata = {
  title: "RadarCripto.space",
  description: "Simulador de trading educacional com preços ao vivo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      {/* 
        Essas classes garantem contraste e tipografia legível
        apenas nas rotas do APP Router (ex.: /simulador)
      */}
      <body className="bg-gray-900 text-white antialiased">{children}</body>
    </html>
  );
}
