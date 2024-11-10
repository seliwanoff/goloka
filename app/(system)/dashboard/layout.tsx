"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashSideBarDesktop from "@/components/lib/navigation/dash_sidebar_desktop";
import DashTopNav from "@/components/lib/navigation/dash_topnav";
import { StepperProvider } from "@/context/TaskStepperContext.tsx";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/user";
import { useUserStore } from "@/stores/currentUserStore";
import { getContributorsProfile } from "@/services/contributor";
import { useRemoteUserStore } from "@/stores/remoteUser";

type LayoutProps = {
  children: React.ReactNode;
};

const SystemLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { setUser, isAuthenticated } = useRemoteUserStore();
  const loginUser = useUserStore((state) => state.loginUser);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const setRefetchUser = useUserStore((state) => state.setRefetchUser);

  // Query for remote user data
  const {
    data: currentUser,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["Get current remote user"],
    queryFn: getCurrentUser,
    retry: 1, // Only retry once before considering it a failure
  });

  const { data: remoteContributor } = useQuery({
    queryKey: ["Get remote contributor profile"],
    queryFn: getContributorsProfile,
  });
  const contributorProfile = remoteContributor?.data;
  console.log(remoteContributor?.data, "remoteContributor");

  // Handle error and authentication
  useEffect(() => {
    if (error) {
      logoutUser();
      router.push("/signin");
      return;
    }

    if (currentUser && "data" in currentUser && currentUser.data) {
      loginUser(currentUser.data);
      if (
        remoteContributor &&
        "data" in remoteContributor &&
        remoteContributor.data
      ) {
        //@ts-ignore
        setUser(contributorProfile);
      }
    }
    setRefetchUser(refetch);
  }, [
    error,
    currentUser,
    loginUser,
    logoutUser,
    router,
    remoteContributor,
    setRefetchUser,
  ]);

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="col-span-6 flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <StepperProvider>
        <div className="grid h-screen min-h-[200px] w-full grid-cols-6 overflow-hidden bg-[#F8F8F8]">
          <>
            <DashSideBarDesktop />
            <main className="relative col-span-6 flex h-screen flex-col overflow-hidden pb-10 pt-[70px] xl:col-span-5 xl:bg-[#F8F8F8]">
              <DashTopNav />
              <div className="h-[calc(100% - 72px)] w-full overflow-x-hidden px-5 md:px-8 lg:px-10">
                {children}
              </div>
            </main>
          </>
        </div>
      </StepperProvider>
    </div>
  );
};

export default SystemLayout;
