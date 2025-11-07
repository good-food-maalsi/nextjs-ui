import { franchiseRepository } from "../repositories/franchise.repository";
import type {
  CreateFranchiseInput,
  UpdateFranchiseInput,
  FranchiseQueryParams,
} from "../validators/franchise.validator";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../errors/api-error";

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
    const existingFranchise = await franchiseRepository.findByEmail(data.email);

    if (existingFranchise) {
      throw new ConflictError(
        `A franchise with email ${data.email} already exists`
      );
    }

    // Valider les coordonnées GPS
    if (
      data.latitude < -90 ||
      data.latitude > 90 ||
      data.longitude < -180 ||
      data.longitude > 180
    ) {
      throw new BadRequestError("Invalid GPS coordinates");
    }

    return franchiseRepository.create(data);
  },

  /**
   * Mettre à jour une franchise
   */
  async updateFranchise(id: string, data: UpdateFranchiseInput) {
    // Vérifier si la franchise existe
    const exists = await franchiseRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Franchise with ID ${id} not found`);
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (data.email) {
      const existingFranchise = await franchiseRepository.findByEmail(
        data.email
      );
      if (existingFranchise && existingFranchise.id !== id) {
        throw new ConflictError(
          `A franchise with email ${data.email} already exists`
        );
      }
    }

    // Valider les coordonnées GPS si elles sont fournies
    if (data.latitude !== undefined || data.longitude !== undefined) {
      const currentFranchise = await franchiseRepository.findById(id);
      const lat = data.latitude ?? currentFranchise!.latitude;
      const lon = data.longitude ?? currentFranchise!.longitude;

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new BadRequestError("Invalid GPS coordinates");
      }
    }

    return franchiseRepository.update(id, data);
  },

  /**
   * Supprimer une franchise
   */
  async deleteFranchise(id: string) {
    // Vérifier si la franchise existe
    const exists = await franchiseRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Franchise with ID ${id} not found`);
    }

    return franchiseRepository.delete(id);
  },

  /**
   * Récupérer le stock d'une franchise
   */
  async getFranchiseStock(id: string) {
    // Vérifier si la franchise existe
    const exists = await franchiseRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Franchise with ID ${id} not found`);
    }

    return franchiseRepository.getStock(id);
  },
};
