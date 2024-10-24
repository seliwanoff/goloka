import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  data: {
    id: number;
    name: string;
    email: string;
    country: string;
    current_role: string | null;
    email_verified_at: string;
  };
}

interface UserState {
  currentUser: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export interface IBeneficiary {
  id: number;
  bank_code: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

interface BeneficiaryState {
  beneficiaries: IBeneficiary[];
  addBeneficiary: (beneficiary: IBeneficiary) => void;
  removeBeneficiary: (id: number) => void;
  clearBeneficiaries: () => void;
}

export const useBeneficiaryStore = create<BeneficiaryState>()(
  persist(
    (set) => ({
      beneficiaries: [],
      addBeneficiary: (beneficiary) =>
        set((state) => ({
          beneficiaries: [...state.beneficiaries, beneficiary],
        })),
      removeBeneficiary: (id) =>
        set((state) => ({
          beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
        })),
      clearBeneficiaries: () => set({ beneficiaries: [] }),
    }),
    {
      name: "beneficiary-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);