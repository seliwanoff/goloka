import { queryClient } from "@/components/layout/tanstackProvider";
import { fetchData, postData } from "@/lib/api";

import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { organization_id } from "@/helper";

export const createQuestion = async (
  id: any,
  payload: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organization_id}/campaigns/${id}/questions/create`,
      payload,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const createSection = async (
  id: any,
  payload: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organization_id}/campaigns/${id}/question-groups/create`,
      {
        name: payload,
      },
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const getCampaignQuestion = async (
  id: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await fetchData(
      `/organizations/${organization_id}/campaigns/${id}/questions`,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const reOrdreQuestion = async (
  id: any,
  payload: any,
): Promise<AxiosResponse<any>> => {
  console.log(payload);
  try {
    return await postData(
      `/organizations/${organization_id}/campaigns/${id}/questions/reorder`,
      {
        question: payload,
      },
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
