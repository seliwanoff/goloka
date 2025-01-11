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

interface CampaignGroupState {
  show: boolean;
  setShowCreate: (value: boolean) => void;
}

interface EditCampaignState {
  show: boolean;
  setShow: (value: boolean) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (alue: string) => void;
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

const useAddcampaignGroupOverlay = create<CampaignGroupState>((set) => ({
  show: false,
  setShowCreate: (value) => set({ show: value }),
}));

const useEditCampaignOverlay = create<EditCampaignState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
  title: "",
  setTitle: (value) => set({ title: value }),
  description: "",
  setDescription: (value) => set({ description: value }),
}));
export {
  useShowOverlay,
  useShowFilter,
  useInvoiceOverlay,
  useWithdrawOverlay,
  useAddBeneficiaryOverlay,
  useTransferOverlay,
  useAddcampaignGroupOverlay,
  useEditCampaignOverlay,
};
