import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

import { Eye, Workflow, Dot } from "lucide-react";
import Map from "../map/map";
import { BookmarkButton } from "./BookmarkButton";
import { Note } from "iconsax-react";


// Define prop types for type safety
interface TaskDetailsProps {
  task: {
    data: {
      image_path: string[];
      title: string;
      organization: string;
      responses?: any[];
      is_bookmarked: boolean;
      payment_rate_for_response: number;
      type: string;
      description: string;
      no_of_questions: number;
      number_of_responses_received: number;
      number_of_responses: number;
    };
  };
  locationData: any; // Replace with specific location type if available
  USER_CURRENCY_SYMBOL: string;

  // Action prop types
  onViewResponse?: () => void;
  onContribute?: () => void;
  handleBookmark: () => void;

  // Optional state and loading props
  loading?: boolean;
  isBookmarkLoading?: boolean;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  locationData,
  USER_CURRENCY_SYMBOL,
  onViewResponse,
  onContribute,
  handleBookmark,
  loading = false,
  isBookmarkLoading = false,
}) => {
  // Helper function to determine button text
  const getButtonText = () => {
    // Implement your logic here, currently a placeholder
    return task.data.responses && task.data.responses.length > 0
      ? "Continue"
      : "Contribute";
  };

  // Helper function to determine if contribute is disabled
  const isContributeDisabled = () => {
    // Implement your disable logic here, currently a placeholder
    return false;
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between rounded-lg bg-white p-5">
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={task.data.image_path[0]}
              alt="Task image"
              className="h-14 w-14 rounded-lg object-cover"
              width={100}
              height={100}
            />
          </AspectRatio>

          <div>
            <h3 className="font-semibold text-neutral-900">
              {task.data.title}
            </h3>
            <p className="text-sm text-[#828282]">
              By {task.data.organization}
            </p>
          </div>
        </div>

        <div className="hidden items-center justify-center space-x-2 md:flex">
          {task.data.responses && task.data.responses.length > 0 && (
            <Button
              onClick={onViewResponse}
              className="h-auto gap-3 rounded-full border border-main-100 bg-white px-6 py-3 text-sm text-main-100 hover:bg-main-100 hover:text-white"
            >
              <span>
                <Eye size={20} />
              </span>
              View Response
            </Button>
          )}

          <Button
            disabled={isContributeDisabled()}
            onClick={onContribute}
            className="h-auto gap-3 rounded-full bg-main-100 px-10 py-3 text-sm shadow-lg shadow-blue-50 hover:bg-blue-700"
          >
            <span>
              {getButtonText() === "Continue" ? (
                <Workflow size={20} />
              ) : (
                <Note size={20} color="currentColor" />
              )}
            </span>
            {loading ? "Loading..." : getButtonText()}
          </Button>

          <BookmarkButton
            loading={isBookmarkLoading}
            isBookmarked={task.data.is_bookmarked}
            handleBookmark={()=>handleBookmark()}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
        <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Task Details
          </h3>

          <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
            <div>
              <div className="flex items-center">
                {/* Replace Date and Time with actual prop values or custom formatting */}
                <h4 className="font-medium text-[#101828]">Date</h4>
                <div className="font-medium text-[#101828]">
                  <Dot size={30} />
                </div>
                <span className="font-medium text-[#101828]">Time</span>
              </div>
              <p className="text-sm text-gray-400">Task Ends on</p>
            </div>

            <div>
              <h4 className="text-[#101828]">
                {USER_CURRENCY_SYMBOL} {task.data.payment_rate_for_response}
              </h4>
              <p className="text-sm text-gray-400">Per response</p>
            </div>

            <div>
              <h4 className="font-medium text-[#101828]">Multiple</h4>
              <p className="text-sm text-gray-400">Response type</p>
            </div>

            <div className="md:text-left">
              <h4 className="font-medium text-[#101828]">{task.data.type}</h4>
              <p className="text-sm text-gray-400">Campaign</p>
            </div>
          </div>

          <div className="mt-8">
            <span className="text-sm text-gray-400">Description</span>
            <p className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
              {task.data.description}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5">
          <figure className="h-[85%]">
            <Map location={locationData} />
          </figure>

          <div className="mt-5 flex gap-5">
            <div className="text-sm font-semibold text-[#101828]">
              {task.data.no_of_questions}{" "}
              <span className="font-normal text-[#828282]">Questions</span>
            </div>
            <div className="text-sm font-semibold text-[#101828]">
              {task.data.number_of_responses_received}{" "}
              <span className="font-normal text-[#828282]">
                of {task.data.number_of_responses} responses
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
