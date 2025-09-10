// app/checkout/page.tsx
import { redirect } from "next/navigation";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const validPlans = new Set(["free", "pro", "expert"]);

export default function CheckoutPage({ searchParams }: Props) {
  const plan = (searchParams?.plan as string) || "free";

  if (!validPlans.has(plan)) {
    redirect("/plans");
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold">Confirmação</h1>
      <p className="text-gray-300 mt-2">
        Plano selecionado: <span className="font-semibold uppercase">{plan}</span>
      </p>

      <div className="mt-6 rounded-xl border border-gray-800 p-6 bg-gray-900/50">
        <p className="text-gray-200">
          Aqui entra o checkout real (Stripe) na próxima etapa. Por enquanto,
          este é um passo de confirmação só para garantir o fluxo e as métricas
          de intenção.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="/plans"
            className="rounded-lg border border-gray-700 px-4 py-2 hover:bg-gray-800"
          >
            Voltar aos planos
          </a>
          <a
            href="/simulator"
            className="rounded-lg bg-emerald-600 px-4 py-2 hover:bg-emerald-700"
          >
            Usar simulador
          </a>
        </div>
      </div>
    </section>
  );
}
