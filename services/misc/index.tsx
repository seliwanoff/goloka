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
import axios from "axios";
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

export const getOTP = async ({}: any): Promise<
  UseQueryResult<ServerResponse<any>>
> => {
  return queryClient.fetchQuery({
    queryKey: ["getOTP"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/email/otp/send", {});
    },
  });
};
export const forgetPassword = async (
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["forgetPassword"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/password/otp/send", data);
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
// ~ =============================================>
// ~ ======= pIN  -->
// ~ =============================================>
export const updatePin = async (
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["update pin"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/pin/create", data);
    },
  });
};

export const uploadQuestionFile = async (
  responseId: string,
  formData: FormData,
) => {
 try {
   // Determine the base URL based on the environment
   const baseURL =
     process.env.NODE_ENV === "production"
       ? process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL
       : process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

   // Full endpoint URL
   const endpoint = `${baseURL}/contributor/responses/${responseId}/answer/upload`;

   const response = await axios.post(endpoint, formData, {
     headers: {
       "Content-Type": "multipart/form-data",
     },
     // Optionally add progress tracking
     // onUploadProgress: (progressEvent: ProgressEvent) => {
     //   // Calculate percentage of file upload progress
     //   const percentCompleted = Math.round(
     //     (progressEvent.loaded * 100) / progressEvent.total,
     //   );
     //   console.log(`File upload progress: ${percentCompleted}%`);
     // },
   });

   console.log("File uploaded successfully:", response.data);
   return response.data;
 } catch (error) {
   console.error("Error during file upload:", error);
   throw error;
 }
};
