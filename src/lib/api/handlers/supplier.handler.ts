import { supplierRepository } from "../repositories/supplier.repository";
import type {
  CreateSupplierInput,
  UpdateSupplierInput,
  SupplierQueryParams,
} from "../validators/supplier.validator";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../errors/api-error";

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
    const existingSupplier = await supplierRepository.findByEmail(data.email);

    if (existingSupplier) {
      throw new ConflictError(
        `A supplier with email ${data.email} already exists`
      );
    }

    // Valider les coordonnées GPS si elles sont fournies
    if (data.latitude !== undefined && data.longitude !== undefined) {
      if (
        data.latitude < -90 ||
        data.latitude > 90 ||
        data.longitude < -180 ||
        data.longitude > 180
      ) {
        throw new BadRequestError("Invalid GPS coordinates");
      }
    }

    // Vérifier que si une coordonnée est fournie, l'autre l'est aussi
    if (
      (data.latitude !== undefined && data.longitude === undefined) ||
      (data.latitude === undefined && data.longitude !== undefined)
    ) {
      throw new BadRequestError(
        "Both latitude and longitude must be provided together"
      );
    }

    return supplierRepository.create(data);
  },

  /**
   * Mettre à jour un fournisseur
   */
  async updateSupplier(id: string, data: UpdateSupplierInput) {
    // Vérifier si le fournisseur existe
    const exists = await supplierRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Supplier with ID ${id} not found`);
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (data.email) {
      const existingSupplier = await supplierRepository.findByEmail(data.email);
      if (existingSupplier && existingSupplier.id !== id) {
        throw new ConflictError(
          `A supplier with email ${data.email} already exists`
        );
      }
    }

    // Valider les coordonnées GPS si elles sont fournies
    if (data.latitude !== undefined || data.longitude !== undefined) {
      const currentSupplier = await supplierRepository.findById(id);
      const lat = data.latitude ?? currentSupplier!.latitude;
      const lon = data.longitude ?? currentSupplier!.longitude;

      // Vérifier que les coordonnées sont valides si toutes les deux sont présentes
      if (lat !== null && lon !== null) {
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          throw new BadRequestError("Invalid GPS coordinates");
        }
      }

      // Vérifier que si une coordonnée est fournie, l'autre l'est aussi (pas null)
      if ((lat === null && lon !== null) || (lat !== null && lon === null)) {
        throw new BadRequestError(
          "Both latitude and longitude must be provided together or both set to null"
        );
      }
    }

    return supplierRepository.update(id, data);
  },

  /**
   * Supprimer un fournisseur
   */
  async deleteSupplier(id: string) {
    // Vérifier si le fournisseur existe
    const exists = await supplierRepository.exists(id);
    if (!exists) {
      throw new NotFoundError(`Supplier with ID ${id} not found`);
    }

    return supplierRepository.delete(id);
  },
};
