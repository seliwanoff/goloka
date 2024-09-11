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

export type ServerResponseOrNull<T> = ServerResponse<T> | null;

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
