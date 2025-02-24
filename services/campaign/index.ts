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

interface GetAllCampaignsParams {
  per_page?: number;
  page?: number;
  search?: string;
  end_date?: any;
  start_date?: any;
  status?: string;
}

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
export const getOrganizationCampaign = async (
  params: GetAllCampaignsParams,
): Promise<AxiosResponse<any>> => {
  try {
    const query = new URLSearchParams();

    // Add query parameters conditionally
    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    appendQuery("per_page", params.per_page);
    appendQuery("start_date", params.start_date);
    appendQuery("end_date", params.end_date);

    appendQuery("page", params.page);
    appendQuery("search", params.search);
    return await fetchData(
      `/organizations/${organizationDetails.domain}/campaign-groups?${query.toString()}`,
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

export const getCampaign = async (
  params: GetAllCampaignsParams,
): Promise<AxiosResponse<any>> => {
  try {
    const query = new URLSearchParams();

    // Add query parameters conditionally
    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };
    appendQuery("start_date", params.start_date);
    appendQuery("end_date", params.end_date);
    appendQuery("per_page", params.per_page);
    appendQuery("page", params.page);
    appendQuery("search", params.search);
    return await fetchData(
      `/organizations/${organizationDetails.domain}/campaigns?${query.toString()}`,
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

export const updateCampaign = async (
  id: number,
  payload: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/update`,
      payload,
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
export const getResponseDetails = async (
  id: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await fetchData(
      `/organizations/${organizationDetails.domain}/responses/${id}`,
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

export const updateCampaignByStatus = async (
  id: any,
  status: string,
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/status`,
      {
        status: status,
      },
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
