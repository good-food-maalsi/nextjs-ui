"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import type { Menu, Dish } from "@good-food-maalsi/contracts/catalog";
import { DishGridItem } from "@/components/DishGridItem";
import { cartActions } from "@/lib/store/cart.store";
import { useProfileGateway } from "@/hooks/use-auth-gateway";
import { toast } from "sonner";

interface MenuCardProps {
  menu: Menu;
  dishes: Dish[];
  restaurantId: string;
}

export function MenuCard({ menu, dishes, restaurantId }: MenuCardProps) {
  const router = useRouter();
  const { data: profile } = useProfileGateway();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMenuToCart = async () => {
    // Auth check
    if (!profile || profile.role !== "CUSTOMER") {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    // Add all dishes from menu
    setIsAdding(true);
    try {
      for (const dish of dishes) {
        await cartActions.addToCart(dish, restaurantId);
      }
      toast.success(`${menu.name} ajouté au panier`);
    } catch (error) {
      toast.error("Échec de l'ajout du menu au panier");
    } finally {
      setIsAdding(false);
    }
  };

  const totalPrice = dishes.reduce((sum, dish) => sum + dish.basePrice, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{menu.name}</h3>
          <span className="font-medium text-lg">{totalPrice.toFixed(2)} €</span>
        </div>
        {menu.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {menu.description}
          </p>
        )}
      </div>
      {dishes.length > 0 && (
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Plats ({dishes.length})
          </p>
          <ul className="space-y-2 mb-4">
            {dishes.map((dish) => (
              <li key={dish.id}>
                <DishGridItem dish={dish} variant="compact" />
              </li>
            ))}
          </ul>
          <button
            onClick={handleAddMenuToCart}
            disabled={isAdding}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800
                       transition-colors flex items-center justify-center gap-2 mt-auto
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? "Ajout..." : "Ajouter le menu au panier"}
          </button>
        </div>
      )}
    </div>
  );
}
