import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { tokenExtractor } from "@/lib/utils";
import { toast } from "sonner";

// You may want to move this to a separate auth utilities file
const handleSignOut = () => {
  // Clear any auth tokens from localStorage/cookies
  localStorage.removeItem("whoami");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_type");

  // Redirect to signin page
  // Using window.location instead of router.push() because we want a full page reload
  window.location.href = "/signin"; // Adjust the path based on your routing setup
};

export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenExtractor();

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

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    // Handle authentication errors
    if (status === 401 || status === 403) {
      // Show error message to user
      toast.error(
        status === 401
          ? "Your session has expired. Please sign in again."
          : "You don't have permission to access this resource.",
      );

      // Sign out user and redirect to login
      handleSignOut();

      // Return a rejected promise to stop the request chain
      return Promise.reject(error);
    }

    const errorMessage =
      //@ts-ignore
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Show error toast for non-auth errors
    if (status !== 401 && status !== 403) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
