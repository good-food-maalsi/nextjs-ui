import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { authServiceMock, clearAuthMocks } from "@/tests/mocks/auth.mock";
import { clearRouterMocks, mockRouter } from "@/tests/mocks/router.mock";
import { toastMock } from "@/tests/mocks/toast.mock";

import { PasswordRegisterForm } from "../password-registration-form";

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));
vi.mock("@/services/auth.service", () => ({
  authService: authServiceMock,
}));
vi.mock("sonner", () => ({
  toast: toastMock,
}));

const magicToken = "1234567890";

const TestComponent = () => {
  return (
    <PasswordRegisterForm
      formTitle="Créer un compte"
      magicToken={magicToken}
      successMessage="Compte créé avec succès"
    >
      Vous avez été invité à rejoindre <b>Lena</b>. Veuillez créer votre mot de
      passe pour finaliser votre inscription.
    </PasswordRegisterForm>
  );
};

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockRegisterData = {
  password: "password12456789",
  passwordConfirmation: "password12456789",
};

describe("PasswordRegisterForm", () => {
  beforeEach(() => {
    clearRouterMocks();
    clearAuthMocks();
    queryClient.clear();
  });

  test("should render the login form", async () => {
    render(<TestComponent />, { wrapper });

    expect(screen.getByText("Créer un compte")).toBeDefined();
  });

  test("should render the register form correctly", () => {
    render(<TestComponent />, { wrapper });

    expect(screen.getByText("Créer un compte")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Confirmer le mot de passe")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Valider" })).toBeInTheDocument();
    expect(screen.getByText("Déjà un compte ?")).toBeInTheDocument();
  });

  test("should toggle password visibility when eye icon is clicked", async () => {
    render(<TestComponent />, { wrapper });

    const passwordInput = screen.getByLabelText("Mot de passe");
    const passwordConfirmationInput = screen.getByLabelText(
      "Confirmer le mot de passe"
    );

    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordConfirmationInput).toHaveAttribute("type", "password");

    // Click on eye icons to show passwords
    const eyeIcons = screen.getAllByTestId("eye-icon");

    // Since we don't have test IDs, we'll use the first two eye icons
    // This is a bit fragile but works for this test
    fireEvent.click(eyeIcons[0]);
    fireEvent.click(eyeIcons[1]);

    // Passwords should now be visible
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(passwordConfirmationInput).toHaveAttribute("type", "text");

    // Click again to hide passwords
    fireEvent.click(eyeIcons[0]);
    fireEvent.click(eyeIcons[1]);

    // Passwords should be hidden again
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordConfirmationInput).toHaveAttribute("type", "password");
  });

  test("should show validation error when password is missing", async () => {
    render(<TestComponent />, { wrapper });

    const submitButton = screen.getByRole("button", { name: "Valider" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Le mot de passe est requis")
      ).toBeInTheDocument();
    });
  });

  test("should show validation error when password is too short", async () => {
    render(<TestComponent />, { wrapper });

    const passwordInput = screen.getByLabelText("Mot de passe");
    await userEvent.type(passwordInput, "short");

    const submitButton = screen.getByRole("button", { name: "Valider" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Le mot de passe doit contenir au moins 12 caractères")
      ).toBeInTheDocument();
    });
  });

  test("should show validation error when password confirmation is missing", async () => {
    render(<TestComponent />, { wrapper });

    const submitButton = screen.getByRole("button", { name: "Valider" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("La confirmation du mot de passe est requise")
      ).toBeInTheDocument();
    });
  });

  test("should show validation error when passwords do not match", async () => {
    render(<TestComponent />, { wrapper });

    const passwordInput = screen.getByLabelText("Mot de passe");
    const passwordConfirmationInput = screen.getByLabelText(
      "Confirmer le mot de passe"
    );

    await userEvent.type(passwordInput, "password123");
    await userEvent.type(passwordConfirmationInput, "password1234");

    const submitButton = screen.getByRole("button", { name: "Valider" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Les mots de passe ne correspondent pas")
      ).toBeInTheDocument();
    });
  });

  test("should submit form with valid data", async () => {
    authServiceMock.register.mockResolvedValueOnce(undefined);
    render(<TestComponent />, { wrapper });

    const passwordInput = screen.getByLabelText("Mot de passe");
    const passwordConfirmationInput = screen.getByLabelText(
      "Confirmer le mot de passe"
    );
    const submitButton = screen.getByRole("button", { name: "Valider" });

    await userEvent.type(passwordInput, mockRegisterData.password);
    await userEvent.type(
      passwordConfirmationInput,
      mockRegisterData.passwordConfirmation
    );
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authServiceMock.register).toHaveBeenCalledWith(
        magicToken,
        mockRegisterData.password
      );
      expect(toastMock.success).toHaveBeenCalledWith("Compte créé avec succès");
      expect(mockRouter.push).toHaveBeenCalledWith("/login");
    });
  });

  test("should handle rigesrer error", async () => {
    authServiceMock.register.mockRejectedValueOnce(
      new Error("Register failed")
    );

    render(<TestComponent />, { wrapper });

    const passwordInput = screen.getByLabelText("Mot de passe");
    const passwordConfirmationInput = screen.getByLabelText(
      "Confirmer le mot de passe"
    );
    const submitButton = screen.getByRole("button", { name: "Valider" });

    await userEvent.type(passwordInput, mockRegisterData.password);
    await userEvent.type(
      passwordConfirmationInput,
      mockRegisterData.passwordConfirmation
    );

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authServiceMock.register).toHaveBeenCalledWith(
        magicToken,
        mockRegisterData.password
      );
      expect(toastMock.error).toHaveBeenCalledWith(
        "Une erreur est survenue lors de la création du compte"
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

    authServiceMock.register.mockReturnValueOnce(promise);
    render(<TestComponent />, { wrapper });

    const passwordInput = screen.getByLabelText("Mot de passe");
    const passwordConfirmationInput = screen.getByLabelText(
      "Confirmer le mot de passe"
    );
    const submitButton = screen.getByRole("button", { name: "Valider" });

    await userEvent.type(passwordInput, mockRegisterData.password);
    await userEvent.type(
      passwordConfirmationInput,
      mockRegisterData.passwordConfirmation
    );
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
