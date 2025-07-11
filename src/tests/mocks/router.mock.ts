import { vi } from "vitest";

export const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
};

export const clearRouterMocks = () => {
  mockRouter.push.mockClear();
  mockRouter.back.mockClear();
  mockRouter.forward.mockClear();
  mockRouter.refresh.mockClear();
  mockRouter.replace.mockClear();
  mockRouter.prefetch.mockClear();
};
