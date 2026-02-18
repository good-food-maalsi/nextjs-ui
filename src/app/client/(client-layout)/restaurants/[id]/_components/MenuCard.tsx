"use client";

import type { Menu, Dish } from "@good-food-maalsi/contracts/catalog";
import { DishGridItem } from "@/components/DishGridItem";

interface MenuCardProps {
  menu: Menu;
  dishes: Dish[];
}

export function MenuCard({ menu, dishes }: MenuCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-lg">{menu.name}</h3>
        {menu.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {menu.description}
          </p>
        )}
      </div>
      {dishes.length > 0 && (
        <div className="p-4 flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Plats ({dishes.length})
          </p>
          <ul className="space-y-2">
            {dishes.map((dish) => (
              <li key={dish.id}>
                <DishGridItem dish={dish} variant="compact" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
