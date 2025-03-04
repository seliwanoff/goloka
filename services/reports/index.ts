import { postData } from "@/lib/api";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";
import { useUserStore } from "@/stores/currentUserStore";
import { AxiosResponse } from "axios";

export const reportOrganizationAndCampaign = async (
  id: string,
  title: string,
  description: string,
): Promise<AxiosResponse<any>> => {
  try {
    const { user: currentUser } = useUserStore.getState();
    const { organization: currentOrganization } =
      useOrganizationStore.getState();

    console.log(currentOrganization);

    return await postData(`/reports/create`, {
      title,
      description,
      reportable_type: currentUser?.current_role || "organization",
      reportable_id:
        currentUser?.current_role === "contributor"
          ? currentUser?.id
          : currentOrganization?.id,
      campaign_id: id,
    });
  } catch (error) {
    console.error("Error reporting organization and campaign:", error);
    throw error;
  }
};
