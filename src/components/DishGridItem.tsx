"use client";

import Image from "next/image";
import type { Dish } from "@good-food-maalsi/contracts/catalog";

interface DishGridItemProps {
  dish: Dish;
  /** "card" = carte complète (grille), "compact" = ligne dans un menu */
  variant?: "card" | "compact";
}

export function DishGridItem({ dish, variant = "card" }: DishGridItemProps) {
  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{dish.name}</p>
          {dish.description && (
            <p className="text-gray-500 text-xs truncate mt-0.5">
              {dish.description}
            </p>
          )}
        </div>
        <span className="font-medium text-sm shrink-0">
          {dish.basePrice.toFixed(2)} €
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="relative h-48 w-full bg-gray-100">
        {dish.imageUrl ? (
          <Image
            src={dish.imageUrl}
            alt={dish.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Pas d’image
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{dish.name}</h3>
          <span className="font-medium">{dish.basePrice.toFixed(2)} €</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2">{dish.description}</p>
      </div>
    </div>
  );
}
