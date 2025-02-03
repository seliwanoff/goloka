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
interface AddWithdrawSTat {
  open: boolean;
  setOpen: (value: boolean) => void;
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

interface OpenOrganizationState {
  openOrganization: boolean;
  setOpenOrganization: (value: boolean) => void;
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
  countryId: string[];
  stateIds: string[];
  lgaIds: string[];
}
interface EditCampaignMainState {
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
  countryId: any;
  stateIds: any;
  lgaIds: any;
  setCountryIds: (value: string) => void;
  setStateIds: (value: string) => void;
  setLgids: (value: string) => void;
  setpayment_rate_for_response: (value: number) => void;
  setResponseRate: (value: number) => void;
  number_of_responses: any;
  setNumberOfresponse: (value: number) => void;
  payment_rate_for_response: any;
  startDate: any;
  endDate: any;
  setStartDate: (value: any) => void;
  setEndDate: (value: any) => void;
  allow_multiple_responses: boolean;
  setAllowMultipleResponses: (value: boolean) => void;
  type: string;
  setType: (value: string) => void;
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

const useCreateOrganizationOverlay = create<OpenOrganizationState>((set) => ({
  openOrganization: false,
  setOpenOrganization: (value) => set({ openOrganization: value }),
}));

const useAddBeneficiaryOverlay = create<AddBeneState>((set) => ({
  show: false,
  setShow: (value) => set({ show: value }),
}));
const useWithdrawalfundsOverlay = create<AddWithdrawSTat>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
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
  countryId: [],
  stateIds: [],
  lgaIds: [],
}));

const useEditMainCampaignOverlay = create<EditCampaignMainState>((set) => ({
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
  countryId: [],
  stateIds: [],
  lgaIds: [],
  setStateIds: (value) => set({ stateIds: value }),
  setLgids: (value) => set({ lgaIds: value }),
  setCountryIds: (value) => set({ countryId: value }),
  number_of_responses: 0,
  setNumberOfresponse: (value) => set({ number_of_responses: value }),
  setResponseRate: (value) => set({ payment_rate_for_response: value }),
  payment_rate_for_response: 0,
  setpayment_rate_for_response: (value) =>
    set({ payment_rate_for_response: value }),
  startDate: null,
  endDate: null,
  setStartDate: (value) => set({ startDate: value }),
  setEndDate: (value) => set({ endDate: value }),
  allow_multiple_responses: false,
  setAllowMultipleResponses: (value) =>
    set({ allow_multiple_responses: value }),
  type: "",
  setType: (value) => set({ type: value }),
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
  useCreateOrganizationOverlay,
  useWithdrawalfundsOverlay,
  useEditMainCampaignOverlay,
};
