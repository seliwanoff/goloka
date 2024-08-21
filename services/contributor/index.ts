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
export const getAllTask = async () => {
  try {
    return await fetchData<ServerResponse<any>>("/contributor/campaigns");
  } catch (error) {
    console.log(error);
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
