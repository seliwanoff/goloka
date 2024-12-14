import { create } from "zustand";

interface StoreState {
  id?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  setId?: (id: string) => void;
}

interface FilterState {
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
}

interface AddBeneState {
  show: boolean;
  setShow: (value: boolean) => void;
}

interface TransferState {
  openTransfer: boolean;
  setOpenTransfer: (value: boolean) => void;
}

const useShowOverlay = create<StoreState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useShowFilter = create<FilterState>((set) => ({
  openFilter: false,
  setOpenFilter: (value) => set({ openFilter: value }),
}));

const useInvoiceOverlay = create<StoreState>((set) => ({
  setId: (value: string) => set({ id: value }),
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useWithdrawOverlay = create<StoreState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useTransferOverlay = create<TransferState>((set) => ({
  openTransfer: false,
  setOpenTransfer: (value) => set({ openTransfer: value }),
}));

const useAddBeneficiaryOverlay = create<AddBeneState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
}));

export {
  useShowOverlay,
  useShowFilter,
  useInvoiceOverlay,
  useWithdrawOverlay,
  useAddBeneficiaryOverlay,
  useTransferOverlay,
};
