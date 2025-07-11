import { describe, beforeEach, vi, expect, it } from "vitest";
import { toastMock } from "@/tests/mocks/toast.mock";
import { authServiceMock, clearAuthMocks } from "@/tests/mocks/auth.mock";
import { clearRouterMocks, mockRouter } from "@/tests/mocks/router.mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { clearToastMocks } from "@/tests/mocks/toast.mock";
import { act, renderHook } from "@testing-library/react";
import { useFormMutation } from "../use-password-register";

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

const magicToken = "1234567890";

const mockRegisterData = {
  password: "password123",
  passwordConfirmation: "password123",
};

describe("useFormMutation", () => {
  beforeEach(() => {
    clearRouterMocks();
    clearToastMocks();
    clearAuthMocks();
    queryClient.clear();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(
      () => useFormMutation(magicToken, "Compte créé avec succès"),
      {
        wrapper,
      }
    );

    expect(result.current.form.getValues()).toEqual({});
    expect(result.current.isPending).toBe(false);
  });

  it("should handle successful registration", async () => {
    authServiceMock.register.mockResolvedValueOnce(undefined);

    const { result } = renderHook(
      () => useFormMutation(magicToken, "Compte créé avec succès"),
      {
        wrapper,
      }
    );

    await act(async () => {
      result.current.form.setValue("password", mockRegisterData.password);
      result.current.form.setValue(
        "passwordConfirmation",
        mockRegisterData.passwordConfirmation
      );
      result.current.onSubmit(mockRegisterData);
    });

    expect(authServiceMock.register).toHaveBeenCalledWith(
      magicToken,
      mockRegisterData.password
    );

    expect(toastMock.success).toHaveBeenCalledWith("Compte créé avec succès");
    expect(mockRouter.push).toHaveBeenCalledWith("/login");
    expect(result.current.form.getValues()).toEqual({});
  });

  it("should handle registration failure", async () => {
    authServiceMock.register.mockRejectedValueOnce(
      new Error("Registration failed")
    );

    const { result } = renderHook(
      () => useFormMutation(magicToken, "Compte créé avec succès"),
      {
        wrapper,
      }
    );

    await act(async () => {
      result.current.form.setValue("password", mockRegisterData.password);
      result.current.form.setValue(
        "passwordConfirmation",
        mockRegisterData.passwordConfirmation
      );
      result.current.onSubmit(mockRegisterData);
    });

    expect(authServiceMock.register).toHaveBeenCalledWith(
      magicToken,
      mockRegisterData.password
    );

    expect(toastMock.error).toHaveBeenCalledWith(
      "Une erreur est survenue lors de la création du compte"
    );

    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("should not call register if form is not valid", async () => {
    const { result } = renderHook(
      () => useFormMutation(magicToken, "Compte créé avec succès"),
      {
        wrapper,
      }
    );

    await act(async () => {
      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it("should not call register if password and passwordConfirmation do not match", async () => {
    const { result } = renderHook(
      () => useFormMutation(magicToken, "Compte créé avec succès"),
      {
        wrapper,
      }
    );

    await act(async () => {
      result.current.form.setValue("password", mockRegisterData.password);
      result.current.form.setValue("passwordConfirmation", "differentPassword");

      await result.current.form.handleSubmit(result.current.onSubmit)();
    });

    expect(authServiceMock.register).not.toHaveBeenCalled();
  });
});
