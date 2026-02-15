// Backend types — re-exported from contracts (single source of truth)
export type {
  CreateStockFranchiseInput,
  Stock,
  StockFranchiseQueryParams,
  StockWithIngredient,
  UpdateStockFranchiseInput,
} from "@good-food/contracts/franchise";

// Backward-compatibility alias
export type { StockWithIngredient as StockFranchise } from "@good-food/contracts/franchise";

// Frontend display type (French labels for UI) — UI-specific, not in contracts
export interface StockFranchiseDisplay {
  id: string;
  ingredient_nom: string;
  supplier_nom: string;
  quantite: number;
  prix_unitaire: number;
}
