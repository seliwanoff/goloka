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
  deleteDataByIdx,
} from "@/lib/api";

import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ServerResponseOrNull } from "../misc";

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
// ~ =============================================>
// ~ ======= Create a campaign bookmark  -->
// ~ =============================================>
export const bookmarkCampaign = async (
  data: any,
  campaignId: string,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["bookmark"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        `/contributor/campaigns/${campaignId}/bookmark/create`,
        data,
      );
    },
  });
};
// ~ =============================================>
// ~ ======= delete a campaign bookmark  -->
// ~ =============================================>
// export const removeBookmark = async (
//   taskId: string,
// ): Promise<ServerResponseOrNull<any>> => {
//   try {
//     return await deleteDataById<ServerResponse<any>>(
//       `/contributor/campaigns/${taskId}/bookmark/delete`,
//     );
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

export const removeBookmark = async (
  campaignId: string,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await deleteDataByIdx<ServerResponse<any>>(
      `/contributor/campaigns/${campaignId}/bookmark/delete`,
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getOrganizationCampaign = async (): Promise<
  AxiosResponse<any>
> => {
  try {
    return await fetchData(
      `/organizations/97731bff-9cad-4c47-bf9f-8867dec0da1a/campaign-groups`,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
export const getGuestCampaign = async (): Promise<AxiosResponse<any>> => {
  try {
    return await fetchData(`/guests/campaigns`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
