import { create } from "zustand";

interface StoreState {
  open: boolean;
  setOpen: (value: boolean) => void;
}

interface FilterState {
  openFilter: boolean;
  setOpenFilter: (value: boolean) => void;
}

interface AddBeneState {
  show: boolean;
  setShow: (value: boolean) => void;
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
  open: false,
  setOpen: (value) => set({ open: value }),
}));

const useWithdrawOverlay = create<StoreState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
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
};
