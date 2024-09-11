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

export type ServerResponseOrNull<T> = ServerResponse<T> | null;


export const getContributorsBalance = async (): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>("/contributor/balance");
  } catch (error) {
    console.log(error);
    return null;
  }
};