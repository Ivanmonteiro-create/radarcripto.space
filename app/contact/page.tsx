import BackToHome from "@/components/BackToHome";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Fale com a gente</h1>
      <p className="text-gray-300">
        Dúvidas, sugestões ou parcerias? Envie um e-mail para{" "}
        <a href="mailto:contato@radarcripto.space" className="underline">
          contato@radarcripto.space
        </a>{" "}
        ou chame a gente pelas redes.
      </p>

      <BackToHome />
    </section>
  );
}
