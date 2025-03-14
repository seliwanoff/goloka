// apiService.ts
import axiosInstance from "./axiosInstance";
import { UseQueryResult, QueryFunction, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { AxiosProgressEvent } from "axios";

export interface ServerResponse<T> {
  data: T;
  message: string;
  status: string;
}

const fetchData = async <T>(url: string, options = {}): Promise<T> => {
  const response = await axiosInstance.get<T>(url, options);
  return response.data;
};

const postData = async <T>(
  url: string,
  data?: any,
  options = {},
): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data, options);
  return response.data;
};

const updateData = async <T>(
  url: string,
  data: any,
  options = {},
): Promise<T> => {
  const response = await axiosInstance.patch<T>(url, data, options);
  return response.data;
};

const deleteData = async <T>(url: string, options = {}): Promise<T> => {
  const response = await axiosInstance.delete<T>(url, options);
  return response.data;
};

export const useFetchQuery = <T>(
  queryKey: string[],
  queryFn: QueryFunction<T>,
): UseQueryResult<T> => {
  return useQuery({
    queryKey,
    queryFn,
  });
};

const fetchDataById = async <T>(
  resource: string,
  id: string,
  options = {},
): Promise<T> => {
  const url = `${resource}/${id}`;
  const response = await axiosInstance.get<T>(url, options);
  return response.data;
};

const updateDataById = async <T>(
  resource: string,
  id: string,
  data: any,
  options = {},
): Promise<T> => {
  const url = `${resource}/${id}`;
  const response = await axiosInstance.put<T>(url, data, options);
  return response.data;
};

const deleteDataById = async <T>(
  resource: string,
  id: string,
  options = {},
): Promise<T> => {
  const url = `${resource}/${id}`;
  const response = await axiosInstance.delete<T>(url, options);
  return response.data;
};
const deleteDataByIdx = async <T>(url: string, options = {}): Promise<T> => {
  const response = await axiosInstance.delete<T>(url, options);
  return response.data;
};
async function getStreamData<T>(url: string) {
  const response: AxiosResponse<any> = await axiosInstance.get(url, {});
  return response.data;
}

const uploadQuestionFile = async (
  responseId: string,
  formData: FormData,
): Promise<any> => {
  /**   let toastId: string | number = toast.loading("Uploading file... 0%");*/

  try {
    const endpoint = `/contributor/responses/${responseId}/answer/upload`;

    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(`File upload progress: ${percentCompleted}%`);
          {
            /***
          toast.message(`Uploading file... ${percentCompleted}%`, {
            id: toastId,
          });

        */
          }
        } else {
          console.log("Upload progress: unable to calculate percentage");
        }
      },
    });

    console.log("File uploaded successfully:", response.data);
    //@ts-ignore
    {
      /***
    toast.success(response?.message || "File uploaded successfully", {
      id: toastId,
    });
    */
    }

    return {
      success: true,
      //@ts-ignore
      message: response?.message || "File uploaded successfully",
    };
  } catch (error) {
    console.error("Error during file upload:", error);

    //toast.error("Failed to upload file. Please try again.", { id: toastId });

    return {
      success: false,
      message: error instanceof Error ? error.message : "File upload failed",
    };
  }
};
interface StateItem {
  id: number;
  name: string;
  // other properties
}
// Function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (1-based, so we add 1)
  const day = date.getDate().toString().padStart(2, "0"); // Get day

  return `${year}-${month}-${day}`;
};

export const createCampaign = async ({
  title,
  description,
  selectedLgs,
  selectedStates,
  number_of_responses,
  payment_rate_for_response,
  starts_at,
  ends_at,
  allows_multiple_responses,
  images,
}: {
  title: string;
  description: string;
  selectedStates: StateItem[]; // array of StateItem
  selectedLgs: StateItem[]; // array of StateItem
  number_of_responses: any;
  payment_rate_for_response: any;
  starts_at: any;
  ends_at: any;
  allows_multiple_responses: number;
  images: string[];
}) => {
  const formattedStartsAt = formatDate(starts_at);
  const formattedEndsAt = formatDate(ends_at);

  // Extracting ids from StateItem objects
  const stateIds = selectedStates.map((state) => state.id); // Extract 'id' from each StateItem
  const lgaIds = selectedLgs.map((lga) => lga.id); // Extract 'id' from each StateItem

  // Define the type for the accumulator
  const payload: { [key: string]: string | number | string[] } = {
    title,
    type: "survey",
    description,
    number_of_responses,
    payment_rate_for_response,
    starts_at: formattedStartsAt,
    ends_at: formattedEndsAt,
    allows_multiple_responses,
    images,
  };

  // Add state_ids and lga_ids in the correct form
  stateIds.forEach((id, index) => {
    payload[`state_ids[${index}]`] = id;
  });

  lgaIds.forEach((id, index) => {
    payload[`lga_ids[${index}]`] = id;
  });

  try {
    const response = await axiosInstance.post(
      "/organizations/campaigns/create",
      payload,
    );
    console.log("Campaign created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

// In apiService.ts
const postDataWithFormData = async <T>(
  url: string,
  formData: FormData,
  options: {
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  } = {},
): Promise<T> => {
  let toastId: string | number | undefined;

  try {
    // Show loading toast if not already passed in options
    if (!options.onUploadProgress) {
      toastId = toast.loading("Uploading... 0%");
    }

    const response = await axiosInstance.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );

          // Use custom progress callback if provided, otherwise use default toast
          if (options.onUploadProgress) {
            options.onUploadProgress(progressEvent);
          } else {
            toast.message(`Uploading... ${percentCompleted}%`, {
              id: toastId,
            });
          }
        }
      },
    });

    // Dismiss loading toast and show success
    if (toastId) {
      //@ts-ignore
      toast.success(response.data.message || "Upload successful", {
        id: toastId,
      });
    }

    return response.data;
  } catch (error: any) {
    // Dismiss loading toast and show error
    if (toastId) {
      toast.error(
        error.response?.data?.message || "Upload failed. Please try again.",
        { id: toastId },
      );
    }

    // Re-throw the error for further handling if needed
    throw error;
  }
};

export {
  postDataWithFormData,
  fetchData,
  postData,
  updateData,
  deleteData,
  fetchDataById,
  updateDataById,
  deleteDataById,
  getStreamData,
  uploadQuestionFile,
  deleteDataByIdx,
};
