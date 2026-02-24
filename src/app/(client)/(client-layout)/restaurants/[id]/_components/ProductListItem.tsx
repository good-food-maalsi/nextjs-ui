"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import type { Product } from "@/services/restaurant.service";
import { cartActions } from "@/lib/store/cart.store";
import { toast } from "sonner";

interface ProductListItemProps {
    product: Product;
    restaurantId: string;
}

export function ProductListItem({ product, restaurantId }: ProductListItemProps) {
    const addToCart = () => {
        cartActions.addToCart(product, restaurantId);
        toast.success(`${product.name} ajouté au panier`);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:border-gray-200 transition-colors">
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="font-medium">{product.price.toFixed(2)} €</span>
                    <button
                        onClick={addToCart}
                        className="bg-secondary-50 hover:bg-secondary-100 text-secondary-600 p-2 rounded-full transition-colors group"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
            {product.image && (
                <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
        </div>
    );
}
