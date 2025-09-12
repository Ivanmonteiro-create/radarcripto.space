// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-64px)] grid place-items-center bg-black text-white">
      <div className="text-center">
        <div className="text-5xl font-extrabold mb-3">404</div>
        <p className="text-gray-400 mb-6">Página não encontrada.</p>
        <Link
          href="/"
          className="rounded-md bg-emerald-600 text-black px-4 py-2 font-medium hover:opacity-90"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
