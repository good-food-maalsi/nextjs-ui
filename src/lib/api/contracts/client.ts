/**
 * Typed API clients for Good Food services
 *
 * Note: ts-rest client is not used directly due to zod version incompatibility.
 * The contracts package uses zod v3 while this project uses zod v4.
 * Once ts-rest supports zod v4, we can use initClient() directly.
 *
 * For now, we export the types and use them with axios.
 */

// Re-export types from contracts
export type {
  CreateUserInput,
  // Auth types
  LoginInput,
  PublicUser,
  RegisterInput,
  User,
  UserRoleType,
} from '@good-food/contracts/auth';
export type {
  AddCategoriesToIngredientInput,
  AddIngredientToCommandInput,
  // Category types
  Category,
  CategoryInput,
  CategoryQueryParams,
  // Command types
  Command,
  CommandItem,
  CommandQueryParams,
  CommandStatusType,
  CommandWithItems,
  CreateCategoryInput,
  CreateCommandInput,
  CreateFranchiseInput,
  CreateIngredientInput,
  CreateStockFranchiseInput,
  CreateSupplierInput,
  // Franchise types
  Franchise,
  FranchiseQueryParams,
  // Ingredient types
  Ingredient,
  IngredientQueryParams,
  IngredientWithCategories,
  // Stock types
  Stock,
  StockFranchiseQueryParams,
  StockWithIngredient,
  // Supplier types
  Supplier,
  SupplierQueryParams,
  UpdateCategoryInput,
  UpdateCommandIngredientInput,
  UpdateCommandInput,
  UpdateFranchiseInput,
  UpdateIngredientInput,
  UpdateStockFranchiseInput,
  UpdateStockQuantityInput,
  UpdateSupplierInput,
  UpsertStockInput,
} from '@good-food/contracts/franchise';

// Re-export enums
export { UserRole } from '@good-food/contracts/auth';
export { CommandStatus } from '@good-food/contracts/franchise';

// Gateway URL configuration
export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080';
