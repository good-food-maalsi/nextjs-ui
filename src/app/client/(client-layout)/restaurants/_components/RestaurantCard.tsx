"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Truck } from "lucide-react";
import type { Restaurant } from "@/services/restaurant.service";

interface RestaurantCardProps {
    restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
    return (
        <Link
            href={`/client/restaurants/${restaurant.id}`}
            className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="relative h-48 w-full">
                <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {restaurant.rating}
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-xl font-bold mb-1">{restaurant.name}</h2>
                <p className="text-black-400 text-sm mb-4 line-clamp-2">{restaurant.description}</p>

                <div className="flex items-center gap-4 text-sm text-black-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        <span>{restaurant.deliveryFee === 0 ? "Livraison offerte" : `${restaurant.deliveryFee}€`}</span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {restaurant.categories.slice(0, 3).map((cat) => (
                        <span key={cat.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-black-600">
                            {cat.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
