export const SkeletonXLoader = () => {
  return (
    <div className="rounded-lg bg-gray-200 p-4 shadow-md">
      {/* Flex container for title and icon */}
      <div className="flex items-center justify-between">
        {/* Title loader */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-300 md:w-40 lg:w-48"></div>
        </div>

        {/* Icon loader */}
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-300 sm:h-10 sm:w-10 md:h-12 md:w-12"></div>
      </div>

      {/* Value loader */}
      <div className="mt-3">
        <div className="h-6 w-20 animate-pulse rounded bg-gray-300 sm:w-32 md:w-40 lg:w-48"></div>
      </div>

      {/* Footer loader */}
      <div className="mt-2">
        <div className="h-4 w-16 animate-pulse rounded bg-gray-300 sm:w-20 md:w-24 lg:w-28"></div>
      </div>
    </div>
  );
};
