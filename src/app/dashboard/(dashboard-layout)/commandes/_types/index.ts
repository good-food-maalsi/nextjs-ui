// Enums pour les statuts
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUND = "refund",
}

export enum OrderStatus {
  DRAFT = "draft",
  CONFIRMED = "confirmed",
  PREPARATION = "preparation",
  READY = "ready",
  CANCELED = "canceled",
}

export enum DeliveryStatus {
  AWAITING = "awaiting",
  COMMAND_RETRIEVED = "command_retrieved",
  DELIVERED = "delivered",
  UNABLE_TO_DELIVER = "unable_to_deliver",
}

// Mappings français pour les statuts
export const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "En attente",
  [PaymentStatus.COMPLETED]: "Payée",
  [PaymentStatus.FAILED]: "Échec",
  [PaymentStatus.REFUND]: "Remboursée",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: "Brouillon",
  [OrderStatus.CONFIRMED]: "Confirmée",
  [OrderStatus.PREPARATION]: "En préparation",
  [OrderStatus.READY]: "Prête",
  [OrderStatus.CANCELED]: "Annulée",
};

export const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  [DeliveryStatus.AWAITING]: "En attente",
  [DeliveryStatus.COMMAND_RETRIEVED]: "Commande récupérée",
  [DeliveryStatus.DELIVERED]: "Livrée",
  [DeliveryStatus.UNABLE_TO_DELIVER]: "Impossible à livrer",
};

// Interface Order
export interface Order {
  id: string;
  numero: string;
  date: string;
  client: string;
  total: string;
  statutPaiement: PaymentStatus;
  statutCommande: OrderStatus;
  articles: number;
  statutLivraison: DeliveryStatus;
}
