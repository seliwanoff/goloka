import { withdrawFunds } from "@/services/wallets";
import { toast } from "sonner";
import { create } from "zustand";

interface TransactionState {
  amount: number;
  pin: string;
  bank_code: string;
  account_number: string;
  save_account: boolean;
  loading: boolean; // Track loading state
  error: string | null; // Track errors
  response: any | null; // Store response data

  setAmount: (amount: number) => void;
  setPin: (pin: string) => void;
  setBankCode: (bank_code: string) => void;
  setAccountNumber: (account_number: string) => void;
  setSaveAccount: (save_account: boolean) => void;
  resetState: () => void;

  submitTransaction: () => Promise<void>;
}

export const useWalletStore = create<TransactionState>((set) => ({
  amount: 0,
  pin: "",
  bank_code: "",
  account_number: "",
  save_account: false,
  loading: false,
  error: null,
  response: null,

  setAmount: (amount) => set({ amount }),
  setPin: (pin) => set({ pin }),
  setBankCode: (bank_code) => set({ bank_code }),
  setAccountNumber: (account_number) => set({ account_number }),
  setSaveAccount: (save_account) => set({ save_account }),

  resetState: () =>
    set({
      amount: 0,
      pin: "",
      bank_code: "",
      account_number: "",
      save_account: false,
      loading: false,
      error: null,
      response: null,
    }),

  submitTransaction: async () => {
    const { amount, pin, bank_code, account_number, save_account } =
      useWalletStore.getState();

    set({ loading: true, error: null, response: null }); // Start loading

    try {
      const response = await withdrawFunds(
        amount,
        pin,
        bank_code,
        account_number,
        save_account,
      );

      set({ response: response.data, loading: false }); // Save response and stop loading
      console.log("Transaction Successful:", response.data);
    } catch (error: any) {
      // console.log(error?.response?.data?.message, "jgjjgjgj");
      set({ error: error?.response?.data?.message, loading: false }); // Save error and stop loading
      toast.error(error?.response?.data?.message);
    }
  },
}));
