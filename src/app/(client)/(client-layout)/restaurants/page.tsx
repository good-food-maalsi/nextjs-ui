"use client";

import { useState } from "react";
import { useFranchises } from "@/hooks/use-franchises";
import { FranchiseCard } from "./_components/FranchiseCard";
import { SearchInput } from "@/components/ui/search-input";

export default function RestaurantsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data, isLoading, isError } = useFranchises({ limit: 50 });

    const franchises = (data?.data ?? []).filter((franchise) => {
        const query = searchQuery.toLowerCase();
        return (
            franchise.name.toLowerCase().includes(query) ||
            franchise.city.toLowerCase().includes(query)
        );
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-destructive">Impossible de charger les restaurants.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold">Nos Restaurants</h1>
                <div className="w-full md:w-72">
                    <SearchInput
                        placeholder="Rechercher un restaurant..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-white"
                    />
                </div>
            </div>

            {franchises.length === 0 ? (
                <p className="text-black-400">Aucun restaurant trouvé.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {franchises.map((franchise) => (
                        <FranchiseCard key={franchise.id} franchise={franchise} />
                    ))}
                </div>
            )}
        </div>
    );
}
