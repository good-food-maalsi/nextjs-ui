"use client";

import { useEffect, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import type { Restaurant } from "@/services/restaurant.service";
import { restaurantService } from "@/services/restaurant.service";
import { ProductGridItem } from "./_components/ProductGridItem";

export default function MenuPage() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await restaurantService.getRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Extract all categories and products
    const allCategories = Array.from(
        new Set(restaurants.flatMap(r => r.categories.map(c => JSON.stringify(c))))
    ).map(s => JSON.parse(s) as { id: string; name: string });

    const allProducts = restaurants.flatMap(r =>
        r.products.map(p => ({ ...p, restaurantId: r.id, restaurantName: r.name }))
    );

    const filteredProducts = allProducts.filter(product => {
        const matchesCategory = activeCategory === "all" || product.categoryId === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Parcourir le menu</h1>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-0 bg-white/80 backdrop-blur-md z-10 py-4 -mx-4 px-4 border-b border-gray-100/50">
                <div className="flex-1">
                    <SearchInput
                        placeholder="Rechercher un plat..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-full shadow-sm border-gray-200 focus-visible:ring-black"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={`px-4 py-2 rounded-full whitespace-nowrap border transition-colors ${activeCategory === "all" ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        Tout
                    </button>
                    {allCategories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap border transition-colors ${activeCategory === cat.id ? "bg-black text-white" : "bg-white hover:bg-gray-100"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <ProductGridItem key={`${product.restaurantId}-${product.id}`} product={product} />
                ))}
            </div>
        </div>
    );
}
