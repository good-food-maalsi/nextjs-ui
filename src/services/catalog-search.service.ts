import { catalogClient } from "@/lib/config/ts-rest-client";
import type { Dish, Menu } from "@good-food-maalsi/contracts/catalog";

/** GET /catalog/search?q= — recherche insensible à la casse dans nom + description (dishes + menus). Optionnel : franchiseId pour limiter à une franchise. */
export async function search(
  q: string,
  franchiseId?: string,
): Promise<{ dishes: Dish[]; menus: Menu[] }> {
  const trimmed = typeof q === "string" ? q.trim().slice(0, 200) : "";
  if (!trimmed) {
    return { dishes: [], menus: [] };
  }
  const query: { q: string; franchiseId?: string } = { q: trimmed };
  if (franchiseId != null) query.franchiseId = franchiseId;
  const response = await catalogClient.search.search({ query });
  if (response.status !== 200) throw new Error("Search failed");
  const data = response.body.data as {
    dishes?: Dish[];
    menus?: Menu[];
    Dishes?: Dish[];
    Menus?: Menu[];
  };
  return {
    dishes: data.dishes ?? data.Dishes ?? [],
    menus: data.menus ?? data.Menus ?? [],
  };
}
