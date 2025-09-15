import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { authServiceMock, clearAuthMocks } from "@/tests/mocks/auth.mock";
import { clearRouterMocks, mockRouter } from "@/tests/mocks/router.mock";
import { clearToastMocks,toastMock  } from "@/tests/mocks/toast.mock";

import { useLogin } from "../use-login";

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

vi.mock("sonner", () => ({
  toast: toastMock,
}));

vi.mock("@/services/auth.service", () => ({
  authService: authServiceMock,
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockLoginData = {
  email: "test@example.com",
  password: "password123",
};

describe("useLogin", () => {
  beforeEach(() => {
    clearRouterMocks();
    clearToastMocks();
    clearAuthMocks();
    queryClient.clear();
  });

  test("should initialize with default values", () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    expect(result.current.form.getValues()).toEqual({});
    expect(result.current.isPending).toBe(false);
  });

  test("should handle successful login", async () => {
    authServiceMock.login.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.form.setValue("email", mockLoginData.email);
      result.current.form.setValue("password", mockLoginData.password);
      result.current.onSubmit(mockLoginData);
    });

    expect(authServiceMock.login).toHaveBeenCalledWith(
      mockLoginData.email,
      mockLoginData.password
    );

    expect(toastMock.success).toHaveBeenCalledWith("Connexion réussie");
    expect(mockRouter.push).toHaveBeenCalledWith("/");
    expect(result.current.form.getValues()).toEqual({});
  });

  test("should handle login failure", async () => {
    authServiceMock.login.mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.form.setValue("email", mockLoginData.email);
      result.current.form.setValue("password", mockLoginData.password);
      result.current.onSubmit(mockLoginData);
    });

    expect(authServiceMock.login).toHaveBeenCalledWith(
      mockLoginData.email,
      mockLoginData.password
    );

    expect(toastMock.error).toHaveBeenCalledWith(
      "Informations de connexion incorrectes"
    );

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  test("should not call login if form is not valid", async () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      result.current.form.trigger();
    });

    expect(authServiceMock.login).not.toHaveBeenCalled();
  });
});
