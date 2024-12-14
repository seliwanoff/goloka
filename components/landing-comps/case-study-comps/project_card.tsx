import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProjectCard = ({
  data,
  className,
}: {
  data: any;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex h-[400px] flex-col justify-end overflow-hidden rounded-2xl p-6",
        className,
      )}
    >
      <Image
        src={data.image}
        width={500}
        height={500}
        className="absolute left-0 top-0 z-0 h-full w-full object-cover object-center"
        alt=""
      />

      <div className="absolute left-0 top-0 z-[1] h-full w-full bg-gradient-to-t from-black/50 to-transparent"></div>

      <div className="relative z-10">
        <p className="mb-1.5 text-sm text-white">{data.date}</p>
        <Link
          href="/case-studies/1"
          className="text-lg font-semibold tracking-wide text-white md:text-xl"
        >
          {data.name}
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
