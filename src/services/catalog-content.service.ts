import { catalogClient } from "@/lib/config/ts-rest-client";
import type { Dish, Menu } from "@good-food/contracts/catalog";

/** GET /catalog/content — menus + plats en un seul appel, filtrés par categoryId et/ou franchiseId. */
export async function getContent(params: {
  franchiseId?: string;
  categoryId?: string;
}): Promise<{ menus: Menu[]; dishes: Dish[] }> {
  const query: { franchiseId?: string; categoryId?: string } = {};
  if (params.franchiseId != null) query.franchiseId = params.franchiseId;
  if (params.categoryId != null) query.categoryId = params.categoryId;
  const response = await catalogClient.content.getContent({
    query: Object.keys(query).length > 0 ? query : {},
  });
  if (response.status !== 200)
    throw new Error("Failed to fetch catalog content");
  return response.body.data;
}
