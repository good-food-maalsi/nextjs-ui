export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:3000/api";

export const DOCKER_SERVICE_BASE_URL = (isClient: boolean) => {
  return isClient
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_DOCKER_SERVICE
    : "http://localhost:3000/api";
};
