"use client";

import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  logo: string;
  bgColor: string;
  labelBg: string;
}

const restaurants: Restaurant[] = [
  {
    id: "mcdonalds",
    name: "McDonald's London",
    logo: "/images/restaurants/mcdonalds.svg",
    bgColor: "bg-red-600",
    labelBg: "bg-primary-300",
  },
  {
    id: "papajohns",
    name: "Papa Johns",
    logo: "/images/restaurants/papajohns.svg",
    bgColor: "bg-green-700",
    labelBg: "bg-primary-300",
  },
  {
    id: "kfc",
    name: "KFC West London",
    logo: "/images/restaurants/kfc.svg",
    bgColor: "bg-red-600",
    labelBg: "bg-primary-300",
  },
  {
    id: "texas",
    name: "Texas Chicken",
    logo: "/images/restaurants/texas.svg",
    bgColor: "bg-white",
    labelBg: "bg-primary-300",
  },
  {
    id: "burgerking",
    name: "Burger King",
    logo: "/images/restaurants/burgerking.svg",
    bgColor: "bg-orange-500",
    labelBg: "bg-primary-300",
  },
  {
    id: "shaurma",
    name: "Shaurma 1",
    logo: "/images/restaurants/shaurma.svg",
    bgColor: "bg-white",
    labelBg: "bg-primary-300",
  },
];

export function PopularRestaurants() {
  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-black-500">
          Popular Restaurants
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            href={`/client/restaurant/${restaurant.id}`}
            className="group"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
              {/* Logo section with brand color */}
              <div
                className={`${restaurant.bgColor} h-40 flex items-center justify-center p-6`}
              >
                {/* Placeholder for logo - replace with actual logos */}
                <div className="w-32 h-32 bg-white/90 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-black-500">
                    {restaurant.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Restaurant name */}
              <div className={`${restaurant.labelBg} p-3 text-center`}>
                <h3 className="font-bold text-sm text-black-500">
                  {restaurant.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
