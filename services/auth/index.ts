import axios, { AxiosResponse } from "axios";
import { serverRoute } from "@/lib/utils";
import { queryClient } from "@/components/layout/tanstackProvider";

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
          new URLSearchParams({
            email,
            password,
            platform: "web",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Axios error during sign in:",
            error.message,
            error.code,
            error.config
          );
          return null;
        } else {
          console.error("Unexpected error during sign in:", error);
        }
        return null;
      }
    },
  });
};
