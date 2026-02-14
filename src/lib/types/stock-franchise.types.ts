export interface StockFranchise {
  id: string;
  franchise_id: string;
  ingredient_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  ingredient: {
    id: string;
    name: string;
    description: string | null;
    unit_price: number;
    supplier: {
      id: string;
      name: string;
    };
  };
  franchise: {
    id: string;
    name: string;
  };
}

export interface StockFranchiseDisplay {
  id: string;
  ingredient_nom: string;
  supplier_nom: string;
  quantite: number;
  prix_unitaire: number;
}

export interface CreateStockFranchiseInput {
  franchise_id: string;
  ingredient_id: string;
  quantity: number;
}

export interface UpdateStockFranchiseInput {
  quantity: number;
}

export interface StockFranchiseResponse {
  data: StockFranchise[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
