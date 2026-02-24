"use client";

import { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { useFranchise } from "@/hooks/use-franchises";
import { useCatalogSearch } from "@/hooks/use-catalog-search";
import { useCatalogContent } from "@/hooks/use-catalog-content";
import { useCatalogCategories } from "@/hooks/use-catalog-categories";
import { MenuCard } from "./_components/MenuCard";
import { DishGridItem } from "@/components/DishGridItem";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 300;

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearchQuery(searchQuery),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(t);
  }, [searchQuery]);

  const hasSearch = debouncedSearchQuery.trim().length > 0;

  const {
    data: franchise,
    isLoading: loadingFranchise,
    isError,
  } = useFranchise(id);
  const franchiseId = franchise?.id;

  const { data: categories = [], isLoading: loadingCategories } =
    useCatalogCategories();

  // Recherche texte : GET /catalog/search?q= (optionnel : franchiseId)
  const { data: searchResult, isLoading: loadingSearch } = useCatalogSearch(
    debouncedSearchQuery,
    franchiseId,
  );

  // Un seul appel : GET /catalog/content?franchiseId=&categoryId= (menus + plats, filtre catégorie)
  const contentParams = useMemo(
    () => ({
      franchiseId,
      categoryId: activeCategoryId !== "all" ? activeCategoryId : undefined,
    }),
    [franchiseId, activeCategoryId],
  );
  const { data: contentResult, isLoading: loadingContent } = useCatalogContent(
    contentParams,
    {
      enabled: !!franchiseId && !hasSearch,
    },
  );

  const isLoading =
    loadingFranchise ||
    loadingCategories ||
    (hasSearch ? loadingSearch : loadingContent);

  const franchiseMenus =
    hasSearch && searchResult
      ? searchResult.menus
      : (contentResult?.menus ?? []);
  const franchiseDishes =
    hasSearch && searchResult
      ? searchResult.dishes
      : (contentResult?.dishes ?? []);

  const dishesByMenuId = useMemo(
    () =>
      franchiseDishes.reduce<Record<string, typeof franchiseDishes>>(
        (acc, dish) => {
          if (dish.menuId) {
            acc[dish.menuId] = [...(acc[dish.menuId] ?? []), dish];
          }
          return acc;
        },
        {},
      ),
    [franchiseDishes],
  );

  const filteredDishes = franchiseDishes;
  const menuIdsWithDishes = new Set(
    filteredDishes.map((d) => d.menuId).filter(Boolean),
  );
  const filteredMenus =
    hasSearch && debouncedSearchQuery.trim().length > 0
      ? franchiseMenus
      : franchiseMenus.filter(
          (menu) =>
            menuIdsWithDishes.has(menu.id) ||
            menu.name
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
            (menu.description
              ?.toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ??
              false),
        );

  const isEmpty = filteredMenus.length === 0 && filteredDishes.length === 0;

  const initials =
    franchise?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "";

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (isError || !franchise) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-destructive">Restaurant introuvable.</p>
        <button
          onClick={() => router.push("/restaurants")}
          className="text-sm underline text-black-400"
        >
          Retour aux restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner */}
      <div className="relative h-64 md:h-80 w-full bg-secondary-500 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <span className="text-5xl font-bold text-white">{initials}</span>
        </div>

        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.back()}
            className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-linear-to-t from-black/60 to-transparent">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-1">
              {franchise.name}
            </h1>
            {/* Durée et prix de livraison estimés — non disponibles dans le modèle Franchise */}
            {/* <div className="flex items-center gap-4 text-sm md:text-base">
                            <span>Durée estimée</span>
                            <span>Prix de livraison</span>
                        </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Informations franchise */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Informations</h2>

          <div className="flex items-start gap-3 text-black-500">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-secondary-500" />
            <span>
              {franchise.street}, {franchise.zip} {franchise.city}
              {franchise.state ? `, ${franchise.state}` : ""}
            </span>
          </div>

          {franchise.phone && (
            <div className="flex items-center gap-3 text-black-500">
              <Phone className="w-5 h-5 shrink-0 text-secondary-500" />
              <span>{franchise.phone}</span>
            </div>
          )}

          {franchise.email && (
            <div className="flex items-center gap-3 text-black-500">
              <Mail className="w-5 h-5 shrink-0 text-secondary-500" />
              <span>{franchise.email}</span>
            </div>
          )}
        </div>

        {/* Recherche + filtres par catégorie */}
        <div className="flex gap-5 items-center bg-gray-50/90 backdrop-blur-md z-10 py-4 -mx-4 px-4 border-b border-gray-100 mb-8">
          <SearchInput
            placeholder="Rechercher un menu ou un plat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-full shadow-sm border-gray-200 bg-white w-full md:w-80"
          />

          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveCategoryId("all")}
                className={cn(
                  "px-4 py-2 rounded-full whitespace-nowrap border transition-colors text-sm",
                  activeCategoryId === "all"
                    ? "bg-black text-white border-black"
                    : "bg-white hover:bg-gray-100",
                )}
              >
                Tout
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full whitespace-nowrap border transition-colors text-sm",
                    activeCategoryId === cat.id
                      ? "bg-black text-white border-black"
                      : "bg-white hover:bg-gray-100",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section menus */}
        {filteredMenus.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Menus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenus.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  dishes={dishesByMenuId[menu.id] ?? []}
                  restaurantId={id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section plats */}
        {filteredDishes.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Plats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <DishGridItem key={dish.id} dish={dish} restaurantId={id} />
              ))}
            </div>
          </section>
        )}

        {isEmpty && (
          <p className="text-black-400 text-center py-16">
            {debouncedSearchQuery
              ? "Aucun résultat trouvé."
              : "Aucun menu ni plat disponible pour ce restaurant."}
          </p>
        )}
      </div>
    </div>
  );
}
