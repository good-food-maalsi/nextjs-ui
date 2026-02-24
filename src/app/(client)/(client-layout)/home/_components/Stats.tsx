"use client";

interface Stat {
  id: string;
  number: string;
  label: string;
}

const stats: Stat[] = [
  {
    id: "riders",
    number: "546+",
    label: "Livreurs chevronnés",
  },
  {
    id: "orders",
    number: "789,900+",
    label: "Commande livrées",
  },
  {
    id: "franchises",
    number: "690+",
    label: "Franchises partenaires",
  },
  {
    id: "dishes",
    number: "17,457+",
    label: "Plats",
  },
];

export function Stats() {
  return (
    <section className="py-12">
      <div className="bg-secondary-500 rounded-3xl px-8 py-12 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-center text-center relative"
            >
              {/* Divider line (except for last item) */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-white/30" />
              )}

              <h3 className="text-5xl font-bold text-white mb-2">
                {stat.number}
              </h3>
              <p className="text-white text-lg font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
