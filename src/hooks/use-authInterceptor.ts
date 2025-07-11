import api from "@/lib/config/api.config";
import { ConfigAxios } from "@/lib/types/axios";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";

export const useAuthInterceptors = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest: ConfigAxios = error.config;

        if (
          error.response?.status === 401 &&
          error.response?.data.message.error === "Unauthorized" &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/refresh")
        ) {
          try {
            await api.post("/auth/refresh");

            originalRequest._retry = true;
            return api(originalRequest);
          } catch (refreshError) {
            // Sentry.captureException(refreshError);
            await authService.logout();

            router.push("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(refreshInterceptor);
  }, []);
};
