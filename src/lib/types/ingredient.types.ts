// Backend types — re-exported from contracts (single source of truth)
export type {
  CreateIngredientInput,
  Ingredient,
  IngredientQueryParams,
  IngredientWithCategories,
  UpdateIngredientInput,
} from "@good-food-maalsi/contracts/franchise";

// Frontend display type (French labels for UI) — UI-specific, not in contracts
export interface IngredientDisplay {
  id: string;
  nom: string;
  description: string | null;
  fournisseur: string;
  prix_unitaire: number;
}
