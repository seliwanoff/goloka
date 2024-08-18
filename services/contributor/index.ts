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


// /contributor/aacgimnps;
// ~ =============================================>
// ~ ======= Get campaign user  -->
// ~ =============================================>
export const getAllTask = async () => {
  try {
    return await fetchData<ServerResponse<any>>("/contributor/campaign");
  } catch (error) {
    console.log(error);
    return null;
  }
};