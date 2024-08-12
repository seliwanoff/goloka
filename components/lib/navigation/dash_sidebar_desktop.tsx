"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { classMerge, cn } from "@/lib/utils";
import Logo from "@/public/assets/images/thumb.svg";
import Goloka from "@/public/assets/images/goloka-full-logo.svg";
import { usePathname, useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DocumentCopy, MessageQuestion, Note, Wallet3 } from "iconsax-react";

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
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

type ComponentProps = {};

const DashSideBarDesktop: React.FC<ComponentProps> = ({}) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="col-span-1 hidden h-full w-full flex-col bg-white px-4 py-3 shadow-md xl:flex">
      {/* -- logo section */}
      <div className="flex w-36">
        <AspectRatio ratio={24 / 9}>
          <Image src={Goloka} alt="logo" fill />
        </AspectRatio>
      </div>

      {/* -- nav items  */}
      <nav className="mt-10 flex flex-col gap-3">
        {NavData.map((nav_item) => (
          <Link
            href={nav_item.link}
            key={nav_item.title}
            className={cn(
              "transit flex w-full flex-row items-center justify-start gap-3 rounded-full px-4 py-2",
              pathname.includes(nav_item.link)
                ? "bg-main-100 text-white"
                : "bg-white font-semibold text-gray-500 ring-gray-100 hover:bg-gradient-to-br hover:from-gray-50/20 hover:via-gray-100/80 hover:to-gray-50/20 hover:text-gray-800 hover:ring-1",
            )}
          >
            <nav_item.icon size={20} strokeWidth={1.5} />
            <p
              className={cn(
                "",
                pathname.includes(nav_item.link) && "text-white",
              )}
            >
              {nav_item.title}
            </p>
          </Link>
        ))}
        <Separator />
        <Dialog>
          <DialogTrigger
            className={classMerge(
              "transit text-alert-error mt-3 flex w-full flex-row items-center justify-start gap-3 rounded-full px-4 py-2 font-bold ring-rose-100 hover:bg-gradient-to-br hover:from-rose-50/20 hover:via-rose-50 hover:to-rose-50/20 hover:ring-1",
            )}
          >
            <LogOut size={20} strokeWidth={1.5} />
            <p>Logout</p>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center gap-10 py-8 text-center">
            <div className="rounded-full bg-rose-50 p-2 text-rose-600">
              <OctagonAlert />
            </div>
            <p className="-mt-8 text-xl font-bold">Proceed to logout?</p>
            <p>
              By clicking on <b>continue</b>, you will be logged out of your
              dashboard. Do you want to proceed?
            </p>
            <div className="flex w-full items-center justify-between gap-6">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
              <Button
                className="w-full bg-rose-500 hover:bg-rose-400"
                onClick={() => {
                  localStorage.removeItem("whoami");
                  router.replace("/");
                }}
              >
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </aside>
  );
};

export default DashSideBarDesktop;

// ~ =============================================>
// ~ ======= Navigation data -->
// ~ =============================================>
const NavData: { icon: any; title: string; link: string }[] = [
  { icon: LayoutGrid, title: "Dashboard", link: "/dashboard/root" },
  { icon: Note, title: "Tasks", link: "/dashboard/tasks" },
  { icon: DocumentCopy, title: "Responses", link: "/dashboard/responses" },
  { icon: Wallet3, title: "Wallet", link: "/dashboard/wallet" },
  { icon: MessageQuestion, title: "Support", link: "/dashboard/support" },
  { icon: Settings, title: "Settings", link: "/dashboard/settings" },
];
