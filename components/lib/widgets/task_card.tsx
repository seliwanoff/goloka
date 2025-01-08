import { BookmarkButton } from "@/components/contributor/BookmarkButton";
import { generateURL } from "@/helper";
import { cn } from "@/lib/utils";
import { bookmarkCampaign, removeBookmark } from "@/services/campaign";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ServerResponse } from "http";
import { Location } from "iconsax-react";
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
  number_of_responses_received: number;
  payment_rate_for_response: string;
  total_fee: string;
  type: string;
  is_bookmarked: boolean;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<ServerResponse<any>, Error>>;
}

export const useGenerateURL = (id: number) => {
  const pathname = usePathname();
  return generateURL(pathname, id);
};

const TaskCardWidget: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  image_path,
  number_of_responses,
  number_of_responses_received,
  payment_rate_for_response,
  type,
  is_bookmarked,
  refetch,
  locations,
}) => {
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { user } = useRemoteUserStore();
  const url = useGenerateURL(id);
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsBookmarkLoading(true);
    try {
      if (is_bookmarked) {
        const response = await removeBookmark(id as unknown as string);
        console.log(response, "response");

        refetch();
        if (response) {
          toast.success(response?.message);
          setIsBookmarkLoading(true);
        }
      } else {
        const response = await bookmarkCampaign({}, id as unknown as string);
        //@ts-ignore
        toast.success(response?.message);
        refetch();
      }
    } catch (err) {
      toast.warning("Error with bookmark operation");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <Link
      key={id}
      href={url}
      className="space-y-[18px] rounded-[16px] border border-[#F2F2F2] bg-white p-4 hover:border-main-100 hover:shadow"
    >
      <figure className="relative h-[280px] w-full overflow-hidden rounded-[8px]">
        {/* <Image
          src={image_path?.[0]}
          alt={title}
          className="h-full w-full object-cover"
          width={640}
          height={480}
        /> */}
      </figure>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full bg-main-100 bg-opacity-5 p-2 pr-5">
          <span className="rounded-full bg-white px-4 py-1 text-[14px] font-semibold leading-[21px] text-main-100">
            {USER_CURRENCY_SYMBOL}
            {payment_rate_for_response}
          </span>
          <p className="text-[14px] leading-[16.71px] text-main-100">
            {number_of_responses_received} of {number_of_responses}{" "}
            <span className="text-[#7698EC]">responses</span>
          </p>
        </div>

        <BookmarkButton
          loading={isBookmarkLoading}
          isBookmarked={is_bookmarked}
          handleBookmark={handleBookmark}
        />
      </div>

      <div>
        <Link
          href={url}
          className="mb-3 block text-[14px] font-semibold leading-[21px] text-[#333] hover:underline"
        >
          {title}
        </Link>
        <p className="text-[14px] leading-[21px] text-[#333333]">
          {description.split(" ").slice(0, 20).join(" ")}...
        </p>

        {/* <div className="mt-3 flex gap-2">
          <span className="text-[#828282]">
            <Location size="15" color="#828282" />
          </span>
        </div> */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[#4F4F4F]">
            <Location size={18} color="currentColor" />
          </span>
          <div className="flex items-center gap-2">
            <p className="text-[14px] leading-[21px] text-[#4F4F4F]">
              {/* @ts-ignore */}
              {locations?.label}
            </p>
            <div className="flex items-center gap-2">
              {/* @ts-ignore */}
              {locations.states.map((loc: any, index: any) => (
                <p
                  key={index}
                  className="text-[14px] leading-[21px] text-[#4F4F4F]"
                >
                  {loc.label}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCardWidget;
