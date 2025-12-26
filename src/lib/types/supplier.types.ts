// Backend API response type (English field names)
export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

// Frontend display type (French labels for UI)
export interface SupplierDisplay {
  id: string;
  nom: string; // from name
  adresse: string; // computed from lat/long
  telephone: string; // from phone
  email: string;
  logo_url: string | null;
}

// API request types
export interface CreateSupplierInput {
  name: string;
  email: string;
  phone: string;
  logo_url?: string;
  latitude?: number;
  longitude?: number;
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

// API response with pagination
export interface SuppliersResponse {
  data: Supplier[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
