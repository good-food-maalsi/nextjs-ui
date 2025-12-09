import { franchiseRepository } from "../repositories/franchise.repository";
import { ingredientRepository } from "../repositories/ingredient.repository";
import type {
  CreateFranchiseInput,
  UpdateFranchiseInput,
  FranchiseQueryParams,
} from "../validators/franchise.validator";
import type {
  UpsertStockInput,
  UpdateStockQuantityInput,
} from "../validators/stock.validator";
import { NotFoundError } from "../errors/api-error";
import {
  validateGPSCoordinates,
  ensureExists,
  validateEmailUniqueness,
  validateEmailUniquenessForUpdate,
} from "../../utils/validators";

export const franchiseHandler = {
  /**
   * Récupérer toutes les franchises
   */
  async getFranchises(params: FranchiseQueryParams) {
    return franchiseRepository.findAll(params);
  },

  /**
   * Récupérer une franchise par ID
   */
  async getFranchiseById(id: string) {
    const franchise = await franchiseRepository.findById(id);

    if (!franchise) {
      throw new NotFoundError(`Franchise with ID ${id} not found`);
    }

    return franchise;
  },

  /**
   * Créer une nouvelle franchise
   */
  async createFranchise(data: CreateFranchiseInput) {
    // Vérifier si l'email existe déjà
    await validateEmailUniqueness(franchiseRepository, data.email, "franchise");

    // Valider les coordonnées GPS (franchises always have coordinates)
    validateGPSCoordinates(data.latitude, data.longitude);

    return franchiseRepository.create(data);
  },

  /**
   * Mettre à jour une franchise
   */
  async updateFranchise(id: string, data: UpdateFranchiseInput) {
    // Vérifier si la franchise existe
    await ensureExists(franchiseRepository, id, "Franchise");

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (data.email) {
      await validateEmailUniquenessForUpdate(
        franchiseRepository,
        data.email,
        id,
        "franchise"
      );
    }

    // Valider les coordonnées GPS si elles sont fournies
    if (data.latitude !== undefined || data.longitude !== undefined) {
      const currentFranchise = await franchiseRepository.findById(id);

      // Type-safe: currentFranchise should exist since we already checked with ensureExists
      if (!currentFranchise) {
        throw new NotFoundError(`Franchise with ID ${id} not found`);
      }

      const lat = data.latitude ?? currentFranchise.latitude;
      const lon = data.longitude ?? currentFranchise.longitude;

      // Valider les coordonnées GPS
      validateGPSCoordinates(lat, lon);
    }

    return franchiseRepository.update(id, data);
  },

  /**
   * Supprimer une franchise
   */
  async deleteFranchise(id: string) {
    // Vérifier si la franchise existe
    await ensureExists(franchiseRepository, id, "Franchise");

    return franchiseRepository.delete(id);
  },

  /**
   * Récupérer le stock d'une franchise
   */
  async getFranchiseStock(id: string) {
    // Vérifier si la franchise existe
    await ensureExists(franchiseRepository, id, "Franchise");

    return franchiseRepository.getStock(id);
  },

  /**
   * Ajouter ou mettre à jour du stock
   */
  async upsertFranchiseStock(franchiseId: string, data: UpsertStockInput) {
    // Vérifier si la franchise et l'ingrédient existent en parallèle
    await Promise.all([
      ensureExists(franchiseRepository, franchiseId, "Franchise"),
      ensureExists(ingredientRepository, data.ingredient_id, "Ingredient"),
    ]);

    return franchiseRepository.upsertStock(
      franchiseId,
      data.ingredient_id,
      data.quantity
    );
  },

  /**
   * Mettre à jour la quantité en stock
   */
  async updateFranchiseStockQuantity(
    franchiseId: string,
    ingredientId: string,
    data: UpdateStockQuantityInput
  ) {
    // Vérifier si la franchise et l'ingrédient existent en parallèle
    await Promise.all([
      ensureExists(franchiseRepository, franchiseId, "Franchise"),
      ensureExists(ingredientRepository, ingredientId, "Ingredient"),
    ]);

    const result = await franchiseRepository.updateStockQuantity(
      franchiseId,
      ingredientId,
      data.quantity
    );

    if (!result) {
      throw new NotFoundError(
        `Stock entry for ingredient ${ingredientId} not found in franchise ${franchiseId}`
      );
    }

    return result;
  },

  /**
   * Supprimer une entrée de stock
   */
  async deleteFranchiseStock(franchiseId: string, ingredientId: string) {
    // Vérifier si la franchise et l'ingrédient existent en parallèle
    await Promise.all([
      ensureExists(franchiseRepository, franchiseId, "Franchise"),
      ensureExists(ingredientRepository, ingredientId, "Ingredient"),
    ]);

    await franchiseRepository.deleteStock(franchiseId, ingredientId);
    return { message: "Stock entry deleted successfully" };
  },
};
