"use client";

import React, { useMemo, useState } from "react";
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
  OctagonAlert,
} from "lucide-react";
// import { getCurrentUser } from "@/services/user_service";
import { useQuery } from "@tanstack/react-query";
import DashNotificationPopOver from "../popover/dash_notification";
import DashSideBarMobile from "./dash_sidebar_mobile";

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
import { useUserStore } from "@/stores/currentUserStore";
import { formatNotifications, generateColor, getInitials } from "@/helper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getNotifications } from "@/services/response";

type ComponentProps = {};

const data = {
  profile_img: "",
  first_name: "",
  last_name: "",
  account_type: "",
};

const DashTopNav: React.FC<ComponentProps> = ({}) => {
  const [open, setOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const router = useRouter();
  const params = { per_page: 10, page: 1 };

  const {
    data: notification,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["Get notification list"],
    queryFn: () => getNotifications(params),
  });
  const user = { data };
  const currentUser = useUserStore((state) => state.user);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const Name = currentUser?.name;
  const FirstName = Name
    ? Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase()
    : "";
  const isMobile = useMediaQuery("(max-width: 640px)");
  // const backgroundColor = useMemo(() => generateColor(FirstName), [FirstName]);
  const backgroundColor = useMemo(
    () => generateColor(FirstName.trim().toLowerCase()),
    [FirstName],
  );
  const initials = useMemo(() => getInitials(FirstName), [FirstName]);
  const initiateLogout = () => {
    try {
      const res = userLogout();
      console.log(res, "res");
      localStorage.removeItem("whoami");
      router.replace("/signin");
      logoutUser();
    } catch (error) {
      console.log(error, "error");
    }
  };


  const notificationData = formatNotifications(notification);

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
                    notificationData?.length > 0 ? "block" : "hidden",
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
                <DashNotificationPopOver notificationList={notificationData} />
              </div>
            </SheetContent>
          </Sheet>

          {/* user profile bubble */}
          {user && user.data && (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger className="transit shadow-1 cursor-pointer items-center justify-center gap-3 rounded-full hover:bg-gray-100 lg:flex lg:bg-[#F7F7F8] lg:px-5 lg:py-1.5">
                {/* <div className="w-9">
                  <AspectRatio ratio={1}>
                    <Image
                      src={user.data.profile_img || UserProfileImg}
                      alt="user-profile-img"
                      className="rounded-full"
                      fill
                    />
                  </AspectRatio>
                </div> */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white`}
                  style={{ backgroundColor }}
                >
                  {initials}
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
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white`}
                    style={{ backgroundColor }}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-base font-semibold">
                      <p className="text-base font-semibold">{FirstName}</p>
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
                      onClick={() => setIsPopoverOpen(false)}
                      key={bubbleData.title}
                      href={bubbleData.href}
                      className="transit flex items-center gap-3 text-gray-500 hover:text-gray-800"
                    >
                      <bubbleData.icon size={20} strokeWidth={1.5} />
                      <p>{bubbleData.title}</p>
                    </Link>
                  ))}

                  {/* <Link
                    href={"#"}
                    onClick={initiateLogout}
                    className="transit flex items-center gap-3 text-rose-400 hover:text-rose-500"
                  >
                    <LogOut size={20} strokeWidth={1.5} />
                    <p>Logout</p>
                  </Link> */}

                  <Dialog>
                    <DialogTrigger className="transit flex items-center gap-3 text-rose-400 hover:text-rose-500">
                      <LogOut size={20} strokeWidth={1.5} />
                      <p className="text-[#D92D20]">Logout</p>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center gap-10 py-8 text-center">
                      <div className="rounded-full bg-rose-50 p-2 text-rose-600">
                        <OctagonAlert />
                      </div>
                      <DialogTitle className="-mt-8 text-xl font-bold">
                        Proceed to logout?
                      </DialogTitle>
                      <p>
                        By clicking on <b>continue</b>, you will be logged out
                        of your dashboard. Do you want to proceed?
                      </p>
                      <div className="flex w-full items-center justify-between gap-6">
                        <Button variant="outline" className="w-full">
                          Cancel
                        </Button>
                        <Button
                          className="w-full bg-rose-500 hover:bg-rose-400"
                          onClick={initiateLogout}
                        >
                          Continue
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
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
    href: "/dashboard/settings",
  },
  {
    icon: Settings,
    title: "Settings",
    href: "/dashboard/settings",
  },
];


