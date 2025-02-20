import axios, { AxiosResponse } from "axios";
import { serverRoute } from "@/lib/utils";
import { queryClient } from "@/components/layout/tanstackProvider";
import { postData, ServerResponse } from "@/lib/api";
import { UseQueryResult } from "@tanstack/react-query";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";

// =============================================
// ======= user sign in  -->
// =============================================
export const userSignIn = async (email: string, password: string) => {
  return await queryClient.fetchQuery({
    queryKey: ["user sign in"],
    queryFn: async (): Promise<AxiosResponse<{
      access_token: string;
      token_type: string;
    }> | null> => {
      try {
        const response = await axios.post(
          serverRoute("login"),
          {
            email,
            password,
            platform: "web",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        //console.log(response, "enduee");
        return response?.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error during sign in:", error.message);
          throw error;
        } else {
          console.error("Unexpected error during sign in:", error);
          throw error;
        }
      }
    },
  });
};



// =============================================
// ======= forgot password  -->
// =============================================
// Define the interface for the password reset data
interface PasswordResetData {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export const resetPassword = async (
  resetData: PasswordResetData,
): Promise<UseQueryResult<AxiosResponse<any>>> =>
  await queryClient.fetchQuery({
    queryKey: ["ResetPassword"],
    queryFn: async () => {
      try {
        return await postData<ServerResponse<any>>(
          "/password/reset",
          resetData,
        );
      } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
      }
    },
  });

export const userLogout = async () => {
  await queryClient.fetchQuery({
    queryKey: ["user logout"],
    queryFn: async () => {
      try {
        await postData<ServerResponse<any>>("/logout", { platform: "web" });
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    },
  });
};

export const getCurrentOrganization = (org: any) => {
  useOrganizationStore.getState().setOrganization({
    id: org?.id,
    name: org?.name,
    email: "",
    country: org?.country,
    current_role: "",
    email_verified_at: "",
    pin_status: false,
    domain: org?.domain,
    currency: (org?.country && org?.country["currency-code"]) || "",
    symbol: (org?.country && org?.country["currency-symbol"]) || "",
  });
};

import apiClient from "./api-client";
import { AxiosError } from "axios";

export interface AuthResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
  user: {
    current_role: string;
    [key: string]: any;
  };
}

export interface GoogleAuthResponse {
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>("/login", {
        email,
        password,
        platform: "web",
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to sign in");
      }
      throw error;
    }
  },

  googleLogin: async (credential: string): Promise<GoogleAuthResponse> => {
    try {
      const { data } = await apiClient.post<GoogleAuthResponse>(
        "/api/login/google/auth",
        new URLSearchParams({
          id_token: credential,
          platform: "web",
        }),
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Google sign-in failed",
        );
      }
      throw error;
    }
  },
};