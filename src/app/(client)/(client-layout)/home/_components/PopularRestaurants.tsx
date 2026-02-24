"use client";

import Link from "next/link";
import { useFranchises } from "@/hooks/use-franchises";

const CARD_COLORS = [
  "bg-red-600",
  "bg-green-700",
  "bg-red-600",
  "bg-white",
  "bg-orange-500",
  "bg-white",
];

export function PopularRestaurants() {
  const { data, isLoading, isError } = useFranchises({ limit: 24 });
  const franchises = data?.data ?? [];

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-black-500">
          Popular Restaurants
        </h2>
      </div>

      {isLoading && (
        <div className="text-black-400 text-sm py-8">
          Chargement des franchises...
        </div>
      )}
      {isError && (
        <div className="text-destructive text-sm py-8">
          Impossible de charger les franchises.
        </div>
      )}
      {!isLoading && !isError && franchises.length === 0 && (
        <div className="text-black-400 text-sm py-8">
          Aucune franchise pour le moment.
        </div>
      )}
      {!isLoading && !isError && franchises.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {franchises.map((franchise, index) => (
            <Link
              key={franchise.id}
              href={`/restaurants/${franchise.id}`}
              className="group"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div
                  className={`${CARD_COLORS[index % CARD_COLORS.length]} h-40 flex items-center justify-center p-6`}
                >
                  <div className="w-32 h-32 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-black-500">
                      {franchise.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="bg-primary-300 p-3 text-center">
                  <h3 className="font-bold text-sm text-black-500">
                    {franchise.name}
                  </h3>
                  {franchise.city && (
                    <p className="text-xs text-black-400 mt-0.5">
                      {franchise.city}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
