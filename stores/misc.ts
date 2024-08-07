import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LoadingState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>()(
  persist(
    (set) => ({
      loading: false,
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "loading-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
