import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-5xl font-bold">404</h1>
      <p>Página não encontrada.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
