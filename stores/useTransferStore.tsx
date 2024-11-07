import { TransferFunds, withdrawFunds } from "@/services/wallets";
import { create } from "zustand";

interface ITransferState {
  amount: number;
  pin: string;
  wallet_id: string;
  loading: false;
  error: null;
  response: null;

  setAmount: (amount: number) => void;
  setPin: (pin: string) => void;
  setWallet_id: (wallet_id: string) => void;
  resetState: () => void;

  submitTransaction: () => Promise<void>;
}

export const useTransactionStore = create<ITransferState>((set) => ({
  amount: 0,
  pin: "",
  wallet_id: "",
  loading: false,
  error: null,
  response: null,

  setAmount: (amount) => set({ amount }),
  setPin: (pin) => set({ pin }),
  setWallet_id: (wallet_id) => set({ wallet_id }),

  resetState: () =>
    set({
      amount: 0,
      pin: "",
      wallet_id: "",
      loading: false,
      error: null,
      response: null,
    }),

  submitTransaction: async () => {
    const { amount, pin, wallet_id } = useTransactionStore.getState();
//@ts-ignore
    set({ loading: true, error: null, response: null }); // Start loading

      try {
        //@ts-ignore
        const response = await TransferFunds(amount, pin, wallet_id);
        //@ts-ignore
        set({ response: response, loading: false }); // Save response and stop loading
        console.log("Transaction Successful:", response.data);
      } catch (error: any) {
      set({ error: error?.response?.data?.message, loading: false }); // Save error and stop loading
      console.error("Transaction Failed:", error?.response);
    }
  },
}));
