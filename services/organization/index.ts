
import { queryClient } from "@/components/layout/tanstackProvider";
import { postData } from "@/lib/api";
import { UseQueryResult } from "@tanstack/react-query";
import { ServerResponse } from "http";

// ~ =============================================>
// ~ ======= Create a organization  -->
// ~ =============================================>
export const createOrganization = async (
  data: any,
): Promise<UseQueryResult<ServerResponse<any>>> => {
  return queryClient.fetchQuery({
    queryKey: ["create organization"],
    queryFn: async () => {
      return await postData<ServerResponse<any>>("/organizations/create", data);
    },
  });
};
