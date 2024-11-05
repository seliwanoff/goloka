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

export const getContributorsBalance = async (): Promise<
  ServerResponseOrNull<any>
> => {
  try {
    return await fetchData<ServerResponse<any>>("/contributor/balance");
  } catch (error) {
    console.log(error);
    return null;
  }
};

interface TransactionState {
  amount: number;
  pin: string;
  bank_code: string;
  account_number: string;
  save_account: boolean;
}

interface ITransferState {
  wallet_id: string;
  amount: number;
  pin: number;
}

export const withdrawFunds = async (
  amount: number,
  pin: string,
  bank_code: string,
  account_number: string,
  save_account: boolean,
): Promise<AxiosResponse<TransactionState>> =>
  await queryClient.fetchQuery({
    queryKey: ["withdraw funds"],
    queryFn: async () => {
      try {
        const response = await postData("/wallet/withdraw", {
          amount,
          pin,
          bank_code,
          account_number,
          save_account,
        });
        return response;
      } catch (error) {
        console.error("Failed to withdraw:", error);
        throw error;
      }
    },
  });

export const getOrganizationInfo = async (
  id: string,
): Promise<AxiosResponse<any[]>> => {
  try {
    return await fetchData(`/resolve-organization?wallet_id=${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const TransferFunds = async (
  wallet_id: string,
  amount: number,
  pin: number,
): Promise<AxiosResponse<ITransferState>> =>
  await queryClient.fetchQuery({
    queryKey: ["withdraw funds"],
    queryFn: async () => {
      try {
        const response = await postData("/wallet/withdraw", {
          amount,
          pin,
          wallet_id,
        });
        return response;
      } catch (error) {
        console.error("Failed to withdraw:", error);
        throw error;
      }
    },
  });
