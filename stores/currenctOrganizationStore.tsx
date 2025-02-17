import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OrganizationData {
  id: number;
  name: string;
  email: string;
  country: {
    "currency-symbol"?: string;
    "currency-code"?: string;
  };
  current_role: string | null;
  email_verified_at: string;
  pin_status: boolean;
  domain?: string;
  currency?: string;
  symbol?: string;
  image?: any;
}

interface OrganizationStore {
  organization: OrganizationData | null;
  setOrganization: (userData: OrganizationData | null) => void;
  setRefetchUser: (refetchFn: () => Promise<any>) => void;
  refetchUser: () => Promise<any>;
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set) => ({
      organization: null,
      refetchUser: async () => Promise.resolve(),

      setOrganization: (userData) => {
        set({ organization: userData });

        if (userData) {
          const { domain, country } = userData;

          //  console.log("Country Data:", country);

          localStorage.setItem("organization_domain", domain || "");
          localStorage.setItem("symbol", country?.["currency-symbol"] || "");
          localStorage.setItem(
            "organization_currency",
            country?.["currency-code"] || "",
          );
        } else {
          // Clear localStorage when organization is null
          localStorage.removeItem("organization_domain");
          localStorage.removeItem("symbol");
          localStorage.removeItem("organization_currency");
        }
      },

      setRefetchUser: (refetchFn) => set({ refetchUser: refetchFn }),
    }),
    {
      name: "organization-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const { organization } = state;
        return {
          organization: organization
            ? {
                id: organization.id,
                name: organization.name,
                email: organization.email,
                domain: organization.domain || "",
                symbol: organization.symbol || "",
                currency: organization.country?.["currency-code"] || "",
              }
            : null,
        };
      },
    },
  ),
);
