import { queryClient } from "@/components/layout/tanstackProvider";
import { postData, fetchData, ServerResponse } from "@/lib/api";
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

export const getState = async (
  countryId: any,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>(
      `states?country_id=${countryId}`,
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getLgs = async (
  stateId: any,
): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>(`lgas?state_id=${stateId}`);
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
export const googleSignUp = async (
  credentialResponse: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["googleAuth"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        `/login/google/callback/mobile?id_token=${credentialResponse}`,
        {},
      );
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
// ~ =============================================>
// ~ ======= pIN  -->
// ~ =============================================>
export const makeReport = async (
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["report"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/reports/create", data);
    },
  });
};

export const notificationPreferences = async (
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["forgetPassword"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>(
        "/notifications/set-preference",
        data,
      );
    },
  });
};


export const getNotificationsPreference = async (): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>(
      "/notifications/preferences/get",
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getAblyToken = async (): Promise<ServerResponseOrNull<any>> => {
  try {
    return await fetchData<ServerResponse<any>>("/ably/token");
  } catch (error) {
    console.log(error);
    return null;
  }
};
