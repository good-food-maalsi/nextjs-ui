"use client";

import Link from "next/link";

interface JoinCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgColor: string;
  badge: string;
}

const joinCards: JoinCard[] = [
  {
    id: "partner",
    title: "Devenez notre partenaire",
    subtitle: "Inscrivez-vous en tant que Franchise",
    description: "Gagnez plus avec des frais réduits.",
    buttonText: "Je m'inscris",
    buttonLink: "/partner/signup",
    image: "/images/home/partner.svg",
    bgColor: "bg-black-500",
    badge: "Gagnez plus avec des frais réduits.",
  },
  {
    id: "rider",
    title: "Roulez avec nous",
    subtitle: "Inscrivez-vous en tant que Livreur",
    description: "Profitez d'avantages exclusifs.",
    buttonText: "Je m'inscris",
    buttonLink: "/rider/signup",
    image: "/images/home/rider.svg",
    bgColor: "bg-primary-400",
    badge: "Profitez d'avantages exclusifs.",
  },
];

export function JoinUs() {
  return (
    <section className="py-12">
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-bold text-black-500">Rejoignez nous</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {joinCards.map((card) => (
          <div
            key={card.id}
            className={`relative ${card.bgColor} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group`}
          >
            <div className="relative min-h-[400px] p-8 flex flex-col justify-between">
              {/* Badge at top */}
              <div className="absolute top-6 left-8 z-10">
                <div className="bg-white rounded-2xl px-4 py-2 shadow-lg">
                  <p className="text-sm font-semibold text-black-500">
                    {card.badge}
                  </p>
                </div>
              </div>

              {/* Background image/illustration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-60">
                {/* Placeholder for actual images */}
                <div className="w-full h-full bg-gradient-to-br from-transparent to-black-500/20" />
              </div>

              {/* Content */}
              <div className="relative z-10 mt-auto">
                <p className="text-white text-sm mb-2 font-medium">
                  {card.subtitle}
                </p>
                <h3 className="text-white text-4xl font-bold mb-6 leading-tight">
                  {card.title}
                </h3>

                <Link
                  href={card.buttonLink}
                  className="inline-block bg-secondary-500 hover:bg-secondary-400 text-white font-bold px-8 py-3 rounded-full transition-colors duration-200 shadow-lg"
                >
                  {card.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
