import { vi } from "vitest";

// Create the mock object
export const toastMock = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

// Clear all mock functions
export const clearToastMocks = () => {
  toastMock.success.mockClear();
  toastMock.error.mockClear();
  toastMock.info.mockClear();
  toastMock.warning.mockClear();
};

// This function should NOT be called in test files
// It's here for documentation purposes only
export const setupToastMock = () => {
  // This won't work properly if called from a test file
  // because vi.mock must be at the top level
  vi.mock("sonner", () => ({
    toast: toastMock,
  }));
};
