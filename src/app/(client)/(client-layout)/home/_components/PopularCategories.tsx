"use client";

import Link from "next/link";
import { useCatalogCategories } from "@/hooks/use-catalog-categories";

const BG_COLORS = [
  "bg-primary-200",
  "bg-gray-200",
  "bg-gray-200",
  "bg-gray-200",
  "bg-gray-200",
  "bg-blue-100",
];

export function PopularCategories() {
  const { data: categories = [], isLoading, isError } = useCatalogCategories();

  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-black-500">
          Catégories populaires 🍔
        </h2>
      </div>

      {isLoading && (
        <div className="text-black-400 text-sm py-8">
          Chargement des catégories...
        </div>
      )}
      {isError && (
        <div className="text-destructive text-sm py-8">
          Impossible de charger les catégories.
        </div>
      )}
      {!isLoading && !isError && categories.length === 0 && (
        <div className="text-black-400 text-sm py-8">
          Aucune catégorie pour le moment.
        </div>
      )}
      {!isLoading && !isError && categories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group"
            >
              <div className="relative">
                <div
                  className={`${BG_COLORS[index % BG_COLORS.length]} rounded-3xl p-6 hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl`}
                >
                  <div className="relative w-full aspect-square mb-4 rounded-full overflow-hidden bg-white shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary-300 to-primary-400 opacity-40" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-base text-black-500 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-black-400">Menus</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
