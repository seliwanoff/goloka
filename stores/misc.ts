
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

export type ITransfer = {
  walletID: string;
  organisation: string;
  amount: string;
};

interface FundState {
  step: number;
  setStep: (value: number | ((prev: number) => number)) => void;
  transaction: ITransaction | null;
  setTransaction: (
    value: ITransaction | ((prev: ITransaction) => ITransaction),
  ) => void;
  clearTransaction: () => void;
}

interface TransferState {
  step: number;
  setStep: (value: number | ((prev: number) => number)) => void;
  transaction: ITransfer | null;
  setTransaction: (value: ITransfer | ((prev: ITransfer) => ITransfer)) => void;
  clearTransaction: () => void;
}

// stores/misc.ts
interface ShowPinState {
  showPin: boolean;
  setShowPin: (value: boolean) => void;
  onPinCreated: () => Promise<void>;
  setOnPinCreated: (callback: () => Promise<void>) => void;
}
interface ShowPasswordOTPState {
  showOTP: boolean;
  setShowOTP: (value: boolean) => void;
}

const useShowPin = create<ShowPinState>((set) => ({
  showPin: false,
  setShowPin: (value: boolean) => set({ showPin: value }),
  onPinCreated: async () => {},
  setOnPinCreated: (callback: () => Promise<void>) =>
    set({ onPinCreated: callback }),
}));
const useShowPasswordOtp = create<ShowPasswordOTPState>((set) => ({
  showOTP: false,
  setShowOTP: (value: boolean) => set({ showOTP: value }),
}));

interface ModalState {
  isLastStepLoading: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setLastStepLoading: (isLoading: boolean) => void;
}

export const useSuccessModalStore = create<ModalState>((set) => ({
  isLastStepLoading: false,
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setLastStepLoading: (isLoading) => set({ isLastStepLoading: isLoading }),
}));

const useWithdrawStepper = create<FundState>((set) => ({
  step: 0,
  setStep: (value) =>
    set((state) => ({
      step: typeof value === "function" ? value(state.step!) : value,
    })),
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

const useTransferStepper = create<TransferState>((set) => ({
  step: 0,
  setStep: (value) =>
    set((state) => ({
      step: typeof value === "function" ? value(state.step!) : value,
    })),
  transaction: {
    walletID: "",
    organisation: "",
    amount: "",
  },
  setTransaction: (value) =>
    set((state) => ({
      transaction:
        typeof value === "function" ? value(state.transaction!) : value,
    })),
  clearTransaction: () =>
    set(() => ({
      transaction: {
        walletID: "",
        organisation: "",
        amount: "",
      },
    })),
}));

export {
  useLoadingStore,
  useWalletFilter,
  useWithdrawStepper,
  useTransferStepper,
  useShowPin,
  useShowPasswordOtp,
};
