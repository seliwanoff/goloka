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
import { IRemoteUser } from "@/types";

import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type ServerResponseOrNull<T> = ServerResponse<T> | null;

interface BankAccount {
  account_number: string;
  account_name: string;
  bank_name: string;
  id: number;
}

interface UserData {
  id: number;
  birth_date: string; // ISO 8601 date string
  gender: string;
  religion: string | null;
  ethnicity: string | null;
  primary_language: string;
  spoken_languages: string[];
  latitude: number;
  longitude: number;
  location: string | null;
  location_updated_at: string; // Date-time string
  bank_accounts: BankAccount[];
}

interface ApiResponse {
  data: UserData;
}

interface TaskData {
  id: number;
  title: string;
  description: string;
  image_path: string[];
  admin_fee: string;
  allows_multiple_responses: number;
  campaign_fee: string;
  campaign_group: string;
  created_at: string;
  ends_at: string;
  fund_deducted: string;
  locations: {
    /* Define the structure of each location here */
  }[];
  meta: any; // Adjust this type based on actual structure
  number_of_responses: number;
  organization: string;
  payment_rate_for_response: string;
  remaining_campaign_fund: string;
  starts_at: string;
  status: string;
  total_fee: string;
  type: string;
}

interface TaskResponse {
  data: TaskData;
}

// ~ =============================================>
// ~ ======= Create a user  -->
// ~ =============================================>
export const createContributor = async (
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["create contributor"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        "/contributor-profile/update",
        data,
      );
    },
  });
};

// ~ =============================================>
// ~ ======= Create a contributor Response  -->
// ~ =============================================>

export const createContributorResponse = async (
  id: string,
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["create contributor response"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        `/contributor/campaigns/${id}/responses/create`,
        data,
      );
    },
  });
};
// ~ =============================================>
// ~ ======= Create a contributor Answers  -->
// ~ =============================================>

export const createContributorAnswers = async (
  id: string,
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["create contributor answers"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        `/contributor/responses/${id}/answer`,
        data,
      );
    },
  });
};
// ~ =============================================>
// ~ ======= Get campaign user  -->
// ~ =============================================>
interface GetAllTaskParams {
  per_page?: number;
  page?: number;
  search?: string;
  type?: string;
  min_price?: number;
  max_price?: number;
  min_question?: number;
  max_question?: number;
  allows_multiple_responses?: boolean | number;
  campaign_end_date?: string;
}

export const getAllTask = async (params: GetAllTaskParams) => {
  try {
    const query = new URLSearchParams();

    // Add query parameters conditionally
    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    appendQuery("per_page", params.per_page);
    appendQuery("page", params.page);
    appendQuery("search", params.search);
    appendQuery("type", params.type);
    appendQuery("min_price", params.min_price);
    appendQuery("max_price", params.max_price);
    appendQuery("min_question", params.min_question);
    appendQuery("max_question", params.max_question);
    appendQuery("allows_multiple_responses", params.allows_multiple_responses);
    appendQuery("campaign_end_date", params.campaign_end_date);

    const endpoint = `/campaigns?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks. Please try again later.");
  }
};
export const getBookmarkedCampaign = async (params: GetAllTaskParams) => {
  try {
    const query = new URLSearchParams();

    // Add query parameters conditionally
    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    appendQuery("per_page", params.per_page);
    appendQuery("page", params.page);
    appendQuery("search", params.search);
    appendQuery("type", params.type);
    appendQuery("min_price", params.min_price);
    appendQuery("max_price", params.max_price);
    appendQuery("min_question", params.min_question);
    appendQuery("max_question", params.max_question);
    appendQuery("allows_multiple_responses", params.allows_multiple_responses);
    appendQuery("campaign_end_date", params.campaign_end_date);
    const endpoint = `/contributor/campaigns/bookmarks/all?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks. Please try again later.");
  }
};
export const getAllContributedTask = async (params: GetAllTaskParams) => {
  try {
    const query = new URLSearchParams();

    // Add query parameters conditionally
    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    appendQuery("per_page", params.per_page);
    appendQuery("page", params.page);
    appendQuery("search", params.search);
    appendQuery("type", params.type);
    appendQuery("min_price", params.min_price);
    appendQuery("max_price", params.max_price);
    appendQuery("min_question", params.min_question);
    appendQuery("max_question", params.max_question);
    appendQuery("allows_multiple_responses", params.allows_multiple_responses);
    appendQuery("campaign_end_date", params.campaign_end_date);

    const endpoint = `/contributor/campaigns?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks. Please try again later.");
  }
};

// ~ =============================================>
// ~ ======= get task by id  -->
// ~ =============================================>
export const getTaskById = async (
  Id: string,
): Promise<UseQueryResult<AxiosResponse<TaskResponse>>> =>
  await queryClient.fetchQuery({
    queryKey: ["Task by TaskId"],
    queryFn: async () => {
      try {
        return await fetchData(`/contributor/campaigns/${Id}`);
      } catch (error) {
        return null;
      }
    },
  });
// ~ =============================================>
// ~ ======= get campaign question -->
// ~ =============================================>
// export const getCampaignQuestion = async (
//   id: string,
// ): Promise<UseQueryResult<AxiosResponse<TaskResponse>>> =>
//   await queryClient.fetchQuery({
//     queryKey: ["campaign questions"],
//     queryFn: async () => {
//       try {
//         return await fetchData(`/contributor/campaigns/${id}/questions`);
//       } catch (error) {
//         return null;
//       }
//     },
//   });

export const getCampaignQuestion = async (
  id: string,
): Promise<AxiosResponse<TaskResponse>> => {
  try {
    return await fetchData(`/contributor/campaigns/${id}/questions`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error; // Throw the error so it can be caught in the useQuery hook
  }
};
// ~ =============================================>
// ~ ======= get contributors profile  -->
// ~ =============================================>
export const getContributorsProfile = async (): Promise<
  UseQueryResult<AxiosResponse<TaskResponse>>
> =>
  await queryClient.fetchQuery({
    queryKey: ["contributors profile"],
    queryFn: async () => {
      try {
        return await fetchData<IRemoteUser>(`/contributor-profile`);
      } catch (error) {
        return null;
      }
    },
  });

export const resolveAccountInfo = async (
  account_number: string,
  bank_code: string,
): Promise<UseQueryResult<AxiosResponse<TaskResponse>>> =>
  await queryClient.fetchQuery({
    queryKey: ["Account profile"],
    queryFn: async () => {
      try {
        return await postData(`/resolve-account`, {
          account_number,
          bank_code,
        });
      } catch (error) {
        console.error("Failed to resolve account info:", error);
        return null;
      }
    },
  });
export const addBeneficiary = async (
  account_number: string,
  bank_code: string,
): Promise<UseQueryResult<AxiosResponse<TaskResponse>>> =>
  await queryClient.fetchQuery({
    queryKey: ["contributors bank"],
    queryFn: async () => {
      try {
        return await postData(`/contributor-profile/bank-account`, {
          account_number,
          bank_code,
        });
      } catch (error) {
        console.error("Failed:", error);
        return null;
      }
    },
  });

export const addCampaignGroup = async (
  name: string,
  description: string,
): Promise<UseQueryResult<AxiosResponse<TaskResponse>>> =>
  await queryClient.fetchQuery({
    queryKey: ["contributors bank"],
    queryFn: async () => {
      try {
        return await postData(
          `organizations/97731bff-9cad-4c47-bf9f-8867dec0da1a/campaign-groups/create`,
          {
            name,
            description,
          },
        );
      } catch (error) {
        console.error("Failed:", error);
        return null;
      }
    },
  });
//staging.goloka.io/api/contributor-profile/bank-account/{{bank_id}}/delete

export const removeBeneficiary = async (
  bank_id: string,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await deleteDataByIdx<ServerResponse<any>>(
      `/contributor-profile/bank-account/${bank_id}/delete`,
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
