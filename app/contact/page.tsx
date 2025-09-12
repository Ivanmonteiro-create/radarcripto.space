// app/contato/page.tsx
export const metadata = { title: 'Fale com a gente | RadarCrypto' };

export default function ContatoPage() {
  return (
    <main className="min-h-[calc(100vh-64px)] w-full bg-black text-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Fale com a gente</h1>
        <p className="text-gray-300">Contato em breve.</p>
      </div>
    </main>
  );
}
