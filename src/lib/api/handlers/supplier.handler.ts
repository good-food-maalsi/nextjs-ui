import { supplierRepository } from "../repositories/supplier.repository";
import type {
  CreateSupplierInput,
  UpdateSupplierInput,
  SupplierQueryParams,
} from "../validators/supplier.validator";
import { NotFoundError } from "../errors/api-error";
import {
  validateGPSCoordinatesPair,
  ensureExists,
  validateEmailUniqueness,
  validateEmailUniquenessForUpdate,
} from "../../utils/validators";

export const supplierHandler = {
  /**
   * Récupérer tous les fournisseurs
   */
  async getSuppliers(params: SupplierQueryParams) {
    return supplierRepository.findAll(params);
  },

  /**
   * Récupérer un fournisseur par ID
   */
  async getSupplierById(id: string) {
    const supplier = await supplierRepository.findById(id);

    if (!supplier) {
      throw new NotFoundError(`Supplier with ID ${id} not found`);
    }

    return supplier;
  },

  /**
   * Créer un nouveau fournisseur
   */
  async createSupplier(data: CreateSupplierInput) {
    // Vérifier si l'email existe déjà
    await validateEmailUniqueness(supplierRepository, data.email, "supplier");

    // Valider les coordonnées GPS si elles sont fournies
    validateGPSCoordinatesPair(data.latitude, data.longitude);

    return supplierRepository.create(data);
  },

  /**
   * Mettre à jour un fournisseur
   */
  async updateSupplier(id: string, data: UpdateSupplierInput) {
    // Vérifier si le fournisseur existe
    await ensureExists(supplierRepository, id, "Supplier");

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (data.email) {
      await validateEmailUniquenessForUpdate(
        supplierRepository,
        data.email,
        id,
        "supplier"
      );
    }

    // Valider les coordonnées GPS si elles sont fournies
    if (data.latitude !== undefined || data.longitude !== undefined) {
      const currentSupplier = await supplierRepository.findById(id);

      // Type-safe: currentSupplier should exist since we already checked with ensureExists
      if (!currentSupplier) {
        throw new NotFoundError(`Supplier with ID ${id} not found`);
      }

      const lat = data.latitude ?? currentSupplier.latitude;
      const lon = data.longitude ?? currentSupplier.longitude;

      // Valider la paire de coordonnées GPS
      validateGPSCoordinatesPair(lat, lon);
    }

    return supplierRepository.update(id, data);
  },

  /**
   * Supprimer un fournisseur
   */
  async deleteSupplier(id: string) {
    // Vérifier si le fournisseur existe
    await ensureExists(supplierRepository, id, "Supplier");

    return supplierRepository.delete(id);
  },
};
