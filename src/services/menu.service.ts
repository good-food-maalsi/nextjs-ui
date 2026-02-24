import { catalogClient } from "@/lib/config/ts-rest-client";
import type {
  Menu,
  CreateMenuInput,
  UpdateMenuInput,
} from "@good-food-maalsi/contracts/catalog";

async function findAll(): Promise<Menu[]> {
  const response = await catalogClient.menus.getAll({});
  if (response.status !== 200) throw new Error("Failed to fetch menus");
  return response.body.data;
}

async function findById(id: string): Promise<Menu> {
  const response = await catalogClient.menus.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Menu not found");
  return response.body.data;
}

async function create(data: CreateMenuInput): Promise<Menu> {
  const response = await catalogClient.menus.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create menu");
  return response.body.data;
}

async function update(id: string, data: UpdateMenuInput): Promise<Menu> {
  const response = await catalogClient.menus.update({ params: { id }, body: data });
  if (response.status !== 200) throw new Error("Failed to update menu");
  return response.body.data;
}

async function deleteMenu(id: string): Promise<void> {
  const response = await catalogClient.menus.delete({ params: { id }, body: {} });
  if (response.status !== 200) throw new Error("Failed to delete menu");
}

export const menuService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteMenu,
};
