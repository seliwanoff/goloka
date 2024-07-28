import React from "react";
import Image from "next/image";
import MainPattern from "@/public/assets/images/auth.png";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="pb-12">{children}</div>
        <div className="hidden bg-white p-4 lg:block">
          <div className="relative mx-auto min-h-[800px] w-full overflow-hidden rounded-2xl">
            <Image
              src={MainPattern}
              alt="main-pattern"
              fill
              placeholder="blur"
              className="h-full w-full object-cover object-center"
            />

            <div className="absolute bottom-0 left-0 z-[2] w-full border-t border-opacity-20 bg-white bg-opacity-20 p-6 backdrop-blur-md">
              <h3 className="mb-2 text-2xl font-semibold text-white">
                Lorem ipsum dolor sit amet consectetur.
              </h3>
              <p className="font-normal text-white">
                Lorem ipsum dolor sit amet consectetur. Feugiat ullamcorper
                facilisis nisl quisque ante id. Neque vulputate .
              </p>

              {/* DOTS */}
              <div className="mt-7 flex gap-1">
                {Array.from({ length: 3 }, (_: any, index: number) => (
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
