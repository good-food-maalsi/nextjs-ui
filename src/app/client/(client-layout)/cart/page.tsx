"use client";

import Link from "next/link";
import { useSelector } from "@legendapp/state/react";
import { ShoppingBag } from "lucide-react";
import { cartState$, cartActions } from "@/lib/store/cart.store";
import type { CartItem as CartItemType } from "@/lib/store/cart.store";
import { CartItem } from "./_components/CartItem";
import { OrderSummary } from "./_components/OrderSummary";

export default function CartPage() {
    const cartItems = useSelector(cartState$.items);

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-24 h-24 text-gray-300" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
                <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Go ahead and explore our menu.</p>
                <Link
                    href="/client/restaurants"
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Parcourir les restaurants
                </Link>
            </div>
        );
    }

    // Force cast the filtered array to ensure TS knows it contains only CartItemType
    const validItems = cartItems.filter((item) => !!item) as CartItemType[];

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {validItems.map((item) => (
                        <CartItem key={`${item.id}-${item.restaurantId}`} item={item} />
                    ))}

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => {
                                if (confirm('Voulez-vous vraiment vider votre panier ?')) {
                                    cartActions.clearCart();
                                }
                            }}
                            className="text-red-500 text-sm hover:underline"
                        >
                            Vider le panier
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}
