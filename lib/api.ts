// apiService.ts
import axiosInstance from "./axiosInstance";
import { UseQueryResult, QueryFunction, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

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
  data: any,
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
  id?: string,
  options = {},
): Promise<T> => {
  const url = `${resource}/${id}`;
  const response = await axiosInstance.delete<T>(url, options);
  return response.data;
};

async function getStreamData<T>(url: string) {
  const response: AxiosResponse<any> = await axiosInstance.get(url, {});
  return response.data;
}

export {
  fetchData,
  postData,
  updateData,
  deleteData,
  fetchDataById,
  updateDataById,
  deleteDataById,
  getStreamData,
};
