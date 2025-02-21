"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  MapPin,
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
import { getCurrentOrganization, userLogout } from "@/services/auth";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/stores/currentUserStore";
import { formatNotifications, generateColor, getInitials } from "@/helper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getNotifications } from "@/services/response";
import { getUseServices } from "@/services/organization";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";
import {
  useCreateContributorOverlay,
  useCreateOrganizationOverlay,
} from "@/stores/overlay";
import CreateOrganization from "../modals/create_orgnaization_modal";
import { getCurrentUser } from "@/services/user";
import { useAblyToken } from "@/stores/ably/useAblyToken";
import { useShowOverlay } from "@/stores/location";
import Tooltip from "../tootip";
import CreateContributor from "../modals/create_contributor_modal";

type ComponentProps = {};

const data = {
  profile_img: "",
  first_name: "",
  last_name: "",
  account_type: "",
  name: "",
};

const DashTopNav: React.FC<ComponentProps> = ({}) => {
  const { ablyClient, token, channelName, connectionError } = useAblyToken();
  const [open, setOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const router = useRouter();
  const params = { per_page: 10, page: 1 };
  const { setOpenOrganization } = useCreateOrganizationOverlay();

  const { setOpenContributor } = useCreateContributorOverlay();

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

  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1];
  const user = { data };
  const currentUser = useUserStore((state) => state.user);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { setOpen: setOpenc } = useShowOverlay();

  const handleLocationClick = () => {
    setOpenc(true);
  };
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );
  const logoutUser = useUserStore((state) => state.logoutUser);
  const Name =
    firstSegment === "organization"
      ? currentOrganization?.name
      : currentUser?.name;
  const FirstName = Name
    ? Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase()
    : "";
  const isMobile = useMediaQuery("(max-width: 640px)");
  // const backgroundColor = useMemo(() => generateColor(FirstName), [FirstName]);
  const backgroundColor = useMemo(
    () => generateColor(FirstName.trim().toLowerCase()),
    [FirstName],
  );

  // const { token } = useAblyToken();
  const [lastMessage, setLastMessage] = useState<any>(null);

  const UserBubbleLinks: { icon: LucideIcon; title: string; href: string }[] = [
    {
      icon: UserRound,
      title: "View Profile",
      href:
        firstSegment === "organisation"
          ? "/organization/dashboard/settings"
          : "/dashboard/settings",
    },
    {
      icon: Settings,
      title: "Settings",
      href:
        firstSegment === "organisation"
          ? "/organization/dashboard/settings"
          : "/dashboard/settings",
    },
  ];

  useEffect(() => {
    if (ablyClient && channelName) {
      const channel = ablyClient.channels.get(channelName);
      //@ts-ignore
      const onMessage = (message: Ably.Types.Message) => {
        //console.log("New notification received:", message.data);
        refetch();
      };

      channel.subscribe("new-notification", onMessage);

      return () => {
        channel.unsubscribe("new-notification", onMessage);
        channel.detach();
      };
    }
  }, [ablyClient, channelName, refetch]);

  const initiateLogout = () => {
    try {
      const res = userLogout();
      localStorage.removeItem("whoami");
      localStorage.removeItem("organization_domain");
      localStorage.removeItem("organization_currency");
      getCurrentOrganization(null);
      localStorage.clear();
      router.replace("/signin");

      logoutUser();
    } catch (error) {
      console.log(error, "error");
    }
  };

  const notificationData = formatNotifications(notification);

  const getRegisteredUsersService = async () => {
    const response = await getUseServices();
    const currentUsers = await getCurrentUser();
    //@ts-ignore
    const contributor = response.services.contributor
      ? {
          //@ts-ignore
          ...response.services.contributor,
          account_type: "contributor",
          name: currentUsers && currentUsers.data.name,
          image: currentUsers && currentUsers.data.profile.profile_photo_path,
        }
      : null;
    //@ts-ignore
    const organizations = response.services.organizations?.map((org: any) => ({
      ...org,
      account_type: "organization",
      image: org?.profile_photo_url,
    }));

    const mergedData = contributor
      ? [contributor, ...(organizations || [])]
      : organizations;

    setOrganizations(mergedData);
  };

  useEffect(() => {
    getRegisteredUsersService();
  }, []);
  const handleCurrentOrgnization = (org: any) => {
    if (org.account_type === "contributor") {
      getCurrentUser();
      getCurrentOrganization({ ...org, id: null });
      window.location.href = "/dashboard/root";
    } else {
      getCurrentOrganization(org);
      window.location.href = "/organization/dashboard/root";
    }
  };

  //console.log(currentOrganization);
  const filteredOrganizations = organizations.filter(
    (org: any) =>
      org?.id !== currentOrganization?.id && org?.id !== currentUser?.id,
  );

  //console.log(filteredOrganizations);

  const profileImage = useMemo(() => {
    if (
      currentOrganization &&
      firstSegment === "organization" &&
      currentOrganization.image
    ) {
      return currentOrganization.image;
    }
    if (currentUser) {
      //@ts-ignore
      return currentUser?.profile.profile_photo_path;
    }
    return null;
  }, [currentOrganization, currentUser]);

  const initials = useMemo(
    () =>
      getInitials(
        currentOrganization && firstSegment === "organization"
          ? currentOrganization.name
          : currentUser?.name || "",
      ),
    [currentOrganization, currentUser],
  );
  if (connectionError) {
    console.error("Ably connection error:", connectionError);
  }

  return (
    <>
      {/*** Organization creation */}
      <CreateOrganization />

      {/*** Contributor Creation */}

      <CreateContributor />
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
          <Tooltip message="Update Location">
            <button
              onClick={handleLocationClick}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 hover:text-blue-700"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </Tooltip>
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
                <DashNotificationPopOver
                  notificationList={notificationData}
                  ablyClient={ablyClient}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* user profile bubble */}
          {user && user.data && (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger className="transit shadow-1 cursor-pointer items-center justify-center gap-3 rounded-full hover:bg-gray-100 lg:flex lg:bg-[#F7F7F8] lg:px-5 lg:py-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white`}
                  style={{ backgroundColor }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full rounded-full"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="hidden flex-col items-start justify-center lg:flex">
                  <p className="text-base font-semibold">{FirstName}</p>
                  {
                    // @ts-ignore
                    {
                      INDIVIDUAL: (
                        <p className="-mt-1 text-sm font-light">
                          Contributor Account
                        </p>
                      ),
                      ORGANISATION: (
                        <p className="-mt-1 text-sm font-light">
                          Organisation Account
                        </p>
                      ),
                    }[
                      firstSegment === "organization"
                        ? "ORGANISATION"
                        : "INDIVIDUAL"
                    ]
                  }
                </div>

                <ChevronDown strokeWidth={1.5} className="hidden lg:flex" />
              </PopoverTrigger>
              <PopoverContent>
                <div
                  className="flex max-h-[200px] w-full flex-col items-start gap-5 overflow-x-hidden"
                  style={{
                    scrollbarWidth: "thin",
                  }}
                >
                  {
                    filteredOrganizations?.length > 0
                      ? filteredOrganizations?.map((org: any, index) => (
                          <div
                            className="flex cursor-pointer items-center gap-5"
                            onClick={() => handleCurrentOrgnization(org)}
                            key={index}
                          >
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white`}
                              style={{ backgroundColor }}
                            >
                              {org.image ? (
                                <img
                                  src={org.image}
                                  alt="profile"
                                  className="object-cover33 h-full w-full rounded-full"
                                />
                              ) : (
                                getInitials(org.name)
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="text-base font-semibold">
                                <p className="max-w-[200px] overflow-hidden text-ellipsis text-nowrap text-base font-semibold">
                                  {org.name}
                                </p>

                                <p className="mt-1 max-w-[200px] overflow-hidden text-ellipsis text-nowrap text-xs font-medium text-gray-600">
                                  {org.account_type === "contributor"
                                    ? "Contributor Account"
                                    : "Organisation Acount"}
                                </p>
                              </p>

                              {/**
                        {
                          // @ts-ignore
                          {
                            INDIVIDUAL: (
                              <p className="-mt-1 text-sm font-light">
                                Individual Accounts
                              </p>
                            ),
                            ORGANISATION: (
                              <p className="-mt-1 text-sm font-light">
                                Organisation Account
                              </p>
                            ),
                          }[user.data.account_type || "INDIVIDUAL"]
                        }
                          */}
                            </div>
                          </div>
                        ))
                      : "" /**(
                     {/***
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white`}
                        style={{ backgroundColor }}
                      >
                        {getInitials(user.data.name)}
                      </div>


                      <div className="hidden flex-col items-start justify-center lg:flex">
                        <p className="text-base font-semibold">{FirstName}</p>
                        {
                          // @ts-ignore
                          {
                            INDIVIDUAL: (
                              <p className="-mt-1 text-sm font-light">
                                Contributor Account
                              </p>
                            ),
                            ORGANISATION: (
                              <p className="-mt-1 text-sm font-light">
                                Organisation Accountp
                              </p>
                            ),
                          }[
                            firstSegment === "organization"
                              ? "ORGANISATION"
                              : "INDIVIDUAL"
                          ]
                        }
                      </div>

                    </div>

                  ) **/
                  }
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
