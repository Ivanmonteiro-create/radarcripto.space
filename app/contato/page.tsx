// app/contact/page.tsx
import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">Fale com a gente</h1>
      <p className="text-gray-300">
        Dúvidas, sugestões ou parcerias? Envie um e-mail para{" "}
        <a href="mailto:contato@radarcripto.space" className="underline">
          contato@radarcripto.space
        </a>{" "}
        ou fale com a gente por aqui.
      </p>
      <Link
        href="/"
        className="inline-flex mt-6 rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-800"
      >
        Voltar ao início
      </Link>
    </section>
  );
}
