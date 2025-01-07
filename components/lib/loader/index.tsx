import React from "react";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);
export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-[18px] rounded-[16px] border border-[#F2F2F2] bg-white p-4">
      <figure className="relative h-[200px] w-full overflow-hidden rounded-[8px]">
        <SkeletonBox className="h-full w-full rounded-lg" />
        <div className="absolute right-3 top-3 rounded-full bg-gray-300 p-2 px-5 text-xs text-transparent">
          <SkeletonBox className="h-4 w-20" />
        </div>
      </figure>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 rounded-full bg-main-100 bg-opacity-5 p-2 pr-5">
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-6 w-24" />
        </div>
        <SkeletonBox className="h-10 w-10 rounded-full" />
      </div>
      <div>
        <SkeletonBox className="mb-2 h-6 w-48" />
        <SkeletonBox className="h-4 w-72" />
        <div className="mt-3 flex gap-2">
          <SkeletonBox className="h-4 w-6" />
          <SkeletonBox className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
};
