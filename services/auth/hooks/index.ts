import { useMutation } from "@tanstack/react-query";
import { authApi, AuthResponse, GoogleAuthResponse } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { baseURL } from "@/lib/axiosInstance";
import { useState } from "react";

export const useAuth = () => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const storeTokens = (tokens: AuthResponse["tokens"]) => {
    localStorage.setItem("access_token", JSON.stringify(tokens.access_token));
    localStorage.setItem("refresh_token", JSON.stringify(tokens.refresh_token));
    localStorage.setItem("token_type", JSON.stringify(tokens.token_type));
  };

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      storeTokens(data.tokens);
      toast.success("Sign in successful");
      if (data.user.current_role === "campaigner") {
        router.replace("/organization/dashboard/root");
      } else {
        router.replace("/dashboard/root");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in");
    },
  });

  // const googleLoginMutation = useMutation({
  //   mutationFn: async (credential: string) => {
  //     const response = await fetch(`${baseURL}/login/google/auth`, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //       },
  //       body: new URLSearchParams({
  //         id_token: credential,
  //         platform: "web",
  //       }),
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || "Google sign-in failed");
  //     }

  //     return response.json();
  //   },
  //   onSuccess: (data) => {
  //     storeTokens(data.tokens);
  //     toast.success("Google sign in successful");
  //     router.replace("/dashboard/root");
  //   },
  //   onError: (error: Error) => {
  //     toast.error(error.message || "Failed to sign in with Google");
  //   },
  // });

  const googleLoginMutation = useMutation({
    mutationFn: async (credential: string) => {
      setIsNavigating(true);
      const response = await fetch(`${baseURL}/login/google/auth`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new URLSearchParams({
          id_token: credential,
          platform: "web",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Google sign-in failed");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      console.log(data, "const ");
      try {
        await storeTokens(data.tokens);
        toast.success("Google sign in successful");
        // For signup flow
        if (data.is_new_user) {
          router.push(`/signup?step=3&verify-complete=true`);
        } else {
          router.replace("/dashboard/root");
        }
      } catch (error) {
        toast.error("Navigation failed");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to sign in with Google");
    },
    onSettled: () => {
      setIsNavigating(false);
    },
  });

  return {
    isNavigating,
    login: loginMutation.mutate,
    googleLogin: googleLoginMutation.mutate,
    isLoading: loginMutation.isPending || googleLoginMutation.isPending,
  };
};
