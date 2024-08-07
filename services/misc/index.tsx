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
// ~ ======= Get country  -->
// ~ =============================================>
export const getCountry = async (): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>("/countries");
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getOTP = async (
  {}: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["getOTP"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/email/otp/send", {});
    },
  });
};


// ~ =============================================>
// ~ ======= location  -->
// ~ =============================================>
export const updateLocation = async (
  locationData: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["update location"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        "/contributor-profile/location",
        locationData,
      );
    },
  });
};
