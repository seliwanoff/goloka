import { queryClient } from "@/components/layout/tanstackProvider";
import { deleteData, fetchData, postData } from "@/lib/api";

import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { organizationDetails } from "@/helper";

export const createQuestion = async (
  id: any,
  payload: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/questions/create`,
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
      `/organizations/${organizationDetails.domain}/campaigns/${id}/question-groups/create`,
      {
        name: payload,
      },
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const updateSection = async (
  id: any,
  payload: any,
  sectionId: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/question-groups/${sectionId}/update`,
      {
        name: payload,
      },
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
export const deleteSection = async (
  id: any,
  payload: any,
  sectionId: any,
): Promise<AxiosResponse<any>> => {
  try {
    return await deleteData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/question-groups/${sectionId}/delete`,
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
      `/organizations/${organizationDetails.domain}/campaigns/${id}/questions`,
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
      `/organizations/${organizationDetails.domain}/campaigns/${id}/questions/reorder`,

      payload,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const updateQuestion = async (
  id: any,
  payload: any,
  question: any,
): Promise<AxiosResponse<any>> => {
  console.log(payload);
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/questions/${question}/update`,

      payload,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const updateQuestion2 = async (
  id: any,
  payload: any,
): Promise<AxiosResponse<any>> => {
  console.log(payload);
  try {
    return await postData(
      `/organizations/${organizationDetails.domain}/campaigns/${id}/questions/reorde`,

      payload,
    );
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
