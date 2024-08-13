"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// import NotificationLayout from "@/components/layouts/notification-layout";
import DashSideBarDesktop from "@/components/lib/navigation/dash_sidebar_desktop";
import DashTopNav from "@/components/lib/navigation/dash_topnav";
import { useUserStore } from "@/stores/use-user-store";
// import DashSideBarDesktop from "@/components/lib/navigation/dash_sidebar_desktop";
// import { getCurrentUser } from "@/services/user_service";
// import { User, userStore } from "@/stores/user-store";
// import InfoDialog from "@/components/lib/modals/info_modal";
// import { useQuery } from "@tanstack/react-query";

type LayoutProps = {
  children: React.ReactNode;
};

const SystemLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  // const {
  //   data: remoteUser,
  //   isError,
  //   isLoading,
  //   error,
  // } = useQuery({
  //   queryKey: ["Layout", "Get current user"],
  //   queryFn: getCurrentUser,
  //   staleTime: 1.8e6,
  // });

  const [showModal, setShowModal] = React.useState(false);
  const setUser = useUserStore((state) => state.setUser);

  // useEffect(() => {
  //   if (isError || remoteUser === null || remoteUser?.status === "fail") {
  //     setUser(remoteUser as User);
  //     return setShowModal(true);
  //   }
  // }, [remoteUser, isError, isLoading, error]);

  // if (isLoading)
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center">
  //       <p>Loading...</p>
  //       <InfoDialog
  //         title="Session not found"
  //         content="Your session does not exist or has expired. Please Sign in again"
  //         open={showModal}
  //         action={() => router.replace("/signin")}
  //         setOpen={setShowModal}
  //       />
  //     </div>
  //   );

  // if (error || remoteUser?.status === "fail")
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center">
  //       <p>!Error :(</p>
  //       <InfoDialog
  //         title="Session not found"
  //         content="Your session does not exist or has expired. Please Sign in again"
  //         open={showModal}
  //         action={() => router.replace("/signin")}
  //         setOpen={setShowModal}
  //       />
  //     </div>
  //   );

  return (
    <div>
      {/* <NotificationLayout> */}
      <div className="grid h-screen min-h-[200px] w-full grid-cols-6 overflow-hidden lg:bg-[#F8F8F8]">
        {
          /*remoteUser*/ true ? (
            <>
              <DashSideBarDesktop />
              <main className="relative col-span-6 flex h-screen flex-col overflow-hidden pb-10 pt-[70px] xl:col-span-5 xl:bg-[#F8F8F8]">
                <DashTopNav />
                <div className="h-[calc(100% - 72px)] tablet:px-8 w-full overflow-auto px-5 pb-10 lg:px-10">
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
      {/* </NotificationLayout> */}
    </div>
  );
};

export default SystemLayout;
