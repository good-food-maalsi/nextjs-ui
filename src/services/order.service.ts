import { commandsClient } from "@/lib/config/ts-rest-client";
import type {
  OrderWithItems,
  CreateOrderInput,
  AddOrderItemInput,
  UpdateOrderItemsInput,
  UpdateOrderStatusInput,
} from "@good-food/contracts/commands";

async function findAll(): Promise<OrderWithItems[]> {
  const response = await commandsClient.orders.getAll({});
  if (response.status !== 200) throw new Error("Failed to fetch orders");
  return response.body.data;
}

async function findById(id: string): Promise<OrderWithItems> {
  const response = await commandsClient.orders.getById({ params: { id } });
  if (response.status !== 200) throw new Error("Order not found");
  return response.body.data;
}

async function create(data: CreateOrderInput): Promise<OrderWithItems> {
  const response = await commandsClient.orders.create({ body: data });
  if (response.status !== 201) throw new Error("Failed to create order");
  return response.body.data;
}

async function addItem(
  id: string,
  data: AddOrderItemInput,
): Promise<OrderWithItems> {
  const response = await commandsClient.orders.addItem({
    params: { id },
    body: data,
  });
  if (response.status !== 200) throw new Error("Failed to add item to order");
  return response.body.data;
}

async function updateItems(
  id: string,
  data: UpdateOrderItemsInput,
): Promise<OrderWithItems> {
  const response = await commandsClient.orders.updateItems({
    params: { id },
    body: data,
  });
  if (response.status !== 200) throw new Error("Failed to update order items");
  return response.body.data;
}

async function updateStatus(
  id: string,
  data: UpdateOrderStatusInput,
): Promise<OrderWithItems> {
  const response = await commandsClient.orders.updateStatus({
    params: { id },
    body: data,
  });
  if (response.status !== 200) throw new Error("Failed to update order status");
  return response.body.data;
}

async function deleteOrder(id: string): Promise<void> {
  const response = await commandsClient.orders.delete({
    params: { id },
    body: {},
  });
  if (response.status !== 200) throw new Error("Failed to delete order");
}

export const orderService = {
  findAll,
  findById,
  create,
  addItem,
  updateItems,
  updateStatus,
  delete: deleteOrder,
};
