import { franchiseClient } from "@/lib/config/ts-rest-client";
import type {
  CreateIngredientInput,
  UpdateIngredientInput,
  IngredientWithCategories,
} from "@good-food-maalsi/contracts/franchise";

interface IngredientsResponse {
  data: IngredientWithCategories[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

async function findAll(
  params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {},
): Promise<IngredientsResponse> {
  const response = await franchiseClient.ingredients.getAll({ query: params });
  if (response.status !== 200) throw new Error("Failed to fetch ingredients");
  return response.body as IngredientsResponse;
}

async function findById(id: string): Promise<IngredientWithCategories> {
  const response = await franchiseClient.ingredients.getById({
    params: { id },
  });
  if (response.status !== 200) throw new Error("Ingredient not found");
  return response.body as IngredientWithCategories;
}

async function create(
  data: CreateIngredientInput,
): Promise<IngredientWithCategories> {
  const response = await franchiseClient.ingredients.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create ingredient");
  return response.body as IngredientWithCategories;
}

async function update(
  id: string,
  data: UpdateIngredientInput,
): Promise<IngredientWithCategories> {
  const response = await franchiseClient.ingredients.update({
    params: { id },
    body: data,
  });
  if (response.status !== 200) throw new Error("Failed to update ingredient");
  return response.body as IngredientWithCategories;
}

async function deleteIngredient(id: string): Promise<void> {
  const response = await franchiseClient.ingredients.delete({
    params: { id },
    body: {},
  });
  if (response.status !== 200) throw new Error("Failed to delete ingredient");
}

export const ingredientService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteIngredient,
};
