"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// ~ ======= icon imports  -->
import {
  BellRing,
  ChevronRight,
  Clock,
  FolderClosed,
  Info,
  Mail,
  Rocket,
  Search,
  SquareX,
} from "lucide-react";
import { classMerge } from "@/lib/utils";
import EmptyState from "../empty_states/empty_state";
import Celebrate from "@/public/assets/images/svg/financial.png";
import Org from "@/public/assets/images/svg/organisational.png";
import { CloseSquare, Refresh } from "iconsax-react";

type NotificationComponentProps = {
  notificationList: {
    type: "TASK" | "FINANCIAL" | "ORGANISATIONAL" | "FEEDBACK";
    message: string;
    time: string;
  }[];
};

const DashNotificationPopOver: React.FC<NotificationComponentProps> = ({
  notificationList,
}) => {
  // ~ ======= Empty state -->
  if (notificationList.length === 0)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="h-72 w-64">
          <EmptyState
            data={{
              style: "default",
              icon: BellRing,
              title: "You have no notifications",
              content: "It's quiet in here. Get clicking and see some action!",
            }}
          />
        </div>
      </div>
    );

  return (
    <>
      {/* <div className="flex w-full items-center justify-between">
        <p>Notifications</p>
        <Button
          variant="link"
          className="ring-primary-100 font-semibold hover:bg-gradient-to-br hover:from-violet-50/20 hover:via-violet-100/80 hover:to-violet-50/20 hover:ring-1"
          size="sm"
        >
          Mark all as read
        </Button>
      </div> */}

      <div className="flex h-max w-full flex-col py-5">
        {notificationList.map((notification) => (
          <div
            className="transit group flex cursor-pointer items-center justify-between gap-3 border-b px-2 py-3 hover:bg-gradient-to-br hover:from-gray-50/20 hover:via-gray-100/80 hover:to-gray-50/20"
            key={notification.message}
          >
            {/* -- icon */}
            <div className="flex items-center gap-3">
              <div className="w-11">
                <AspectRatio
                  ratio={1 / 1}
                  className={classMerge(
                    "flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-transparent",
                    notification.type === "TASK" && "text-[#828282]",
                    // notification.type === "MESSAGE" && "text-green-600",
                    // notification.type === "FI" && "text-indigo-600",
                    notification.type === "FEEDBACK" && "text-red-600",
                  )}
                >
                  {
                    {
                      TASK: <Refresh strokeWidth={2} size={20} />,
                      FINANCIAL: <Image src={Celebrate} alt="celebrate icon" />,
                      ORGANISATIONAL: <Image src={Org} alt="profile icon" />,
                      FEEDBACK: <SquareX strokeWidth={2} size={20} />,
                    }[notification.type]
                  }
                </AspectRatio>
              </div>

              {/* -- content */}
              <div className="flex w-56 flex-col justify-center">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {notification.message}
                </p>
                <span className="flex items-center gap-2 text-gray-500">
                  <Clock size={12} strokeWidth={1.5} />
                  <p className="text-xs">{notification.time}</p>
                </span>
              </div>
            </div>
            {/* -- arrow */}
            <ChevronRight
              strokeWidth={1.5}
              className="text-gray-700"
              size={20}
            />
          </div>
        ))}
      </div>

      {/* -- call to action */}
      {/* <Button variant="default" className="w-full">
        View all
      </Button> */}
    </>
  );
};
export default DashNotificationPopOver;
