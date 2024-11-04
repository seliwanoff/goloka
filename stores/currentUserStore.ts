import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define TypeScript interface for user data (optional but recommended)
interface UserData {
  id: number;
  name: string;
  email: string;
  country: string;
  current_role: string | null;
  email_verified_at: string;
  pin_status: boolean;
}

interface UserStore {
  user: UserData | null;
  isAuthenticated: boolean;
  setUser: (userData: UserData | null) => void;
  loginUser: (userData: UserData) => void;
  logoutUser: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (userData) =>
        set(() => ({
          user: userData,
          isAuthenticated: !!userData,
        })),

      loginUser: (userData) =>
        set(() => ({
          user: userData,
          isAuthenticated: true,
        })),

      logoutUser: () =>
        set(() => ({
          user: null,
          isAuthenticated: false,
        })),
    }),
    {
      name: "current-user-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
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