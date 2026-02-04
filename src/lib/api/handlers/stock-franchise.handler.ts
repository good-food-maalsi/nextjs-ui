import { stockFranchiseRepository } from "../repositories/stock-franchise.repository";
import { ingredientRepository } from "../repositories/ingredient.repository";
import { franchiseRepository } from "../repositories/franchise.repository";
import type {
  CreateStockFranchiseInput,
  UpdateStockFranchiseInput,
  StockFranchiseQueryParams,
} from "../validators/stock-franchise.validator";
import { NotFoundError, ConflictError} from "../errors/api-error";
import { ensureExists } from "../../utils/validators";

export const stockFranchiseHandler = {
  async getStocks(params: StockFranchiseQueryParams) {
    await ensureExists(franchiseRepository, params.franchise_id, "Franchise");
    return stockFranchiseRepository.findAll(params);
  },

  async getStockById(id: string) {
    const stock = await stockFranchiseRepository.findById(id);
    if (!stock) {
      throw new NotFoundError(`Stock with ID ${id} not found`);
    }
    return stock;
  },

  async createStock(data: CreateStockFranchiseInput) {
    await Promise.all([
      ensureExists(franchiseRepository, data.franchise_id, "Franchise"),
      ensureExists(ingredientRepository, data.ingredient_id, "Ingredient"),
    ]);

    const existing = await stockFranchiseRepository.findByFranchiseAndIngredient(
      data.franchise_id,
      data.ingredient_id
    );

    if (existing) {
      throw new ConflictError(
        "Stock already exists for this franchise and ingredient"
      );
    }

    return stockFranchiseRepository.create(data);
  },

  async updateStock(id: string, data: UpdateStockFranchiseInput) {
    await ensureExists(stockFranchiseRepository, id, "Stock");
    return stockFranchiseRepository.update(id, data);
  },

  async deleteStock(id: string) {
    await ensureExists(stockFranchiseRepository, id, "Stock");
    await stockFranchiseRepository.delete(id);
    return { message: "Stock deleted successfully" };
  },
};
