import { organizationDetails } from "@/helper";
import { postData } from "@/lib/api";
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
      organizationDetails.currency = country.currency;

      localStorage.setItem("organization_domain", domain);
      localStorage.setItem("organization_currency", country.currency);
    }

    return response as AxiosResponse<any>;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
};
