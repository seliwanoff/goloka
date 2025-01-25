import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OrganizationData {
  id: number;
  name: string;
  email: string;
  country: any;
  current_role: string | null;
  email_verified_at: string;
  pin_status: boolean;
  domain?: string; // Added domain
  currency?: string;

  symbol?: string; // Added currency
}

interface OrganizationStore {
  organization: OrganizationData | null;
  setOrganization: (userData: OrganizationData | null) => void;
  setRefetchUser: (refetchFn: () => Promise<any>) => void; // Store refetch function
  refetchUser: () => Promise<any>;
}

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set) => ({
      organization: null,
      refetchUser: async () => Promise.resolve(),

      setOrganization: (userData) => {
        set(() => ({
          organization: userData,
        }));

        if (userData) {
          console.log("Country Data:", userData.country);

          localStorage.setItem("organization_domain", userData.domain || "");

          localStorage.setItem(
            "symbol",
            userData.country["currency-symbol"] || "",
          );
          localStorage.setItem(
            "organization_currency",
            userData.country["currency-code"] || "",
          );
        }
      },

      setRefetchUser: (refetchFn) => set(() => ({ refetchUser: refetchFn })),
    }),
    {
      name: "organization-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        organization: state.organization
          ? {
              ...state.organization,
              domain: state.organization.domain,
              symbol: state.organization.symbol,
              currency: state.organization.country["currency-code"],
            }
          : null,
      }),
    },
  ),
);
