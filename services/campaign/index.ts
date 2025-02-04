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
import { organizationDetails } from "@/helper";

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
      `/organizations/${organizationDetails.domain}/campaign-groups`,
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

export const getCampaign = async (): Promise<AxiosResponse<any>> => {
  try {
    return await fetchData(
      `/organizations/${organizationDetails.domain}/campaigns`,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const updateCampaignGroupById = async (
  id: number,
  title: string,
  description: string,
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaign-groups/${id}/update`,
      {
        name: title,
        description: description,
      },
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const getCampaignById = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    return await fetchData(
      `/organizations/${organizationDetails.domain}/campaign-groups/${id}`,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
export const getCampaignByIdDetails = async (
  id: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await fetchData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}`,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const deleteCampaign = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    return await deleteData(
      `/organizations/${organizationDetails.domain}/campaign-groups/${id}/delete`,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
export const submitCampaign = async (id: any): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/submit`,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
