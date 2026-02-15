"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/services/restaurant.service";
import { cartActions } from "@/lib/store/cart.store";
import { toast } from "sonner";

interface ProductGridItemProps {
    product: Product & { restaurantId: string; restaurantName: string };
}

export function ProductGridItem({ product }: ProductGridItemProps) {
    const addToCart = () => {
        cartActions.addToCart(product, product.restaurantId);
        toast.success(`${product.name} ajouté au panier`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                    {product.restaurantName}
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <span className="font-medium">{product.price.toFixed(2)} €</span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                <button
                    onClick={addToCart}
                    className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Ajouter au panier
                </button>
            </div>
        </div>
    );
}
