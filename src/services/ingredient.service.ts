import { gatewayApi } from "@/lib/config/api.config";
import type {
  Ingredient,
  IngredientsResponse,
  CreateIngredientInput,
  UpdateIngredientInput,
} from "@/lib/types/ingredient.types";

interface IIngredientService {
  findAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => Promise<IngredientsResponse>;
  findById: (id: string) => Promise<Ingredient>;
  create: (data: CreateIngredientInput) => Promise<Ingredient>;
  update: (id: string, data: UpdateIngredientInput) => Promise<Ingredient>;
  delete: (id: string) => Promise<void>;
}

const baseURL = "/franchise/ingredients";

export const ingredientService: IIngredientService = {
  async findAll(params = {}) {
    const { data } = await gatewayApi.get(baseURL, { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await gatewayApi.get(`${baseURL}/${id}`);
    return data;
  },

  async create(ingredientData: CreateIngredientInput) {
    const { data } = await gatewayApi.post(baseURL, ingredientData);
    return data;
  },

  async update(id: string, ingredientData: UpdateIngredientInput) {
    const { data } = await gatewayApi.put(`${baseURL}/${id}`, ingredientData);
    return data;
  },

  async delete(id: string) {
    await gatewayApi.delete(`${baseURL}/${id}`);
  },
};
