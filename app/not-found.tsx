import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
      <h1 className="text-5xl font-extrabold mb-4 text-emerald-400">404</h1>
      <p className="text-gray-300 mb-8">Página não encontrada.</p>
      <div className="flex gap-3 justify-center">
        <Link href="/" className="px-4 py-2 rounded bg-emerald-600 text-gray-900 font-semibold hover:bg-emerald-500">
          Voltar ao início
        </Link>
        <Link href="/simulador" className="px-4 py-2 rounded border border-emerald-600 text-emerald-400 hover:bg-emerald-900/20">
          Acessar simulador
        </Link>
      </div>
    </div>
  );
}
