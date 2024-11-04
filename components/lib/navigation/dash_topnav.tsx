"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { classMerge } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image, { StaticImageData } from "next/image";
import UserProfileImg from "@/public/assets/images/user-pforile-img.jpg";
// import DashNotificationPopOver from "../popovers/dash_notification";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ~ ======= icon imports -->
import {
  Mail,
  Bell,
  ChevronDown,
  Search,
  UserRound,
  Settings,
  LogOut,
  LucideIcon,
  LucideX,
} from "lucide-react";
// import { getCurrentUser } from "@/services/user_service";
import { useQuery } from "@tanstack/react-query";
import DashNotificationPopOver from "../popover/dash_notification";
import DashSideBarMobile from "./dash_sidebar_mobile";
import { useUserStore } from "@/stores/use-user-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeft } from "iconsax-react";
import { useMediaQuery } from "@react-hook/media-query";
import { Close } from "@radix-ui/react-dialog";
import { Toaster } from "sonner";
import { userLogout } from "@/services/auth";
import { useRouter } from "next/navigation";

type ComponentProps = {};

const data = {
  profile_img: "",
  first_name: "",
  last_name: "",
  account_type: "",
};

const DashTopNav: React.FC<ComponentProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = { data };
  const currentUser = useUserStore((state) => state.currentUser);
  const Name = currentUser?.data?.name;
  const FirstName = Name
    ? Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase()
    : "";
  const isMobile = useMediaQuery("(max-width: 640px)");

  const initiateLogout = () => {
    try {
      const res = userLogout();
      console.log(res, "res");
      localStorage.removeItem("whoami");
      router.replace("/signin");
    } catch (error) {
      console.log(error, "error");
    }
  };

  return (
    <>
      <Toaster richColors position={"top-right"} />
      <div className="absolute left-0 top-0 z-[50] flex h-[72px] w-full items-center justify-between bg-white px-4 py-2 shadow-sm sm:z-0 lg:px-8">
        <div className="flex gap-4">
          {/* -- Mobile nav */}
          <DashSideBarMobile />

          {/* -- search section */}
          <div className="relative flex w-[200px] items-center justify-center md:w-[300px]">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <Input
              placeholder="Search tasks, location, response"
              type="text"
              className="rounded-full bg-gray-50 pl-10"
            />
          </div>
        </div>

        {/* -- activity section */}
        <div className="flex items-center justify-center gap-4">
          {/* notification icon */}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <div className="transit relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                <Bell size={22} />
                <span
                  className={classMerge(
                    "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500",
                    sampleNotifications.length > 0 ? "block" : "hidden",
                  )}
                />
              </div>
            </SheetTrigger>
            <SheetContent className="w-full border-0 px-4 sm:w-3/4">
              <SheetHeader className="absolute left-0 top-0 z-10 w-full flex-row items-center justify-between space-y-0 bg-main-100 px-4 py-4">
                <SheetTitle
                  onClick={() => (isMobile ? setOpen(false) : null)}
                  className="inline-flex cursor-pointer items-center gap-3.5 text-lg font-normal text-white sm:cursor-auto md:text-xl"
                >
                  <span className="sm:hidden">
                    <ArrowLeft size={20} />
                  </span>{" "}
                  Notification
                </SheetTitle>
                <SheetDescription className="sr-only">
                  You will be notified here about all your activities on the app
                </SheetDescription>

                <span
                  onClick={() => setOpen(false)}
                  className="hidden cursor-pointer text-white sm:inline-block"
                >
                  <LucideX size={20} />
                </span>
              </SheetHeader>

              {/* SHEET CONTENT */}
              <div className="no-scrollbar h-full overflow-y-auto pb-11 pt-10">
                <DashNotificationPopOver
                  notificationList={sampleNotifications}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* user profile bubble */}
          {user && user.data && (
            <Popover>
              <PopoverTrigger className="transit shadow-1 cursor-pointer items-center justify-center gap-3 rounded-full hover:bg-gray-100 lg:flex lg:bg-[#F7F7F8] lg:px-5 lg:py-1.5">
                <div className="w-9">
                  <AspectRatio ratio={1}>
                    <Image
                      src={user.data.profile_img || UserProfileImg}
                      alt="user-profile-img"
                      className="rounded-full"
                      fill
                    />
                  </AspectRatio>
                </div>

                <div className="hidden flex-col items-start justify-center lg:flex">
                  <p className="text-base font-semibold">{FirstName}</p>
                  {
                    // @ts-ignore
                    {
                      INDIVIDUAL: (
                        <p className="-mt-1 text-sm font-light">
                          Individual Account
                        </p>
                      ),
                      ORGANISATION: (
                        <p className="-mt-1 text-sm font-light">
                          Organisation Account
                        </p>
                      ),
                    }[user.data.account_type || "INDIVIDUAL"]
                  }
                </div>

                <ChevronDown strokeWidth={1.5} className="hidden lg:flex" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex w-full items-center gap-5">
                  <div className="w-12">
                    <AspectRatio ratio={1 / 1}>
                      <Image
                        src={user.data.profile_img || UserProfileImg}
                        alt="user-profile-img"
                        fill
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base font-semibold">
                      {user.data.first_name || "Muhammad"}{" "}
                      {user.data.last_name || "jamiu"}
                    </p>
                    {
                      // @ts-ignore
                      {
                        INDIVIDUAL: (
                          <p className="-mt-1 text-sm font-light">
                            Individual Account
                          </p>
                        ),
                        ORGANISATION: (
                          <p className="-mt-1 text-sm font-light">
                            Organisation Account
                          </p>
                        ),
                      }[user.data.account_type || "INDIVIDUAL"]
                    }
                  </div>
                </div>
                <Separator className="my-4" />

                {/* links */}
                <div className="mt-6 flex flex-col gap-5 px-2 font-semibold">
                  {UserBubbleLinks.map((bubbleData) => (
                    <Link
                      key={bubbleData.title}
                      href={bubbleData.href}
                      className="transit flex items-center gap-3 text-gray-500 hover:text-gray-800"
                    >
                      <bubbleData.icon size={20} strokeWidth={1.5} />
                      <p>{bubbleData.title}</p>
                    </Link>
                  ))}

                  <Link
                    href={"#"}
                    onClick={initiateLogout}
                    className="transit flex items-center gap-3 text-rose-400 hover:text-rose-500"
                  >
                    <LogOut size={20} strokeWidth={1.5} />
                    <p>Logout</p>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </>
  );
};

export default DashTopNav;

// ~ =============================================>
// ~ ======= Dummy Data -->
// ~ =============================================>
// toggle these to remove notification badges
const messages: boolean = true;

const UserBubbleLinks: { icon: LucideIcon; title: string; href: string }[] = [
  {
    icon: UserRound,
    title: "View Profile",
    href: "/dashboard/profile",
  },
  {
    icon: Settings,
    title: "Settings",
    href: "/dashboard/settings",
  },
];

// todo: fetch and request for only the latest 5
const sampleNotifications: {
  type: "TASK" | "ORGANISATIONAL" | "FINANCIAL" | "FEEDBACK";
  message: string;
  time: string;
}[] = [
  {
    type: "ORGANISATIONAL",
    message: "Mohh_Jumah Organisation accepted your response",
    time: "Today at 9:20 AM",
  },
  {
    type: "TASK",
    message: "42 tasks related to you!",
    time: "Today at 9:20 AM",
  },
  {
    type: "ORGANISATIONAL",
    message: "New message from Jamiu’s organization",
    time: "Today at 9:20 AM",
  },
  {
    type: "FEEDBACK",
    message:
      "Your response was rejected: Effects of agriculture to Nigeria economy",
    time: "Today at 9:20 AM",
  },
  {
    type: "ORGANISATIONAL",
    message: "Muhammad Just messaged you",
    time: "Today at 9:20 AM",
  },
  {
    type: "FINANCIAL",
    message: "You have been credited $5",
    time: "Today at 9:20 AM",
  },
  {
    type: "ORGANISATIONAL",
    message: "Mohh_Jumah Organisation accepted your response",
    time: "Today at 9:20 AM",
  },
  {
    type: "TASK",
    message: "42 tasks related to you!",
    time: "Today at 9:20 AM",
  },
  {
    type: "ORGANISATIONAL",
    message: "New message from Jamiu’s organization",
    time: "Today at 9:20 AM",
  },
  {
    type: "FEEDBACK",
    message:
      "Your response was rejected: Effects of agriculture to Nigeria economy",
    time: "Today at 9:20 AM",
  },
  {
    type: "ORGANISATIONAL",
    message: "Muhammad Just messaged you",
    time: "Today at 9:20 AM",
  },
  {
    type: "FINANCIAL",
    message: "You have been credited $5",
    time: "Today at 9:20 AM",
  },
];
