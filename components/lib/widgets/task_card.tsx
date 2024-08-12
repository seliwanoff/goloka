import { cn } from "@/lib/utils";
import { ArchiveMinus, Location } from "iconsax-react";
import Image, { StaticImageData } from "next/image";
import React from "react";

type ComponentProps = {
  badgeClassName?: string;
  title: string;
  content: string;
  location: string;
  image: StaticImageData;
};

const TaskCardWidget: React.FC<ComponentProps> = ({
  badgeClassName,
  title,
  content,
  location,
  image,
}) => {
  return (
    <div className="space-y-[18px] rounded-[16px] border border-[#F2F2F2] bg-white p-4">
      <figure className="relative h-[200px] w-full overflow-hidden rounded-[8px]">
        <Image src={image} alt={title} className="h-full w-full object-cover" />
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full border border-neutral-300 border-opacity-15 bg-opacity-25 p-2 px-5 text-xs text-white backdrop-blur-sm",
            badgeClassName,
          )}
        >
          Survey
        </span>
      </figure>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 rounded-full bg-main-100 bg-opacity-5 p-2 pr-5">
          <span className="rounded-full bg-white px-4 py-1 text-main-100">
            $15
          </span>
          <p className="text-main-100">
            24 <span className="text-[#7698EC]">of 64 responses</span>
          </p>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#3365E31F] text-main-100">
          <ArchiveMinus size={24} />
        </span>
      </div>
      <div>
        <h3 className="mb-3 font-semibold text-[#333]">{title}</h3>
        <p className="text-[#333]">{content}</p>
        <div className="mt-3 flex gap-3">
          <span className="text-[#4F4F4F]">
            <Location size="24" />
          </span>
          <p className="text-[#4F4F4F]">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCardWidget;
