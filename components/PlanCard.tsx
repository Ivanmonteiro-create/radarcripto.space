import Link from "next/link";

type Plan = {
  name: string;
  price: string;
  features: string[];
  ctaHref: string;
  highlight?: boolean;
  ribbon?: string;
};

export default function PlanCard({ name, price, features, ctaHref, highlight, ribbon }: Plan) {
  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col ${
        highlight ? "border-emerald-500/70 bg-emerald-500/5" : "border-gray-800 bg-gray-900/40"
      }`}
    >
      {ribbon && (
        <div className="absolute -top-2 right-4 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">
          {ribbon}
        </div>
      )}

      <h3 className="text-xl font-semibold">{name}</h3>
      <p className={`mt-1 ${highlight ? "text-emerald-400" : "text-gray-300"}`}>{price}</p>

      <ul className="mt-4 space-y-2 text-gray-200 text-sm">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`mt-6 inline-flex w-full justify-center rounded-lg px-4 py-2 font-medium ${
          highlight
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "border border-gray-700 hover:bg-gray-800"
        }`}
      >
        Assinar {name}
      </Link>
    </div>
  );
}
