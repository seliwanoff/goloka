import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Location } from "iconsax-react";
import Marquee from "@/components/ui/marquee";
import { Skeleton } from "../task-stepper/skeleton";

const CampaignCard = ({
  campaign,
  onClick,
}: {
  campaign: any;
  onClick: any;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex h-auto min-h-[480px] w-full cursor-pointer flex-col rounded-2xl border p-3 transition-shadow hover:shadow-xl sm:w-[340px] md:w-[380px]"
    >
      {/* Image Container */}
      <AspectRatio ratio={3 / 2} className="overflow-hidden rounded-lg">
        <Image
          src={campaign.image_path[0]}
          alt={campaign.title}
          className="h-full w-full object-cover"
          fill
        />
        <div className="absolute right-2 top-2 rounded-full border bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {campaign.status}
        </div>
      </AspectRatio>

      {/* Stats Row */}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-full bg-main-100 bg-opacity-5 p-2">
          <p className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-gray-800">
            {campaign.number_of_responses_received}
          </p>
          <p className="text-sm">of</p>
          <p className="text-sm text-gray-500">
            {campaign.number_of_responses} <span>responses</span>
          </p>
        </div>
        <span className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-gray-800">
          ₦{campaign.payment_rate_for_response}
        </span>
      </div>

      {/* Content */}
      <h3 className="mb-2 mt-4 text-lg font-semibold leading-tight text-gray-800">
        {campaign.title}
      </h3>
      <p className="line-clamp-3 flex-grow text-base font-light leading-relaxed text-gray-700">
        {campaign.description}
      </p>

      {/* Location Footer */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start">
        <span className="mt-1 text-gray-600">
          <Location size={18} />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm leading-relaxed text-gray-600">
            {campaign.locations?.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {/* @ts-ignore */}
            {campaign.locations.states.map((loc, index) => (
              <p key={index} className="text-sm leading-relaxed text-gray-600">
                {loc.label}
                {index < campaign.locations.states.length - 1 && ","}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Campaign list wrapper component
//@ts-ignore
const CampaignList = ({ campaignData, isLoading, router }) => {
  return (
    <section className="w-full overflow-hidden px-4 pb-6">
      <div className="no-scrollbar w-full">
        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(5)].map((_, index) => (
              <CampaignCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Marquee pauseOnHover className="relative [--duration:40s]">
            <div className="flex gap-4">
              {campaignData?.data
                .slice(0, 8)

                .map((campaign: any, index: React.Key | null | undefined) => (
                  <CampaignCard
                    key={index}
                    campaign={campaign}
                    onClick={() => router.push("/signin")}
                  />
                ))}
            </div>
          </Marquee>
        )}
      </div>
    </section>
  );
};

export default CampaignList;
const CampaignCardSkeleton = () => (
  <div className="rounded-2xl border p-3 md:w-[380px]">
    <Skeleton className="mb-4 aspect-[3/2] rounded-lg" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  </div>
);
