"use client";

import Link from "next/link";

interface Category {
  id: string;
  name: string;
  restaurantCount: number;
  image: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    id: "burgers",
    name: "Burgers & Fast food",
    restaurantCount: 21,
    image: "/images/categories/burger.jpg",
    bgColor: "bg-primary-200",
  },
  {
    id: "salads",
    name: "Salads",
    restaurantCount: 32,
    image: "/images/categories/salad.jpg",
    bgColor: "bg-gray-200",
  },
  {
    id: "pasta",
    name: "Pasta & Casuals",
    restaurantCount: 4,
    image: "/images/categories/pasta.jpg",
    bgColor: "bg-gray-200",
  },
  {
    id: "pizza",
    name: "Pizza",
    restaurantCount: 32,
    image: "/images/categories/pizza.jpg",
    bgColor: "bg-gray-200",
  },
  {
    id: "breakfast",
    name: "Breakfast",
    restaurantCount: 4,
    image: "/images/categories/breakfast.jpg",
    bgColor: "bg-gray-200",
  },
  {
    id: "soups",
    name: "Soups",
    restaurantCount: 32,
    image: "/images/categories/soup.jpg",
    bgColor: "bg-blue-100",
  },
];

export function PopularCategories() {
  return (
    <section className="py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-black-500">
          Commander.fr Catégories populaires 🍔
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/client/category/${category.id}`}
            className="group"
          >
            <div className="relative">
              {/* Category card */}
              <div
                className={`${category.bgColor} rounded-3xl p-6 hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-xl`}
              >
                {/* Image container - circular */}
                <div className="relative w-full aspect-square mb-4 rounded-full overflow-hidden bg-white shadow-lg">
                  {/* Placeholder - replace with actual food images */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary-300 to-primary-400 opacity-40" />
                  </div>
                </div>

                {/* Category info */}
                <div className="text-center">
                  <h3 className="font-bold text-base text-black-500 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-black-400">
                    {category.restaurantCount} Restaurants
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
