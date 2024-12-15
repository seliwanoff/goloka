import Image from "next/image";
import React, { FC } from "react";
import Logo from "@/public/assets/images/thumb.svg";
type ComponentProps = {};

const LoadingComponent: FC<ComponentProps> = ({}) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Image
        src={Logo}
        alt="goloka logo"
        width={100}
        height={160}
        className="animate-pulse"
      />
      <p className="animate-pulse font-serif text-lg font-bold text-main-100">
        Loading...
      </p>
    </div>
  );
};

export default LoadingComponent;
