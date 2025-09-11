import Link from "next/link";

export default function BackToHome() {
  return (
    <div className="mt-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-gray-100"
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}
