import { queryClient } from "@/components/layout/tanstackProvider";
import { organizationDetails } from "@/helper";
import { fetchData, postData } from "@/lib/api";
import { AxiosResponse } from "axios";

export const createOrganization = async (
  payload: any,
): Promise<AxiosResponse<any>> => {
  // console.log(payload);
  try {
    const response: unknown = await postData(`/organizations/create`, payload);

    const { data } = response as AxiosResponse<any>;

    const { domain, country } = data;

    if (domain && country) {
      organizationDetails.domain = domain;
      organizationDetails.currency = country["country-code"];

      localStorage.setItem("organization_domain", domain);
      localStorage.setItem("organization_currency", country["country-code"]);
      localStorage.setItem("symbol", country["currency-symbol"]);
    }

    return response as AxiosResponse<any>;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};

export const getOrganizationByDomain = async (): Promise<
  AxiosResponse<any>
> => {
  try {
    return await fetchData(`/organizations/${organizationDetails.domain}`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};

export const getUseServices = async (): Promise<AxiosResponse<any>> => {
  try {
    return await fetchData(`user/services`);
  } catch (error) {
    console.error("Error fetching campaign questions:", error);
    throw error;
  }
};
export const validateTopUp = async (
  payload: any,
  trxref: any,
  ref: any,
): Promise<AxiosResponse<any>> => {
  // console.log(payload);
  try {
    const response: unknown = await postData(
      `/wallet/top-up/callback?trxref=${trxref}&reference=${ref}`,
      payload,
    );

    return response as AxiosResponse<any>;
  } catch (error) {
    // console.error("Error creating organization:", error);
    throw error;
  }
};
