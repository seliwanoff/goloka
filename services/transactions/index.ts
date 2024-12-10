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

interface GetTransactions {
  per_page?: number;

  start_date?: string;
  end_date?: string;

  type?: string;
}

export const getAllTransactions = async (params: GetTransactions) => {
  try {
    const query = new URLSearchParams();

    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    // Append query parameters
    appendQuery("per_page", params.per_page);

    appendQuery("start_date", params.start_date);
    appendQuery("end_date", params.end_date);

    appendQuery("status", params.type);

    const endpoint = `/contributor/transactions?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions. Please try again later.");
  }
};
