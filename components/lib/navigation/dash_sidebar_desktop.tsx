"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { classMerge, cn } from "@/lib/utils";
import Logo from "@/public/assets/images/thumb.svg";
import Goloka from "@/public/assets/images/goloka-full-logo.svg";
import { usePathname, useRouter } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  DocumentCopy,
  MessageQuestion,
  Note,
  People,
  Wallet3,
  Import,
  ArchiveMinus,
} from "iconsax-react";

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
import { userLogout } from "@/services/auth";

type ComponentProps = {
  navMenuList: { icon: any; title: string; link: string }[];
};

const DashSideBarDesktop: React.FC<ComponentProps> = ({ navMenuList }) => {
  const pathname = usePathname();
  const router = useRouter();

  
  // userLogout;

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
    <aside className="col-span-1 hidden h-full w-full flex-col bg-white px-4 py-3 shadow-md xl:flex">
      {/* -- logo section */}
      <div className="flex w-36">
        <AspectRatio ratio={24 / 9}>
          <Image src={Goloka} alt="logo" fill />
        </AspectRatio>
      </div>

      {/* -- nav items  */}
      <nav className="mt-10 flex flex-col gap-3">
        {navMenuList.map((nav_item) => (
          <Link
            href={nav_item.link}
            key={nav_item.title}
            className={cn(
              "transit flex w-full flex-row items-center justify-start gap-3 rounded-full px-4 py-2",
              pathname.includes(nav_item.link)
                ? "bg-main-100 text-white"
                : "bg-white font-medium text-gray-500 ring-gray-100 hover:bg-gradient-to-br hover:from-gray-50/20 hover:via-gray-100/80 hover:to-gray-50/20 hover:text-gray-800 hover:ring-1",
            )}
          >
            <nav_item.icon size={20} color="currentColor" strokeWidth={1.5} />
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
        <Separator className="my-3" />
        <Dialog>
          <DialogTrigger
            className={classMerge(
              "transit text-alert-error flex w-full flex-row items-center justify-start gap-3 rounded-full px-4 py-2 font-bold text-[#D92D20] ring-rose-100 hover:bg-gradient-to-br hover:from-rose-50/20 hover:via-rose-50 hover:to-rose-50/20 hover:ring-1",
            )}
          >
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
              By clicking on <b>continue</b>, you will be logged out of your
              dashboard. Do you want to proceed?
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

        {/* CTA */}
        <div className="mt-6 rounded-lg bg-[#F8F8F8] p-4">
          <div className="mx-auto -mt-9 mb-5 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-main-100">
            <People size="24" color="#FFF" />
          </div>
          <h3 className="text-center text-sm font-medium text-main-100">
            Become an organization
          </h3>
          <p className="mt-4 text-center text-xs leading-5 text-[#4F4F4F]">
            Generate organic data for your organisation on Golaka
          </p>

          <Button className="mt-8 w-full rounded-full bg-main-100 text-white hover:bg-blue-700">
            Create account
          </Button>
        </div>
      </nav>
    </aside>
  );
};

export default DashSideBarDesktop;

