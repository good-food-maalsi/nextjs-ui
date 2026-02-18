import { catalogClient } from "@/lib/config/ts-rest-client";
import type {
  Dish,
  CreateDishInput,
  UpdateDishInput,
  DishIngredient,
  CreateDishIngredientInput,
  UpdateDishIngredientInput,
} from "@good-food-maalsi/contracts/catalog";

async function findAll(params: {
  menuId?: string;
  categoryId?: string;
  franchiseId?: string;
  search?: string;
} = {}): Promise<Dish[]> {
  const query: { menuId?: string; categoryId?: string; franchiseId?: string } = {};
  if (params.menuId != null) query.menuId = params.menuId;
  if (params.categoryId != null) query.categoryId = params.categoryId;
  if (params.franchiseId != null) query.franchiseId = params.franchiseId;
  const response = await catalogClient.dishes.getAll(
    Object.keys(query).length > 0 ? { query } : {},
  );
  if (response.status !== 200) throw new Error("Failed to fetch dishes");
  return response.body.data;
}

async function findById(id: string): Promise<Dish> {
  const response = await catalogClient.dishes.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Dish not found");
  return response.body.data;
}

async function create(data: CreateDishInput): Promise<Dish> {
  const response = await catalogClient.dishes.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create dish");
  return response.body.data;
}

async function update(id: string, data: UpdateDishInput): Promise<Dish> {
  const response = await catalogClient.dishes.update({ params: { id }, body: data });
  if (response.status !== 200) throw new Error("Failed to update dish");
  return response.body.data;
}

async function deleteDish(id: string): Promise<void> {
  const response = await catalogClient.dishes.delete({ params: { id }, body: {} });
  if (response.status !== 200) throw new Error("Failed to delete dish");
}

async function getIngredients(dishId: string): Promise<DishIngredient[]> {
  const response = await catalogClient.dishIngredients.getAll({ params: { id: dishId } });
  if (response.status !== 200) throw new Error("Failed to fetch dish ingredients");
  return response.body.data;
}

async function addIngredient(dishId: string, data: CreateDishIngredientInput): Promise<DishIngredient> {
  const response = await catalogClient.dishIngredients.add({ params: { id: dishId }, body: data });
  if (response.status !== 201) throw new Error("Failed to add ingredient to dish");
  return response.body.data;
}

async function updateIngredient(
  dishId: string,
  ingredientId: string,
  data: UpdateDishIngredientInput
): Promise<DishIngredient> {
  const response = await catalogClient.dishIngredients.update({
    params: { id: dishId, ingredientId },
    body: data,
  });
  if (response.status !== 200) throw new Error("Failed to update dish ingredient");
  return response.body.data;
}

async function removeIngredient(dishId: string, ingredientId: string): Promise<void> {
  const response = await catalogClient.dishIngredients.remove({
    params: { id: dishId, ingredientId },
    body: {},
  });
  if (response.status !== 200) throw new Error("Failed to remove ingredient from dish");
}

export const dishService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteDish,
  getIngredients,
  addIngredient,
  updateIngredient,
  removeIngredient,
};
