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
import { ServerResponseOrNull } from "../contributor";
import { AxiosResponse } from "axios";

export const getDashboardStats = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>(
      "/contributor/analytics/stat-two",
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getPlacesWithHighestTask = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>(
      "contributor/analytics/stat-three",
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getResponseStats = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>(
      "/contributor/analytics/stat-one",
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

interface GetResponsesParams {
  per_page?: number;
  page?: number;
  organization?: string;
  search?: string;
  min_payment?: number;
  max_payment?: number;
  start_date?: string;
  end_date?: string;
  allows_multiple_responses?: boolean;
  status?: string;

  sort_by?: "created_at" | "id" | "campaign_title" | "organization";
  sort_order?: "asc" | "desc";
}

// export interface GetResponsesParams {
//   page?: number;
//   per_page?: number;
//   search?: string;
//   start_date?: string;
//   end_date?: string;
//   status?: string;
//   // Add these optional properties to allow sorting
//   sort_by?: "created_at" | "id" | "campaign_title" | "organization";
//   sort_order?: "asc" | "desc";
// }

interface NotificationParams {
  per_page?: number;
  page?: number;
}

export const getAllResponses = async (params: GetResponsesParams) => {
  try {
    const query = new URLSearchParams();

    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    // Append query parameters
    appendQuery("per_page", params.per_page);
    appendQuery("page", params.page);
    appendQuery("organization", params.organization);
    appendQuery("search", params.search);
    appendQuery("min_payment", params.min_payment);
    appendQuery("max_payment", params.max_payment);
    appendQuery("start_date", params.start_date);
    appendQuery("end_date", params.end_date);
    appendQuery("allows_multiple_responses", params.allows_multiple_responses);
    appendQuery("status", params.status);

    const endpoint = `/contributor/responses?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw new Error("Failed to fetch responses. Please try again later.");
  }
};

export const getAResponse = async (
  Id: string,
): Promise<UseQueryResult<AxiosResponse<any[]>>> =>
  await queryClient.fetchQuery({
    queryKey: ["get a Response"],
    queryFn: async () => {
      try {
        return await fetchData(`/contributor/responses/${Id}`);
      } catch (error) {
        return null;
      }
    },
  });


// ~ =============================================>
// ~ ======= submitResponse  -->
// ~ =============================================>
export const submitResponseEndpoint = async (
  Id: string,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["submit Response"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        `/contributor/responses/${Id}/submit`,
        {},
      );
    },
  });
};

export const getNotifications = async (params: NotificationParams) => {
  try {
    const query = new URLSearchParams();

    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    // Append query parameters
    appendQuery("per_page", params.per_page);
    appendQuery("page", params.page);

    const endpoint = `/notifications?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching Notifications:", error);
    throw new Error("Failed to fetch Notificatios. Please try again later.");
  }
};
