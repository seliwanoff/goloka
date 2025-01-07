import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import dayjs from "dayjs"; // Using dayjs for date formatting
import { createUser } from "@/services/user"; // Ensure this service is correctly imported
import { useLoadingStore } from "./misc";
import { createContributor } from "@/services/contributor";
import { toast } from "sonner";
import { IRemoteUser } from "@/types";

interface UserInfo {
  birth_date: string;
  gender: string;
  religion: string;
  ethnicity: string;
  primary_language: string;
  spoken_languages: string[];
}

interface UserState {
  userInfo: UserInfo;
  setStep1Info: (
    step1Info: Partial<Pick<UserInfo, "birth_date" | "gender">>,
  ) => void;
  setStep2Info: (
    step2Info: Partial<
      Pick<
        UserInfo,
        "religion" | "ethnicity" | "primary_language" | "spoken_languages"
      >
    >,
  ) => void;
  clearUserInfo: () => void;
  submitUserInfo: () => Promise<void>;
}

export const useContributorStore = create<UserState>()(
  persist(
    (set, get) => ({
      userInfo: {
        birth_date: "",
        gender: "",
        religion: "",
        ethnicity: "",
        primary_language: "",
        spoken_languages: [],
      },
      setStep1Info: (step1Info) =>
        set((state) => {
          const formattedStep1Info = { ...step1Info };
          if (step1Info.birth_date) {
            formattedStep1Info.birth_date = dayjs(step1Info.birth_date).format(
              "YYYY-MM-DD",
            );
          }
          return { userInfo: { ...state.userInfo, ...formattedStep1Info } };
        }),
      setStep2Info: (step2Info) =>
        set((state) => ({ userInfo: { ...state.userInfo, ...step2Info } })),
      clearUserInfo: () =>
        set({
          userInfo: {
            birth_date: "",
            gender: "",
            religion: "",
            ethnicity: "",
            primary_language: "",
            spoken_languages: [],
          },
        }),
      submitUserInfo: async () => {
        const { userInfo } = get();
        const { setLoading } = useLoadingStore.getState();
        setLoading(true);
        try {
          const response = await createContributor(userInfo);
          //@ts-ignore
          toast(response?.message);
        } catch (error) {
          alert("Failed to submit user info:");
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: "user-info-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

interface RemoteUserState {
  user: IRemoteUser | null;
  setUser: (user: IRemoteUser) => void;
  clearUser: () => void;
  // isAuthenticated: boolean;
}

export const useRemoteUserStore = create<RemoteUserState>((set) => ({
  user: null,
  // isAuthenticated: !!user,
  setUser: (user: IRemoteUser) => set({ user }),
  clearUser: () => set({ user: null }),
}));
