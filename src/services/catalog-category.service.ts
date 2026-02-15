import { catalogClient } from "@/lib/config/ts-rest-client";
import type {
  CatalogCategory,
  CreateCatalogCategoryInput,
  UpdateCatalogCategoryInput,
} from "@good-food-maalsi/contracts/catalog";

async function findAll(): Promise<CatalogCategory[]> {
  const response = await catalogClient.categories.getAll({});
  if (response.status !== 200) throw new Error("Failed to fetch catalog categories");
  return response.body.data;
}

async function findById(id: string): Promise<CatalogCategory> {
  const response = await catalogClient.categories.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Category not found");
  return response.body.data;
}

async function create(data: CreateCatalogCategoryInput): Promise<CatalogCategory> {
  const response = await catalogClient.categories.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create category");
  return response.body.data;
}

async function update(id: string, data: UpdateCatalogCategoryInput): Promise<CatalogCategory> {
  const response = await catalogClient.categories.update({ params: { id }, body: data });
  if (response.status !== 200) throw new Error("Failed to update category");
  return response.body.data;
}

async function deleteCategory(id: string): Promise<void> {
  const response = await catalogClient.categories.delete({ params: { id }, body: {} });
  if (response.status !== 200) throw new Error("Failed to delete category");
}

export const catalogCategoryService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteCategory,
};
