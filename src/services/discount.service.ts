import { catalogClient } from "@/lib/config/ts-rest-client";
import type {
  Discount,
  CreateDiscountInput,
  UpdateDiscountInput,
} from "@good-food-maalsi/contracts/catalog";

async function findAll(): Promise<Discount[]> {
  const response = await catalogClient.discounts.getAll({});
  if (response.status !== 200) throw new Error("Failed to fetch discounts");
  return response.body.data;
}

async function findById(id: string): Promise<Discount> {
  const response = await catalogClient.discounts.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Discount not found");
  return response.body.data;
}

async function create(data: CreateDiscountInput): Promise<Discount> {
  const response = await catalogClient.discounts.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create discount");
  return response.body.data;
}

async function update(id: string, data: UpdateDiscountInput): Promise<Discount> {
  const response = await catalogClient.discounts.update({ params: { id }, body: data });
  if (response.status !== 200) throw new Error("Failed to update discount");
  return response.body.data;
}

async function deleteDiscount(id: string): Promise<void> {
  const response = await catalogClient.discounts.delete({ params: { id }, body: {} });
  if (response.status !== 200) throw new Error("Failed to delete discount");
}

export const discountService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteDiscount,
};
