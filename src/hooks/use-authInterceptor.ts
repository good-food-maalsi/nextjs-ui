import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

import { gatewayApi } from "@/lib/config/api.config";
import { sessionState } from "@/lib/config/session.config";
import type { ConfigAxios } from "@/lib/types/axios";

import { authService } from "../services/auth.service";

export const useAuthInterceptors = () => {
  const router = useRouter();

  useLayoutEffect(() => {
    const requestInterceptor = gatewayApi.interceptors.request.use(
      (config) => {
        if (config.url?.includes("/franchise/")) {
          const franchiseId = sessionState.get()?.franchise_id;
          if (franchiseId) {
            config.headers.set("X-Franchise-Id", franchiseId);
          }
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const createInterceptor = (axiosInstance: typeof gatewayApi) => {
      return async (error: {
        response?: { status?: number; data?: unknown };
        config: ConfigAxios;
      }) => {
        const originalRequest = error.config;
        const is401 = error.response?.status === 401;

        if (
          is401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/refresh") &&
          !originalRequest.url?.includes("/api/auth/")
        ) {
          try {
            await authService.refresh();
            originalRequest._retry = true;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            await authService.logout();
            router.push("/dashboard/login");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      };
    };

    const responseInterceptor = gatewayApi.interceptors.response.use(
      (response) => response,
      createInterceptor(gatewayApi),
    );

    return () => {
      gatewayApi.interceptors.request.eject(requestInterceptor);
      gatewayApi.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);
};
