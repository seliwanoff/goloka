import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { tokenExtractor } from "@/lib/utils";


export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor to add Authorization header and Content-Type
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(config, "configuration")
    const token = tokenExtractor();
    console.log(token, "Request");
    if (token?.authHeader) {
      config.headers.Authorization = token.authHeader;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
