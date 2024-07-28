import { create } from "zustand";

interface StoreState {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const useShowOverlay = create<StoreState>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));

export default useShowOverlay;
