import { transactions } from "@/utils";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoadingStore = create<LoadingState>()(
  persist(
    (set) => ({
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "loading-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

interface FilterTypeState {
  filterType: string;
  setFilterType: (value: string) => void;
}

const useWalletFilter = create<FilterTypeState>((set) => ({
  filterType: "all",
  setFilterType: (value) => set({ filterType: value }),
}));

export type ITransaction = {
  beneficiary: string;
  accountNumber: number | string;
  bank: string;
  amount_usd: string;
  amount_ngn: string;
};

interface FundState {
  step: number;
  setStep: (value: number) => void;
  transaction: ITransaction | null;
  setTransaction: (
    value: ITransaction | ((prev: ITransaction) => ITransaction),
  ) => void;
  clearTransaction: () => void;
}

const useWithdrawStepper = create<FundState>((set) => ({
  step: 0,
  setStep: (value) => set({ step: value }),
  transaction: {
    beneficiary: "",
    accountNumber: "",
    bank: "",
    amount_usd: "",
    amount_ngn: "",
  },
  setTransaction: (value) =>
    set((state) => ({
      transaction:
        typeof value === "function" ? value(state.transaction!) : value,
    })),
  clearTransaction: () =>
    set(() => ({
      transaction: {
        beneficiary: "",
        accountNumber: "",
        bank: "",
        amount_usd: "",
        amount_ngn: "",
      },
    })),
}));

export { useLoadingStore, useWalletFilter, useWithdrawStepper };
