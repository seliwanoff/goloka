import { queryClient } from "@/components/layout/tanstackProvider";
import { organizationDetails } from "@/helper";
import { postData } from "@/lib/api";
import { AxiosResponse } from "axios";

export const walletFunding = async (
  amount: number,
): Promise<AxiosResponse<any>> =>
  await queryClient.fetchQuery({
    queryKey: ["wallet funding"],
    queryFn: async () => {
      try {
        const response = await postData(
          `/${organizationDetails.domain}/wallet/top-up`,
          {
            amount,
          },
        );
        return response;
      } catch (error) {
        console.error("Failed to transfer:", error);
        throw error;
      }
    },
  });
