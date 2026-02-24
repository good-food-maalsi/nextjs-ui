"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import type { Dish } from "@good-food/contracts/catalog";
import { cartActions } from "@/lib/store/cart.store";
import { useProfileGateway } from "@/hooks/use-auth-gateway";
import { toast } from "sonner";

interface DishGridItemProps {
  dish: Dish;
  /** "card" = carte complète (grille), "compact" = ligne dans un menu */
  variant?: "card" | "compact";
  /** Required for "Add to Cart" functionality */
  restaurantId?: string;
}

export function DishGridItem({
  dish,
  variant = "card",
  restaurantId,
}: DishGridItemProps) {
  const router = useRouter();
  const { data: profile } = useProfileGateway();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    // Auth check
    if (!profile || profile.role !== "CUSTOMER") {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    if (!restaurantId) {
      toast.error("ID restaurant manquant");
      return;
    }

    // Add to cart (async with backend sync)
    setIsAdding(true);
    try {
      await cartActions.addToCart(dish, restaurantId);
      toast.success(`${dish.name} ajouté au panier`);
    } catch (error) {
      toast.error("Échec de l'ajout au panier");
    } finally {
      setIsAdding(false);
    }
  };

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
            Pas d'image
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{dish.name}</h3>
          <span className="font-medium">{dish.basePrice.toFixed(2)} €</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {dish.description}
        </p>

        {restaurantId && (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800
                       transition-colors flex items-center justify-center gap-2 mt-auto
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? "Ajout..." : "Ajouter au panier"}
          </button>
        )}
      </div>
    </div>
  );
}
