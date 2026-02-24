// Enums pour les statuts
export enum MenuAvailability {
  AVAILABLE = "available",
  UNAVAILABLE = "unavailable",
}

// Mappings français pour la disponibilité
export const menuAvailabilityLabels: Record<MenuAvailability, string> = {
  [MenuAvailability.AVAILABLE]: "Disponible",
  [MenuAvailability.UNAVAILABLE]: "Indisponible",
};

// Interface Menu pour la vue liste
export interface Menu {
  id: string;
  name: string;
  description: string;
  category: string;
  availability: MenuAvailability;
  dishCount: number;
  discountCount: number;
  createdAt: string;
}

// Interface Dish (plat dans un menu)
export interface MenuDish {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  imageUrl?: string;
  availability: "available" | "unavailable";
}

// Interface Discount (réduction appliquée à un menu)
export interface MenuDiscount {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed_amount" | "special_offer";
  discountValue: number;
  dateStart: string;
  dateEnd: string;
}

// Interface pour la vue détaillée d'un menu
export interface MenuDetail {
  id: string;
  name: string;
  description: string;
  category: string;
  availability: MenuAvailability;
  dishes: MenuDish[];
  discounts: MenuDiscount[];
  createdAt: string;
  updatedAt: string;
}
