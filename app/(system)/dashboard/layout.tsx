"use client";
import Logo from "@/public/assets/images/thumb.svg";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
// ~ ======= icon imports  -->
import {
  LucideIcon,
  FolderClosed,
  LayoutGrid,
  Files,
  WandSparkles,
  Settings,
  LogOut,
  OctagonAlert,
} from "lucide-react";
import {
  ArchiveMinus,
  DocumentCopy,
  Import,
  MessageQuestion,
  Note,
  People,
  Wallet3,
} from "iconsax-react";

// import NotificationLayout from "@/components/layouts/notification-layout";
import DashSideBarDesktop from "@/components/lib/navigation/dash_sidebar_desktop";
import DashTopNav from "@/components/lib/navigation/dash_topnav";
import { StepperProvider } from "@/context/TaskStepperContext.tsx";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/user";
import { useUserStore } from "@/stores/currentUserStore";
import { getContributorsProfile } from "@/services/contributor";
import { useRemoteUserStore } from "@/stores/remoteUser";
import Image from "next/image";

type LayoutProps = {
  children: React.ReactNode;
};

const SystemLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { setUser } = useRemoteUserStore();
  const loginUser = useUserStore((state) => state.loginUser);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const setRefetchUser = useUserStore((state) => state.setRefetchUser);

  // Query for remote user data
  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["Get current remote user"],
    queryFn: getCurrentUser,
    retry: 1, // Only retry once before considering it a failure
  });

  const {
    data: remoteContributor,
    isLoading: isContributorLoading,
    refetch: isRefetch,
  } = useQuery({
    queryKey: ["Get remote contributor profile"],
    queryFn: getContributorsProfile,
  });

  console.log(remoteContributor, "fbfbbf");

  // Handle error and authentication
  useEffect(() => {
    if (error) {
      console.log("An error occurred:", error);
      // Check for 401 Unauthorized or "Unauthenticated" message in response
      if (
        //@ts-ignore
        error.response?.status === 401 &&
        //@ts-ignore
        error.response?.data?.message === "Unauthenticated."
      ) {
        logoutUser(); // Log out user if token is expired
        router.push("/signin"); // Redirect to login page
        return;
      }

      // Handle other errors (e.g., network errors, etc.)
      console.error("An error occurred:", error);
    }

    // Ensure both currentUser and remoteContributor are processed
    if (
      currentUser &&
      "data" in currentUser &&
      currentUser.data &&
      remoteContributor &&
      "data" in remoteContributor &&
      remoteContributor.data
    ) {
      // Store current user in user store
      loginUser(currentUser.data);

      //@ts-ignore
      setUser(remoteContributor.data);
    }

    // Set up refetch function
    setRefetchUser(isRefetch);
  }, [
    currentUser,
    error,
    loginUser,
    logoutUser,
    refetch,
    remoteContributor,
    router,
    setRefetchUser,
    setUser,
    isRefetch,
  ]);

  // Show loading state while fetching user data
  if (isLoading || isContributorLoading) {
    return (
      <div className=" flex flex-col h-screen w-full items-center justify-center">
        <Image
          src={Logo}
          alt="goloka logo"
          width={100}
          height={160}
          className="animate-pulse"
        />
        <p className="text-main-100 font-bold text-lg animate-pulse font-serif">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <StepperProvider totalSteps={5}>
        {/* <NotificationLayout> */}
        <div className="grid h-screen min-h-[200px] w-full grid-cols-6 overflow-hidden bg-[#F8F8F8]">
          {
            /*remoteUser*/ true ? (
              <>
                <DashSideBarDesktop navMenuList={NavData} />
                {/* <main className="relative col-span-6 flex h-screen flex-col overflow-hidden pb-10 pt-[70px] xl:col-span-5 xl:bg-[#F8F8F8]">
                  <DashTopNav />
                  <div className="h-[calc(100% - 72px)] tablet:px-8 w-full overflow-auto px-5 pb-10 lg:px-10">
                    {children}
                  </div>
                </main> */}

                <main className="relative col-span-6 flex h-screen flex-col overflow-hidden pb-10 pt-[70px] xl:col-span-5 xl:bg-[#F8F8F8]">
                  <DashTopNav />
                  <div className="h-[calc(100% - 72px)] w-full overflow-x-hidden px-5 md:px-8 lg:px-10">
                    {children}
                  </div>
                </main>
              </>
            ) : (
              <div className="col-span-6 flex h-screen w-full items-center justify-center">
                <p>Loading...</p>
              </div>
            )
          }
        </div>
      </StepperProvider>
    </div>
  );
};

export default SystemLayout;

// ~ =============================================>
// ~ ======= Navigation data -->
// ~ =============================================>
// const NavData: { icon: any; title: string; link: string }[] = [
//   { icon: LayoutGrid, title: "Dashboard", link: "/dashboard/root" },
//   { icon: Note, title: "Tasks", link: "/dashboard/tasks" },
//   { icon: DocumentCopy, title: "Responses", link: "/dashboard/responses" },
//   { icon: Wallet3, title: "Wallet", link: "/dashboard/wallet" },
//   { icon: MessageQuestion, title: "Support", link: "/dashboard/support" },
//   { icon: Settings, title: "Settings", link: "/dashboard/settings" },
// ];


// ~ =============================================>
// ~ ======= Navigation data -->
// ~ =============================================>
const NavData: { icon: any; title: string; link: string }[] = [
  { icon: LayoutGrid, title: "Dashboard", link: "/dashboard/root" },
  { icon: Note, title: "Marketplace", link: "/dashboard/marketplace" },
  { icon: DocumentCopy, title: "Responses", link: "/dashboard/responses" },
  {
    icon: Import,
    title: "My contributions",
    link: "/dashboard/my_contributions",
  },
  {
    icon: ArchiveMinus,
    title: "Bookmarks",
    link: "/dashboard/bookmarks",
  },
  { icon: Wallet3, title: "Wallet", link: "/dashboard/wallet" },
  { icon: MessageQuestion, title: "Support", link: "/dashboard/support" },
  { icon: Settings, title: "Settings", link: "/dashboard/settings" },
];
