"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import type { Restaurant } from "@/services/restaurant.service";
import { restaurantService } from "@/services/restaurant.service";
import { cn } from "@/lib/utils";
import { ProductListItem } from "./_components/ProductListItem";

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("all");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await restaurantService.getRestaurantById(resolvedParams.id);
                if (data) {
                    setRestaurant(data);
                } else {
                    router.push("/client/restaurants");
                }
            } catch (error) {
                console.error("Failed to fetch restaurant:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams.id, router]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Chargement...</div>;
    }

    if (!restaurant) return null;

    const filteredProducts = activeCategory === "all"
        ? restaurant.products
        : restaurant.products.filter(p => p.categoryId === activeCategory);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Banner */}
            <div className="relative h-64 md:h-80 w-full">
                <Image
                    src={restaurant.image}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute top-4 left-4">
                    <button
                        onClick={() => router.back()}
                        className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <div className="container mx-auto">
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">{restaurant.name}</h1>
                        <div className="flex items-center gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">{restaurant.rating}</span>
                            </div>
                            <span>• {restaurant.categories.map(c => c.name).join(", ")}</span>
                            <span>• {restaurant.deliveryTime}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide sticky top-[72px] z-40 bg-gray-50 pt-2">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={cn(
                            "px-4 py-2 rounded-full whitespace-nowrap transition-colors border",
                            activeCategory === "all"
                                ? "bg-black text-white border-black"
                                : "bg-white text-black hover:bg-gray-100 border-gray-200"
                        )}
                    >
                        Tout
                    </button>
                    {restaurant.categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "px-4 py-2 rounded-full whitespace-nowrap transition-colors border",
                                activeCategory === cat.id
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black hover:bg-gray-100 border-gray-200"
                            )}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProducts.map(product => (
                        <ProductListItem key={product.id} product={product} restaurantId={restaurant.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}
