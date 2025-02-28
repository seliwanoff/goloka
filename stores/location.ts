import { create } from "zustand";

interface OverlayState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useShowOverlay = create<OverlayState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
