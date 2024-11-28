// types/user.ts
interface BankAccount {
  id: number;
  bank_code: string | number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

interface Country {
  id: number;
  label: string;
  key: string;
  "currency-code": string;
  "currency-symbol": string;
  "phone-code": string;
}

export interface IRemoteUser {
  id: number;
  birth_date: string;
  gender: string;
  religion: string;
  ethnicity: string;
  primary_language: string;
  spoken_languages: string[];
  latitude: number;
  longitude: number;
  location: string;
  location_updated_at: string;
  bank_accounts: BankAccount[];
  profile_photo_url: string | null;
  country: Country;
  wallet_balance: string;
}

export interface RemoteUserResponse {
  data: IRemoteUser;
}

// store/useRemoteUserStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface RemoteUserState {
  user: IRemoteUser | null;
  isAuthenticated: boolean;
  setUser: (user: IRemoteUser | null) => void; // Modified to accept null
  clearUser: () => void;
}

export const useRemoteUserStore = create<RemoteUserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: user !== null,
        }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "remote-user-storage", // Unique name to avoid conflicts
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Helper functions for token management
export const clearAuthTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_type");
};

export const getAuthTokens = () => {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const token_type = localStorage.getItem("token_type");

  return {
    access_token: access_token ? JSON.parse(access_token) : null,
    refresh_token: refresh_token ? JSON.parse(refresh_token) : null,
    token_type: token_type ? JSON.parse(token_type) : null,
  };
};
