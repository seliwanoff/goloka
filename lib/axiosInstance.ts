
import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { tokenExtractor } from "@/lib/utils";

// Determine the base URL from environment variables
export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor to add Authorization header, Content-Type, and /api
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(config, "configuration");
    const token = tokenExtractor();
    console.log(token, "Request");

    // Add Authorization header if token is present
    if (token?.authHeader) {
      config.headers.Authorization = token.authHeader;
    }

    // Set Content-Type to JSON if data is not FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }


    config.url = `/api${config.url}`;

    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
