import { BookmarkButton } from "@/app/(system)/dashboard/tasks/[id]/page";
import { cn } from "@/lib/utils";
import { bookmarkCampaign, removeBookmark } from "@/services/campaign";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ServerResponse } from "http";
import { ArchiveMinus, Location } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

// Define the types for the props
interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  image_path: string[];
  locations: { state: string; lgas: string[] }[];
  number_of_responses: number;
  payment_rate_for_response: string;
  total_fee: string;
  type: string;
  is_bookmarked: string;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ServerResponse<any>, Error>>;
}

const TaskCardWidget: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  image_path,
  locations,
  number_of_responses,
  payment_rate_for_response,
  total_fee,
  type,
  is_bookmarked,
  refetch,
}) => {
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const pathname = usePathname();
  const [isFilled, setIsFilled] = useState(false);
  console.log(pathname, "isFilled");
  const handleClick = () => {
    setIsFilled(!isFilled);
  };
  const handleBookmark = async () => {
    console.log(id, "refetch");
    setIsBookmarkLoading(true);
    try {
      //@ts-ignore
      if (is_bookmarked) {
        const response = await removeBookmark(id as unknown as string);
        toast.success(response?.message);
        refetch();
        setIsBookmarkLoading(false);
      } else {
        const response = await bookmarkCampaign({}, id as unknown as string);
        //@ts-ignore
        toast.success(response?.message);
        refetch();
        setIsBookmarkLoading(false);
      }
    } catch (err) {
      setIsBookmarkLoading(false);
      toast.warning("Error with bookmark operation:");
    }
  };
  return (
    <div className="space-y-[18px] rounded-[16px] border border-[#F2F2F2] bg-white p-4">
      <figure className="relative h-[200px] w-full overflow-hidden rounded-[8px]">
        <Image
          src={image_path?.[0]}
          alt={title}
          className="h-full w-full object-cover"
          width={640}
          height={480}
        />
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full border border-neutral-300 border-opacity-15 bg-opacity-25 p-2 px-5 text-xs text-white backdrop-blur-sm",
          )}
        >
          {type}
        </span>
      </figure>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 rounded-full bg-main-100 bg-opacity-5 p-2 pr-5">
          <span className="rounded-full bg-white px-4 py-1 text-[14px] font-semibold leading-[21px] text-main-100">
            ${payment_rate_for_response}
          </span>
          <p className="text-[14px] leading-[16.71px] text-main-100">
            {number_of_responses}{" "}
            <span className="text-[#7698EC]">responses</span>
          </p>
        </div>
        {/* <span
          onClick={handleClick}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#7697ec84] text-main-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="24"
            viewBox="0 0 24 24"
            fill={isFilled ? "#3365E3" : "none"}
            // onClick={handleClick}
          >
            <path
              d="M14.5 10.65h-5"
              stroke={isFilled ? "#3365E3" : "#3365E3"}
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.82 2H7.18C5.05 2 3.32 3.74 3.32 5.86v14.09c0 1.8 1.29 2.56 2.87 1.69l4.88-2.71c.52-.29 1.36-.29 1.87 0l4.88 2.71c1.58.88 2.87.12 2.87-1.69V5.86C20.68 3.74 18.95 2 16.82 2Z"
              stroke={isFilled ? "#3365E3" : "#3365E3"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span> */}
        <BookmarkButton
          loading={isBookmarkLoading}
          //@ts-ignore
          isBookmarked={is_bookmarked}
          handleBookmark={handleBookmark}
        />
      </div>
      <div>
        <Link
          href={`/dashboard/tasks/${id}`}
          className="mb-3 block text-[14px] font-semibold leading-[21px] text-[#333] hover:underline"
        >
          {title}
        </Link>
        <p className="text-[14px] leading-[21px] text-[#333333]">
          {description.split(" ").slice(0, 20).join(" ")}...
        </p>

        <div className="mt-3 flex gap-2">
          <span className="text-[#828282]">
            <Location size="18" color="#828282" />
          </span>
          {/* <p className="text-[14px] leading-[21px] text-[#4F4F4F]">
            {locations?.map((location, index) => (
              <React.Fragment key={index}>
                {location?.state?.split(", ")[0]}
                {index < locations.length - 1 && ", "}
              </React.Fragment>
            ))}
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default TaskCardWidget;
