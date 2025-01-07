import React from "react";
import Image from "next/image";
import MainPattern from "@/public/assets/images/auth.png";
import { cn } from "@/lib/utils";
import BgPattern from "@/public/assets/images/auth-bg-pattern.svg";
import { Toaster } from "@/components/ui/sonner";
type LayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Toaster richColors position={"top-right"} />

      <div className="flex h-screen min-h-[300px] w-full items-center bg-white p-5">
        {/* -- content */}
        <main className="relative flex h-max w-full items-center justify-center lg:w-1/2">
          <div className="absolute -top-11 left-9 z-0 hidden h-full w-full lg:block">
            <Image
              src={BgPattern}
              alt="auth-bg-pattern"
              className="scale-105"
            />
          </div>
          <div className="z-50">{children}</div>
        </main>

        {/* ####################################### */}
        {/* -- image section */}
        {/* ####################################### */}
        <aside className="relative hidden h-full w-1/2 rounded-3xl bg-gray-900 lg:flex">
          <Image
            src={MainPattern}
            alt="main-pattern"
            fill
            placeholder="blur"
            className="h-full w-full rounded-3xl object-cover object-center"
          />
          <div className="absolute bottom-0 left-0 w-full rounded-b-3xl border-t border-opacity-20 bg-white bg-opacity-20 p-6 backdrop-blur-md">
            <h3 className="mb-2 text-2xl font-semibold text-white">
              Earn by contributing to campaigns
            </h3>
            <p className="font-normal text-white">
              Earn money by participating in paid surveys and sharing your
              opinions.
            </p>
            <div className="mt-7 flex gap-1">
              {Array.from({ length: 3 }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "inline-block h-1 w-4 cursor-pointer rounded-full bg-white bg-opacity-50",
                    index === 0 && "w-8 bg-opacity-100",
                  )}
                ></span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default AuthLayout;
