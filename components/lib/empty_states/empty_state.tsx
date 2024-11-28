"use client";

import React from "react";
import Image from "next/image";
import { LucideIcon, Plus } from "lucide-react";
import BgPattern1 from "@/public/assets/images/svg/empty-state-bg-pattern-1.svg";
import BgPattern2 from "@/public/assets/images/svg/empty-state-bg-pattern-2.svg";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

type ComponentProps = {
  data: {
    style: "default" | "checkered" | "centered";
    icon: LucideIcon;
    title: string;
    content: string;
    btn_text?: string;
    sub_btn_text?: string;
    action?: () => void;
    sub_action?: () => void;
  };
};

const EmptyState: React.FC<ComponentProps> = ({ data }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {
        {
          default: <DefaultStyle data={data} />,
          checkered: <div>checkered style</div>,
          centered: <div>Centered style</div>,
        }[data.style]
      }
    </div>
  );
};

export default EmptyState;

// ~ =============================================>
// ~ ======= DEFAULT -->
// ~ =============================================>
interface DefaultStyleProps extends Pick<ComponentProps, "data"> {}

const DefaultStyle: React.FC<DefaultStyleProps> = ({ data }) => {
  return (
    <AspectRatio
      ratio={12 / 9}
      className="flex flex-col items-center justify-center overflow-hidden"
    >
      <Image
        src={BgPattern1}
        alt="bg-pattern"
        fill
        className="z-0 object-cover object-center"
      />

      {/* -- content */}
      <div className="z-10 flex flex-col items-center justify-center gap-1 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-white p-1.5 shadow">
          <data.icon size={20} className="text-gray-700" />
        </div>

        <p className="mt-3 font-semibold">{data.title}</p>
        <p className="text-sm text-gray-600">{data.content}</p>

       {data?.btn_text && <Button size="sm" className="mt-6" onClick={data.action}>
          <Plus size={18} strokeWidth={1.5} className="mr-1" /> {data.btn_text}
        </Button>}
      </div>
    </AspectRatio>
  );
};
