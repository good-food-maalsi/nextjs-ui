import axios from "axios";

export const gatewayApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080",
  withCredentials: true,
});
