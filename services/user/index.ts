
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
export const createUser = async (
  userData: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["create user"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/register", userData);
    },
  });
};
// ~ =============================================>
// ~ ======= verifyOTP  -->
// ~ =============================================>
export const veifyOTP = async (
  otp: string,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["VERIFY OTP"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/email/verify", otp);
    },
  });
};

// ~ =============================================>
// ~ ======= Get current user  -->
// ~ =============================================>
export const getCurrentUser = async () => {
  try {
    return await fetchData<ServerResponse<any>>("/user");
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ~ =============================================>
// ~ ======= Get single user data   -->
// ~ =============================================>
export const getUserData = async (): Promise<UseQueryResult<any>> => {
  return queryClient.fetchQuery({
    queryKey: ["Get user data"],
    queryFn: async () => {
      try {
        return await fetchData<ServerResponse<any>>("/user");
      } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch user data");
      }
    },
  });
};

// ~ =============================================>
// ~ ======= Update a user  -->
// ~ =============================================>
export const updateUser = async (
  userId: string,
  userData: any,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await updateData<ServerResponse<any>>(`users/update`, userData);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ~ =============================================>
// ~ ======= Delete a user  -->
// ~ =============================================>
export const deleteUser = async (
  userId: string,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await deleteData<ServerResponse<any>>(`users/${userId}`);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ~ =============================================>
// ~ ======= Fetch a user by its id  -->
// ~ =============================================>
export const getUserById = async (
  userId: string,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchDataById<ServerResponse<any>>(`users/`, userId);
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ~ =============================================>
// ~ ======= Update a user by its id  -->
// ~ =============================================>
export const updateUserById = async (
  userId: string,
  userData: any,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await updateDataById<ServerResponse<any>>(
      `users/`,
      userId,
      userData,
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

// ~ =============================================>
// ~ ======= Delete a user by its id -->
// ~ =============================================>
export const deleteUserById = async (
  userId: string,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await deleteDataById<ServerResponse<any>>(`users/`, userId);
  } catch (error) {
    console.log(error);
    return null;
  }
};
