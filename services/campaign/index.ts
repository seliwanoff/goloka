import { queryClient } from "@/components/layout/tanstackProvider";
import {
  useFetchQuery,
  postData,
  fetchData,
  updateData,
  deleteData,
  fetchDataById,
  updateDataById,
  deleteDataById,
  ServerResponse,
} from "@/lib/api";

import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

// ~ =============================================>
// ~ ======= Create a campaign response  -->
// ~ =============================================>
export const createCampaignResponse = async (
  data: any,
  campaignId: string,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["create contributor"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        `/contributor/campaigns/${campaignId}/responses/create`,
        data,
      );
    },
  });
};
