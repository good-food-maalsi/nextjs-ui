"use client";

import { Check, Clock, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = "confirmed" | "preparing" | "delivering" | "delivered";

interface OrderTrackerProps {
    currentStatus: OrderStatus;
}

const steps = [
    { id: "confirmed", label: "Commande confirmée", icon: Check },
    { id: "preparing", label: "En préparation", icon: Clock },
    { id: "delivering", label: "En cours de livraison", icon: Truck },
    { id: "delivered", label: "Livrée", icon: MapPin },
] as const;

export function OrderTracker({ currentStatus }: OrderTrackerProps) {
    const getCurrentStepIndex = () => {
        return steps.findIndex((step) => step.id === currentStatus);
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="w-full py-6">
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                {/* Progress Bar Background (Desktop) */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 hidden md:block -z-10" />

                {/* Active Progress Bar (Desktop) */}
                <div
                    className="absolute top-5 left-0 h-1 bg-black hidden md:block -z-10 transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                        <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 w-full md:w-auto mb-6 md:mb-0 relative group">
                            {/* Vertical Line for Mobile */}
                            {index !== steps.length - 1 && (
                                <div className={cn(
                                    "absolute left-5 top-10 bottom-[-24px] w-1 md:hidden -z-10",
                                    isActive ? "bg-black" : "bg-gray-200"
                                )} />
                            )}

                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                                    isActive
                                        ? "bg-black border-black text-white scale-110"
                                        : "bg-white border-gray-300 text-gray-300"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex flex-col md:items-center">
                                <span
                                    className={cn(
                                        "text-sm font-bold transition-colors duration-300",
                                        isActive ? "text-black" : "text-gray-400"
                                    )}
                                >
                                    {step.label}
                                </span>
                                {isActive && !isCompleted && index === currentStepIndex && (
                                    <span className="text-xs text-secondary-600 font-medium animate-pulse">
                                        En cours...
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
