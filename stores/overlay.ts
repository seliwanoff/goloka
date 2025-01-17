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

interface AddSectionState {
  showSection: boolean;
  setShowSection: (value: boolean) => void;
  isSectionAdded: boolean;
  setIsSectionAdded: (value: boolean) => void;
}

interface TransferState {
  openTransfer: boolean;
  setOpenTransfer: (value: boolean) => void;
}

interface CampaignGroupState {
  fetchData: boolean;
  show: boolean;
  setShowCreate: (value: boolean) => void;
  setFecthed: (value: boolean) => void;
}

interface openSuccessModalState {
  open: boolean;
  setOpen: (value: boolean) => void;
}
interface EditCampaignState {
  show: boolean;
  setShow: (value: boolean) => void;
  title: string;
  id: number;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  setId: (value: number) => void;
  isShowEdit: boolean;
  setIsShowEdit: (value: boolean) => void;
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

const useOpenSuccessModalOverlay = create<openSuccessModalState>((set) => ({
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
const useAddQuestionSectionOverlay = create<AddSectionState>((set) => ({
  showSection: false,
  setShowSection: (value) => set({ showSection: value }),
  isSectionAdded: false,
  setIsSectionAdded: (value) => set({ isSectionAdded: value }),
}));
const useAddcampaignGroupOverlay = create<CampaignGroupState>((set) => ({
  show: false,
  fetchData: false,
  setFecthed: (value) => set({ fetchData: value }),
  setShowCreate: (value) => set({ show: value }),
}));

const useEditCampaignOverlay = create<EditCampaignState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
  title: "",
  setTitle: (value) => set({ title: value }),
  description: "",
  id: 0,
  setDescription: (value) => set({ description: value }),
  setId: (value) => set({ id: value }),
  isShowEdit: false,
  setIsShowEdit: (value) => set({ isShowEdit: value }),
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
  useOpenSuccessModalOverlay,
  useAddQuestionSectionOverlay,
};
