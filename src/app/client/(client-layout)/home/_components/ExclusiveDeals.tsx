"use client";

import Link from "next/link";

interface DealCard {
  id: string;
  name: string;
  discount: string;
  image: string;
  category: string;
}

const deals: DealCard[] = [
  {
    id: "1",
    name: "Chef Burgers London",
    discount: "-40%",
    image: "/images/home/bigfood.svg",
    category: "Restaurant",
  },
  {
    id: "2",
    name: "Grand Ai Cafe London",
    discount: "-20%",
    image: "/images/home/bigfood.svg",
    category: "Restaurant",
  },
  {
    id: "3",
    name: "Butterbrot Caf'e London",
    discount: "-17%",
    image: "/images/home/bigfood.svg",
    category: "Restaurant",
  },
];

export function ExclusiveDeals() {
  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-black-500">
          Jusqu'à -40 % 🎊 Offres exclusives Good Food
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            href={`/client/restaurant/${deal.id}`}
            className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Image placeholder with gradient */}
            <div className="relative h-64 bg-gradient-to-br from-black-200 to-black-300">
              {/* Discount badge */}
              <div className="absolute top-4 right-4 bg-black-500 text-white px-4 py-2 rounded-xl font-bold text-lg z-10">
                {deal.discount}
              </div>

              {/* Placeholder for image - you can replace with actual images */}
              <div className="absolute inset-0 bg-gradient-to-br from-mahogany-300 to-secondary-400 opacity-70" />
            </div>

            {/* Card content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black-500/90 to-transparent text-white">
              <p className="text-sm text-secondary-300 mb-1">{deal.category}</p>
              <h3 className="text-2xl font-bold">{deal.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
