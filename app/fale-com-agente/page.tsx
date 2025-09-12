// app/fale-com-agente/page.tsx
export const metadata = { title: "Contato | RadarCrypto" };

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[900px] px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold text-white">Fale com a gente</h1>
      <p className="text-gray-300">
        Canal de contato em breve. Por enquanto, envie um e-mail para{" "}
        <a className="text-emerald-400 underline" href="mailto:contato@radarcrypto.space">
          contato@radarcrypto.space
        </a>.
      </p>
    </main>
  );
}
