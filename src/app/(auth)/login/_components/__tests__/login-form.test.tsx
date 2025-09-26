import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { test, expect, beforeEach, describe, vi } from "vitest";

import { authServiceMock, clearAuthMocks } from "@/tests/mocks/auth.mock";
import { clearRouterMocks, mockRouter } from "@/tests/mocks/router.mock";
import { toastMock } from "@/tests/mocks/toast.mock";

import { LoginForm } from "../login-form";

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));
vi.mock("@/services/auth.service", () => ({
  authService: authServiceMock,
}));
vi.mock("sonner", () => ({
  toast: toastMock,
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockLoginData = {
  email: "test@example.com",
  password: "password123",
};

describe("LoginForm", () => {
  beforeEach(() => {
    clearRouterMocks();
    clearAuthMocks();
    queryClient.clear();
  });

  test("should render the login form", async () => {
    render(<LoginForm />, { wrapper });

    expect(screen.getByText("Se connecter")).toBeDefined();
  });

  test("should render the register form correctly", () => {
    render(<LoginForm />, { wrapper });

    expect(screen.getByText("Se connecter")).toBeInTheDocument();
    expect(screen.getByLabelText("Adresse e-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
    expect(screen.getByText("Mot de passe oublié ?")).toBeInTheDocument();
  });

  test("should toggle password visibility when eye icon is clicked", async () => {
    render(<LoginForm />, { wrapper });

    const passwordInput = screen.getByLabelText("Mot de passe");

    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click on eye icons to show passwords
    const eyeIcon = screen.getByTestId("eye-icon");
    fireEvent.click(eyeIcon);

    // Passwords should now be visible
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click again to hide passwords
    fireEvent.click(eyeIcon);

    // Passwords should be hidden again
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should show validation error when email is missing", async () => {
    render(<LoginForm />, { wrapper });

    const submitButton = screen.getByRole("button", { name: "Valider" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("L'adresse e-mail est requise")
      ).toBeInTheDocument();
    });
  });

  test("should show validation error when password is missing", async () => {
    render(<LoginForm />, { wrapper });

    const submitButton = screen.getByRole("button", { name: "Valider" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Le mot de passe est requis")
      ).toBeInTheDocument();
    });
  });

  test("should show validation error when email is invalid", async () => {
    render(<LoginForm />, { wrapper });

    const emailInput = screen.getByLabelText("Adresse e-mail");
    await userEvent.type(emailInput, "invalid-email");

    const submitButton = screen.getByRole("button", { name: "Valider" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("L'adresse e-mail n'est pas valide")
      ).toBeInTheDocument();
    });
  });

  test("should submit form with valid data", async () => {
    authServiceMock.register.mockResolvedValueOnce(undefined);
    render(<LoginForm />, { wrapper });

    const emailInput = screen.getByLabelText("Adresse e-mail");
    const passwordInput = screen.getByLabelText("Mot de passe");
    const submitButton = screen.getByRole("button", { name: "Valider" });

    await userEvent.type(emailInput, mockLoginData.email);
    await userEvent.type(passwordInput, mockLoginData.password);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authServiceMock.login).toHaveBeenCalledWith(
        mockLoginData.email,
        mockLoginData.password
      );
      expect(toastMock.success).toHaveBeenCalledWith("Connexion réussie");
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  test("should handle login error", async () => {
    authServiceMock.login.mockRejectedValueOnce(new Error("Login failed"));

    render(<LoginForm />, { wrapper });

    const emailInput = screen.getByLabelText("Adresse e-mail");
    const passwordInput = screen.getByLabelText("Mot de passe");
    const submitButton = screen.getByRole("button", { name: "Valider" });

    await userEvent.type(emailInput, mockLoginData.email);
    await userEvent.type(passwordInput, mockLoginData.password);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authServiceMock.login).toHaveBeenCalledWith(
        mockLoginData.email,
        mockLoginData.password
      );
      expect(toastMock.error).toHaveBeenCalledWith(
        "Informations de connexion incorrectes"
      );
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  test("should show loading state during form submission", async () => {
    // Create a promise that we can resolve manually to control the timing
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    authServiceMock.login.mockReturnValueOnce(promise);
    render(<LoginForm />, { wrapper });

    const emailInput = screen.getByLabelText("Adresse e-mail");
    const passwordInput = screen.getByLabelText("Mot de passe");
    const submitButton = screen.getByRole("button", { name: "Valider" });

    await userEvent.type(emailInput, mockLoginData.email);
    await userEvent.type(passwordInput, mockLoginData.password);
    fireEvent.click(submitButton);

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText("En cours...")).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    // Resolve the promise to complete the submission
    resolvePromise!(undefined);

    await waitFor(() => {
      expect(screen.queryByText("En cours...")).not.toBeInTheDocument();
      expect(submitButton).toBeEnabled();
    });
  });
});
