import { vi } from "vitest";

// Create the auth service mock object
export const authServiceMock = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  invite: vi.fn(),
  verifyMagicToken: vi.fn(),
  refreshAccessToken: vi.fn(),
  setAccessTokenCookie: vi.fn(),
  extractAccessToken: vi.fn(),
};

// Clear all mock functions
export const clearAuthMocks = () => {
  Object.keys(authServiceMock).forEach((key) => {
    authServiceMock[key as keyof typeof authServiceMock].mockClear();
  });
};

// This is just for documentation - don't call this in tests
// The mock should be set up at the top level of your test file
export const setupAuthMock = () => {
  vi.mock("@/lib/services/auth.service", () => ({
    authService: authServiceMock,
  }));
};
