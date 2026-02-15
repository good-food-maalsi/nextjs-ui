import { franchiseClient } from "@/lib/config/ts-rest-client";
import type {
  Supplier,
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@good-food-maalsi/contracts/franchise";

interface SuppliersResponse {
  data: Supplier[];
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
): Promise<SuppliersResponse> {
  const response = await franchiseClient.suppliers.getAll({ query: params });
  if (response.status !== 200) throw new Error("Failed to fetch suppliers");
  return response.body as SuppliersResponse;
}

async function findById(id: string): Promise<Supplier> {
  const response = await franchiseClient.suppliers.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Supplier not found");
  return response.body as Supplier;
}

async function create(data: CreateSupplierInput): Promise<Supplier> {
  const response = await franchiseClient.suppliers.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create supplier");
  return response.body as Supplier;
}

async function update(
  id: string,
  data: UpdateSupplierInput,
): Promise<Supplier> {
  const response = await franchiseClient.suppliers.update({
    params: { id },
    body: data,
  });
  if (response.status !== 200) throw new Error("Failed to update supplier");
  return response.body as Supplier;
}

async function deleteSupplier(id: string): Promise<void> {
  const response = await franchiseClient.suppliers.delete({
    params: { id },
    body: {},
  });
  if (response.status !== 200) throw new Error("Failed to delete supplier");
}

export const supplierService = {
  findAll,
  findById,
  create,
  update,
  delete: deleteSupplier,
};
