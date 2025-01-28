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
import { organizationDetails } from "@/helper";

interface GetTransactions {
  per_page?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  page: number;
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
    appendQuery("search", params.search);
    appendQuery("page", params.page);
    appendQuery("start_date", params.start_date);
    appendQuery("end_date", params.end_date);

    appendQuery("type", params.type);

    const endpoint = `/contributor/transactions?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions. Please try again later.");
  }
};

export const getTrxId = async (
  Id: string,
): Promise<UseQueryResult<AxiosResponse<any>>> =>
  await queryClient.fetchQuery({
    queryKey: ["Trx by TrxId"],
    queryFn: async () => {
      try {
        return await fetchData(`/contributor/transactions/${Id}`);
      } catch (error) {
        return null;
      }
    },
  });

export const getAllOrganizationTransaction = async (
  params: GetTransactions,
) => {
  try {
    const query = new URLSearchParams();

    const appendQuery = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        query.append(key, value.toString());
      }
    };

    // Append query parameters
    appendQuery("per_page", params.per_page);
    appendQuery("search", params.search);
    appendQuery("page", params.page);
    appendQuery("start_date", params.start_date);
    appendQuery("end_date", params.end_date);

    appendQuery("type", params.type);

    const endpoint = `/organizations/${organizationDetails.domain}/transactions?${query.toString()}`;
    const response = await fetchData<ServerResponse<any>>(endpoint);

    return response;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions. Please try again later.");
  }
};

export const getTrxIdonOrganization = async (
  Id: string,
): Promise<UseQueryResult<AxiosResponse<any>>> =>
  await queryClient.fetchQuery({
    queryKey: ["Trx by TrxId"],
    queryFn: async () => {
      try {
        return await fetchData(
          `rganizations/${organizationDetails.domain}/transactions/${Id}`,
        );
      } catch (error) {
        return null;
      }
    },
  });
