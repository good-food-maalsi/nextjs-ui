"use client";

import Image from "next/image";
import { ImageIcon, Minus, Plus, Trash2 } from "lucide-react";
import { cartActions } from "@/lib/store/cart.store";
import type { CartItem as CartItemType } from "@/lib/store/cart.store";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center">
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                )}
            </div>

            <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price.toFixed(2)} €</p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => cartActions.updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium w-4 text-center">{item.quantity}</span>
                <button
                    onClick={() => cartActions.updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <div className="text-right min-w-[80px]">
                <span className="font-bold">{(item.price * item.quantity).toFixed(2)} €</span>
            </div>

            <button
                onClick={() => cartActions.removeFromCart(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
