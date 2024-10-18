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
export const removeBookmark = async (
  taskId: string,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await deleteDataById<ServerResponse<any>>(
      `/contributor/campaigns/${taskId}/bookmark/delete`,
    //   taskId,
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

