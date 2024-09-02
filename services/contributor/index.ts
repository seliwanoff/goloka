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

    if (params.per_page) query.append("per_page", params.per_page.toString());
    if (params.page) query.append("page", params.page.toString());
    if (params.search) query.append("search", params.search);
    if (params.type) query.append("type", params.type);
    if (params.min_price)
      query.append("min_price", params.min_price.toString());
    if (params.max_price)
      query.append("max_price", params.max_price.toString());
    if (params.min_question)
      query.append("min_question", params.min_question.toString());
    if (params.max_question)
      query.append("max_question", params.max_question.toString());
    if (params.allows_multiple_responses !== undefined)
      query.append(
        "allows_multiple_responses",
        params.allows_multiple_responses.toString(),
      );
    if (params.campaign_end_date)
      query.append("campaign_end_date", params.campaign_end_date);

    const queryString = query.toString();
    const endpoint = `/contributor/campaigns?${queryString}`;

    return await fetchData<ServerResponse<any>>(endpoint);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return null;
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
