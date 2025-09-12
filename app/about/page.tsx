// app/sobre/page.tsx
export const metadata = { title: 'Sobre | RadarCrypto' };

export default function SobrePage() {
  return (
    <main className="min-h-[calc(100vh-64px)] w-full bg-black text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Sobre</h1>
        <p className="text-gray-300 leading-relaxed">
          O RadarCrypto é um simulador prático para testar estratégias e evoluir sem risco.
        </p>
      </div>
    </main>
  );
}
