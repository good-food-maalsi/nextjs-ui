export interface Ingredient {
  id: string;
  name: string;
  description: string | null;
  supplier_id: string;
  unit_price: number;
  created_at: string;
  updated_at: string;
  supplier: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IngredientDisplay {
  id: string;
  nom: string;
  description: string | null;
  fournisseur: string;
  prix_unitaire: number;
}

export interface CreateIngredientInput {
  name: string;
  description?: string;
  supplier_id: string;
  unit_price: number;
}

export interface UpdateIngredientInput {
  name?: string;
  description?: string;
  supplier_id?: string;
  unit_price?: number;
}

export interface IngredientsResponse {
  data: Ingredient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
