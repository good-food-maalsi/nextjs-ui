// Enums pour les statuts
export enum DishStatus {
  PUBLISHED = "published",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

export enum DishAvailability {
  AVAILABLE = "available",
  UNAVAILABLE = "unavailable",
}

// Mappings français pour les statuts
export const dishStatusLabels: Record<DishStatus, string> = {
  [DishStatus.PUBLISHED]: "Publié",
  [DishStatus.DRAFT]: "Brouillon",
  [DishStatus.ARCHIVED]: "Archivé",
};

export const dishAvailabilityLabels: Record<DishAvailability, string> = {
  [DishAvailability.AVAILABLE]: "Disponible",
  [DishAvailability.UNAVAILABLE]: "Indisponible",
};

// Interface Dish
export interface Dish {
  id: string;
  nom: string;
  prixBase: string;
  disponibilite: DishAvailability;
  menusAssocies: string;
  dateCreation: string;
  statut: DishStatus;
}
