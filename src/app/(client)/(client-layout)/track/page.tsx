"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OrderTracker, type OrderStatus } from "./_components/OrderTracker";

export default function TrackingPage() {
    const [status, setStatus] = useState<OrderStatus>("confirmed");
    const [timeLeft, setTimeLeft] = useState(25);

    // Simulate order progression
    useEffect(() => {
        const sequence: { status: OrderStatus; delay: number }[] = [
            { status: "confirmed", delay: 0 },
            { status: "preparing", delay: 3000 },
            { status: "delivering", delay: 8000 },
            { status: "delivered", delay: 15000 },
        ];

        sequence.forEach(({ status: newStatus, delay }) => {
            setTimeout(() => {
                setStatus(newStatus);
            }, delay);
        });
    }, []);

    // Simulate countdown
    useEffect(() => {
        if (status === "delivered") return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 60000); // Decrease every minute

        return () => clearInterval(interval);
    }, [status]);

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Suivi de commande</h1>

                {/* Map Placeholder */}
                <div className="bg-gray-100 rounded-xl h-64 w-full mb-8 relative overflow-hidden flex items-center justify-center border border-gray-200">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_unavailable.svg')] bg-cover bg-center" />
                    <div className="z-10 bg-white/80 p-6 rounded-lg backdrop-blur-sm text-center shadow-sm">
                        {status === "delivered" ? (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-4xl">🎉</span>
                                <h3 className="text-xl font-bold">Commande livrée !</h3>
                                <p className="text-gray-500">Bon appétit !</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-4xl text-black font-bold">{timeLeft} min</span>
                                <p className="text-gray-500 font-medium">Heure de livraison estimée</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Tracker */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <OrderTracker currentStatus={status} />
                </div>

                {/* Mock Order Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Détails de la commande</h2>
                        <Link href="#" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
                            Aide <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🍔</div>
                            <div className="flex-1">
                                <div className="flex justify-between font-medium">
                                    <span>2x Menu Big King</span>
                                    <span>18.00 €</span>
                                </div>
                                <p className="text-sm text-gray-500">Frites moyennes, Coca-Cola</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🍟</div>
                            <div className="flex-1">
                                <div className="flex justify-between font-medium">
                                    <span>1x Onion Rings (6 pcs)</span>
                                    <span>3.50 €</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Sous-total</span>
                                <span>21.50 €</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Frais de livraison</span>
                                <span>2.99 €</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-4">
                                <span>Total</span>
                                <span>24.49 €</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
