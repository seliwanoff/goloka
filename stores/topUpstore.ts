import { TransferFunds, withdrawFunds } from "@/services/wallets";
import { toast } from "sonner";
import { create } from "zustand";

interface ITransferState {
  amount: number;
  reference: string;
  wallet_id: string;
  accountName: string;
  loading: false;
  error: null;
  response: null;
  date: string;
  setAmount: (amount: number) => void;
  setReference: (pin: string) => void;
  setWallet_id: (wallet_id: string) => void;
  setDate: (date: string) => void;
  resetState: () => void;
  setAccountName: (accountName: string) => void;
}

export const useTopUpStores = create<ITransferState>((set) => ({
  amount: 0,
  reference: "",
  wallet_id: "",
  date: "",
  accountName: "", // Replace with actual account number
  loading: false,
  error: null,
  response: null,

  setAmount: (amount) => set({ amount }),
  setReference: (reference) => set({ reference }),
  setWallet_id: (wallet_id) => set({ wallet_id }),
  setDate: (date) => set({ date }),
  setAccountName: (accountName) => set({ accountName }),
  resetState: () =>
    set({
      amount: 0,
      reference: "",
      wallet_id: "",
      loading: false,
      error: null,
      response: null,
    }),
}));
