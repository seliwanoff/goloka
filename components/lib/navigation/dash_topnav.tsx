"use client";

import React from "react";
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
} from "lucide-react";
// import { getCurrentUser } from "@/services/user_service";
import { useQuery } from "@tanstack/react-query";
import DashNotificationPopOver from "../popover/dash_notification";
import DashSideBarMobile from "./dash_sidebar_mobile";
import { useUserStore } from "@/stores/use-user-store";

type ComponentProps = {};

const data = {
  profile_img: "",
  first_name: "",
  last_name: "",
  account_type: "",
};

const DashTopNav: React.FC<ComponentProps> = ({}) => {
  const user = { data };
  const currentUser = useUserStore((state) => state.currentUser);
  const Name = currentUser?.data?.name;
  const FirstName = Name
    ? Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase()
    : "";
  return (
    <>
      <div className="absolute left-0 top-0 flex h-[72px] w-full items-center justify-between bg-white px-4 py-2 shadow-sm lg:px-8">
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
          <Popover>
            <PopoverTrigger className="w-10">
              <AspectRatio
                ratio={1 / 1}
                className="transit flex cursor-pointer items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                <Bell strokeWidth={1.5} size={22} />
                <span
                  className={classMerge(
                    "absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500",
                    sampleNotifications.length > 0 ? "block" : "hidden",
                  )}
                />
              </AspectRatio>
            </PopoverTrigger>
            <PopoverContent className="w-max">
              <DashNotificationPopOver notificationList={sampleNotifications} />
            </PopoverContent>
          </Popover>

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
                    href="/dashboard/logout"
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
  type: "RESOURCE" | "MESSAGE" | "INFO" | "PRODUCT";
  message: string;
  time: string;
}[] = [
  {
    type: "RESOURCE",
    message: "New file uploaded successfully",
    time: "Today at 9:20AM",
  },
  {
    type: "MESSAGE",
    message: "New message from admin",
    time: "Today at 9:20AM",
  },
  {
    type: "PRODUCT",
    message: "checkout our new update!!",
    time: "Today at 9:20AM",
  },
  {
    type: "RESOURCE",
    message: "New file uploaded successfully",
    time: "Today at 9:20AM",
  },
  {
    type: "RESOURCE",
    message: "New file uploaded successfully",
    time: "Today at 9:20AM",
  },
];
