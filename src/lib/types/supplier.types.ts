// Backend types — re-exported from contracts (single source of truth)
export type {
  CreateSupplierInput,
  Supplier,
  SupplierQueryParams,
  UpdateSupplierInput,
} from "@good-food/contracts/franchise";

// Frontend display type (French labels for UI) — UI-specific, not in contracts
export interface SupplierDisplay {
  id: string;
  nom: string; // from name
  adresse: string; // computed from lat/long
  telephone: string; // from phone
  email: string;
  logo_url: string | null;
}
