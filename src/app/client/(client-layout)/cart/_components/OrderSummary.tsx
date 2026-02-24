"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cartActions } from "@/lib/store/cart.store";

export function OrderSummary() {
    const subtotal = cartActions.totalPrice();
    const deliveryFee = 2.99; // Mock fee
    const total = subtotal + deliveryFee;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Frais de livraison</span>
                    <span>{deliveryFee.toFixed(2)} €</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg mt-3">
                    <span>Total</span>
                    <span>{total.toFixed(2)} €</span>
                </div>
            </div>

            <button
                className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                onClick={() => toast.success("Commande envoyée ! (Simulation)")}
            >
                Passer la commande
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}
