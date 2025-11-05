// Enums pour les types de réduction
export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
  SPECIAL_OFFER = "special_offer",
}

// Enums pour le statut d'une réduction
export enum DiscountStatus {
  ACTIVE = "active",
  SCHEDULED = "scheduled",
  EXPIRED = "expired",
}

// Mappings français pour les types
export const discountTypeLabels: Record<DiscountType, string> = {
  [DiscountType.PERCENTAGE]: "Pourcentage",
  [DiscountType.FIXED_AMOUNT]: "Montant fixe",
  [DiscountType.SPECIAL_OFFER]: "Offre spéciale",
};

// Mappings français pour les statuts
export const discountStatusLabels: Record<DiscountStatus, string> = {
  [DiscountStatus.ACTIVE]: "Active",
  [DiscountStatus.SCHEDULED]: "Programmée",
  [DiscountStatus.EXPIRED]: "Expirée",
};

// Interface Discount pour la vue liste
export interface Discount {
  id: string;
  name: string;
  description: string;
  type: DiscountType;
  discountValue: number;
  dateStart: string;
  dateEnd: string;
  status: DiscountStatus;
  menuCount: number;
  createdAt: string;
  updatedAt: string;
}

// Interface pour un menu associé à une réduction
export interface DiscountMenu {
  id: string;
  name: string;
  category: string;
}

// Interface pour la vue détaillée d'une réduction
export interface DiscountDetail extends Discount {
  menus: DiscountMenu[];
}
