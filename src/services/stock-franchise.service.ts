import { franchiseClient } from "@/lib/config/ts-rest-client";
import type {
  StockWithIngredient,
  CreateStockFranchiseInput,
  UpdateStockFranchiseInput,
} from "@good-food/contracts/franchise";

interface StockFranchiseResponse {
  data: StockWithIngredient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function findAll(params: {
  page?: number;
  limit?: number;
  search?: string;
  franchise_id: string;
}): Promise<StockFranchiseResponse> {
  const response = await franchiseClient.stocks.getAll({ query: params });
  if (response.status !== 200) throw new Error("Failed to fetch stocks");
  return response.body as StockFranchiseResponse;
}

async function findById(id: string): Promise<StockWithIngredient> {
  const response = await franchiseClient.stocks.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Stock not found");
  return response.body as StockWithIngredient;
}

async function create(
  data: CreateStockFranchiseInput,
): Promise<StockWithIngredient> {
  const response = await franchiseClient.stocks.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create stock");
  return response.body as StockWithIngredient;
}

async function update(
  id: string,
  data: UpdateStockFranchiseInput,
): Promise<StockWithIngredient> {
  const response = await franchiseClient.stocks.update({
    params: { id },
    body: data,
  });
  if (response.status !== 200) throw new Error("Failed to update stock");
  return response.body as StockWithIngredient;
}

async function deleteStock(id: string): Promise<void> {
  const response = await franchiseClient.stocks.delete({
    params: { id },
    body: {},
  });
  if (response.status !== 200) throw new Error("Failed to delete stock");
}

export const stockFranchiseService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteStock,
};
