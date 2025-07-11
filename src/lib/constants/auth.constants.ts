export const AUTH_PATHS = ["/login", "/register"] as const;
export const SYSTEM_PATH_PREFIX = "/_next";
export const SESSION_MAX_AGE = 5 * 60; // 5 minutes

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  RESET_PASSWORD: "/reset-password",
  REQUEST_PASSWORD_RESET: "/request-password-reset",
} as const;
