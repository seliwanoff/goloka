"use client";

import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Dot, Eye, LoaderCircle, SquarePen, Workflow } from "lucide-react";
import { ArchiveMinus, Note } from "iconsax-react";

import Link from "next/link";

import { useStepper } from "@/context/TaskStepperContext.tsx";
import TaskStepper from "@/components/task-stepper/TaskStepper";
import { Toaster } from "@/components/ui/sonner";

import { getCampaignQuestion, getTaskById } from "@/services/contributor";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import {
  bookmarkCampaign,
  createCampaignResponse,
  removeBookmark,
} from "@/services/campaign";

import dynamic from "next/dynamic";
import { toast } from "sonner";
import { getAResponse } from "@/services/response";
import { BookmarkButton } from "@/components/contributor/BookmarkButton";
import Map from "@/components/map/map";
import { useRemoteUserStore } from "@/stores/remoteUser";

// Dynamically import the LocationMap component with SSR disabled
const LocationMap = dynamic(() => import("@/components/map/locationmap"), {
  ssr: false,
});

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);

const SkeletonLoader: React.FC = () => {
  return (
    <section className="space-y-4 py-8 pt-[34px]">
      <CustomBreadCrumbs />
      <div className="flex justify-between rounded-lg bg-white p-5">
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <SkeletonBox className="h-14 w-14 rounded-lg" />
          <div className="">
            <SkeletonBox className="mb-2 h-4 w-48" />
            <SkeletonBox className="h-4 w-32" />
          </div>
        </div>
        <div className="hidden items-center justify-center space-x-2 md:flex">
          <SkeletonBox className="h-12 w-32 rounded-full" />
          <SkeletonBox className="h-12 w-12 rounded-full" />
        </div>
      </div>
      <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
        <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
          <SkeletonBox className="mb-4 h-6 w-48" />
          <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
            <div className="">
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
            <div>
              <SkeletonBox className="mb-2 h-4 w-20" />
              <SkeletonBox className="h-4 w-24" />
            </div>
            <div>
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
            <div className="md:text-right">
              <SkeletonBox className="mb-2 h-4 w-24" />
              <SkeletonBox className="h-4 w-20" />
            </div>
          </div>
          <div className="mt-8">
            <SkeletonBox className="mb-2 h-4 w-32" />
            <SkeletonBox className="h-16 w-full" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5">
          <SkeletonBox className="mb-4 h-[85%] w-full rounded-lg" />
          <div className="mt-5 flex gap-5">
            <SkeletonBox className="h-4 w-12" />
            <SkeletonBox className="h-4 w-16" />
          </div>
        </div>
      </div>
    </section>
  );
};

type PageProps = {};

const TaskDetail: React.FC<PageProps> = ({}) => {
  const [isStepper, setIsStepper] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { id: taskId } = useParams();
  const [responseId, setResponseId] = useState<string | null>(null);
  const { step } = useStepper();
  const { user, isAuthenticated } = useRemoteUserStore();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const {
    data: task,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get task"],
    queryFn: async () => await getTaskById(taskId as string),
  });

  const { data: getResponse, refetch: refetchResponse } = useQuery({
    queryKey: ["get a Response", responseId],
    queryFn: async () => (responseId ? await getAResponse(responseId) : null),
    enabled: !!responseId,
  });

  //@ts-ignore
  const locations = useMemo(() => task?.data?.locations, [task]);
  //@ts-ignore
  const responses = useMemo(() => task?.data?.responses, [task]);

  console.log(responses, "response");

  useEffect(() => {
    const stepperParam = searchParams.get("stepper");
    const stepParam = searchParams.get("step");

    if (stepperParam === "true" && !isStepper) {
      setIsStepper(true);
    }
  }, [searchParams]);

  const {
    data: quest,
    isLoading: questLoading,
    error: questError,
  } = useQuery({
    queryKey: ["campaign questions", taskId], // The key used for caching
    queryFn: () => getCampaignQuestion(taskId as string), // Function to fetch data
    enabled: !!taskId, // Ensures the query only runs when taskId exists
    retry: 2, // Retry failed queries up to 2 times
  });

  const getButtonText = () => {
    //@ts-ignore
    if (!task?.data?.responses || task.data.responses.length === 0) {
      return "Contribute";
    }
    //@ts-ignore
    const hasDraftResponse = task.data.responses.some(
      //@ts-ignore
      (response) => response.status === "draft",
    );
    return hasDraftResponse ? "Continue" : "Contribute";
  };
  const isContributeDisabled = () => {
    return (
      //@ts-ignore
      task?.data?.responses?.length > 0 &&
      //@ts-ignore
      task?.data?.allows_multiple_responses === 0 &&
      //@ts-ignore
      !task?.data?.responses.some((response) => response.status === "draft")
    );
  };

  const onContribute = async () => {
    setLoading(true);
    try {
      //@ts-ignore
      if (task?.data?.responses?.length === 0) {
        // Create new response if there are no responses
        const response = await createCampaignResponse({}, taskId as string);
        console.log(response, " first call");

        // Fixed URL format - use & instead of second ?
        router.push(
          //@ts-ignore
          `${window.location.pathname}?responseID=${response.data?.id}&stepper=true&step=1`,
        );

        //@ts-ignore
        toast.success(response.message);
      } else if (getButtonText() === "Continue") {
        // Find the draft response
        //@ts-ignore
        const draftResponse = task.data.responses.find(
          //@ts-ignore
          (response) => response.status === "draft",
        );

        if (draftResponse?.status === "draft") {
          setResponseId(draftResponse.id);
          await refetchResponse();
          console.log(getResponse, "getResponse");

          // Uncomment and fix URL format here too
          router.push(
            `${window.location.pathname}?responseID=${draftResponse.id}&stepper=true&step=1`,
          );
        }
        //@ts-ignore
      } else if (task?.data?.allows_multiple_responses === 1) {
        // Create new response if multiple responses are allowed
        const response = await createCampaignResponse({}, taskId as string);

        // Fixed URL format here as well
        router.push(
          //@ts-ignore
          `${window.location.pathname}?responseID=${response.data?.id}&stepper=true&step=1`,
        );

        //@ts-ignore
        toast.success(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onViewResponse = () => {
    //@ts-ignore
    if (task?.data?.responses && task.data.responses.length > 0) {
      const latestResponse =
        //@ts-ignore
        task.data.responses[task.data.responses.length - 1];
      router.push(`/dashboard/responses/${latestResponse.id}`);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarkLoading(true);
    try {
      //@ts-ignore
      if (task?.data?.is_bookmarked) {
        const response = await removeBookmark(taskId as string);
        refetch();
        if (response) {
          toast.success(response?.message);
          setIsBookmarkLoading(false);
        }
      } else {
        const response = await bookmarkCampaign({}, taskId as string);
        refetch();
        //@ts-ignore
        toast.success(response?.message);
        setIsBookmarkLoading(false);
      }
    } catch (err) {
      setIsBookmarkLoading(false);
      toast.warning("Error with bookmark operation:");
    }
  };

  console.log(quest, "quest");
  const updateStepUrl = (newStep: number) => {
    router.push(`${window.location.pathname}?stepper=true&step=${newStep}`);
  };
  console.log(getResponse, "getResponse");

  const WrappedTaskStepper = () => (
    <TaskStepper
      response={getResponse}
      //@ts-ignore
      quest={quest}
      onStepChange={(newStep: any) => {
        updateStepUrl(newStep);
      }}
    />
  );
  //@ts-ignore
  const locationData = task?.data?.locations;
  //@ts-ignore
  const Date = moment(task?.data?.ends_at).format("DD MMMM YYYY");
  //@ts-ignore
  const Time = moment(task?.data?.ends_at).format("hh:mm A");

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <Toaster richColors position={"top-right"} />
      <section className="space-y-4 py-8 pt-[34px]">
        <CustomBreadCrumbs />

        {isStepper ? (
          <>
            <div className="mx-auto mt-9 w-full rounded-2xl bg-white p-4 sm:w-[70%] md:mt-[96px]">
              <div className="mt-6">
                {/* @ts-ignore */}
                <WrappedTaskStepper />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ####################################### */}
            {/* -- Header text section */}
            {/* ####################################### */}

            <div className="flex justify-between rounded-lg bg-white p-5">
              <div className="grid grid-cols-[56px_1fr] items-center gap-4">
                <AspectRatio ratio={1 / 1}>
                  <Image
                    //@ts-ignore
                    src={task?.data?.image_path[0]}
                    alt="Task image"
                    className="h-14 w-14 rounded-lg object-cover"
                    width={100}
                    height={100}
                  />
                </AspectRatio>

                <div className="">
                  <h3 className="font-semibold text-neutral-900">
                    {/* @ts-ignore */}
                    {task?.data?.title}
                  </h3>
                  <p className="text-sm text-[#828282]">
                    {/* @ts-ignore */}
                    By {task?.data?.organization}
                  </p>
                </div>
              </div>
              <div className="hidden items-center justify-center space-x-2 md:flex">
                {/* @ts-ignore */}
                {task?.data?.responses && task.data.responses.length > 0 && (
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
                  //@ts-ignore
                  isBookmarked={task?.data?.is_bookmarked}
                  handleBookmark={handleBookmark}
                />
              </div>
            </div>

            {/* -- Details */}
            <div className="grid h-[30%] gap-4 lg:grid-cols-[2fr_1.5fr]">
              <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Task Details
                </h3>
                <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
                  <div className="">
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#101828]">{Date}</h4>
                      <div className="font-medium text-[#101828]">
                        <Dot size={30} />
                      </div>
                      <span className="font-medium text-[#101828]">{Time}</span>
                    </div>
                    <p className="text-sm text-gray-400">Task Ends on</p>
                  </div>
                  <div>
                    <h4 className="text-[#101828]">
                      {USER_CURRENCY_SYMBOL} {/* @ts-ignore */}
                      {task?.data?.payment_rate_for_response}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Per response</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#101828]">Multiple</h4>
                    <p className="text-sm text-gray-400">Response type </p>
                  </div>
                  <div className="md:text-left">
                    <h4 className="font-medium text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.type}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign</p>
                  </div>
                </div>
                <div className="mt-8">
                  <span className="text-sm text-gray-400">Description</span>
                  <p className="mt-3 line-clamp-5 text-sm leading-6 text-[#4F4F4F]">
                    {/* @ts-ignore */}
                    {task?.data?.description}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5">
                <figure className="h-[85%]">
                  <Map location={locationData} />
                </figure>
                <div className="mt-5 flex gap-5">
                  <div className="text-sm font-semibold text-[#101828]">
                    {/* @ts-ignore */}
                    {task?.data?.no_of_questions}{" "}
                    <span className="font-normal text-[#828282]">
                      Questions
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-[#101828]">
                    {/* @ts-ignore */}
                    {task?.data?.number_of_responses_received}{" "}
                    <span className="font-normal text-[#828282]">
                      {/* @ts-ignore */}
                      0f {task?.data?.number_of_responses} responses
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ####################################### */}
            {/* -- Tasks section */}
            {/* ####################################### */}
            <div className="col-span-5 mt-8">
              <div className="mb-6 flex justify-between">
                <h3 className="text-lg font-semibold text-[#333]">
                  Related Tasks
                </h3>

                <Link
                  href="/dashboard/marketplace"
                  className="text-lg font-semibold text-main-100"
                >
                  See all
                </Link>
              </div>

              {/* Task list */}
              {/* <div className="grid gap-5 md:grid-cols-2 1xl:grid-cols-3 xl:grid-cols-3">
                {tasks.map((task: any, index: number) => (
                  <TaskCardWidget {...task} key={index} />
                ))}
              </div> */}
            </div>

            {/* MOBILE CTA */}
            <div className="fixed bottom-0 left-0 z-10 flex w-full items-center justify-start space-x-2 bg-white p-5 md:hidden">
              {/* @ts-ignore */}
              {task?.data?.responses && task.data.responses.length > 0 && (
                <Button
                  onClick={onViewResponse}
                  className="h-auto gap-3 rounded-full border border-main-100 bg-white px-8 py-3 text-sm text-main-100 shadow-lg shadow-main-100 hover:bg-main-100 hover:text-white"
                >
                  <span>
                    <Eye size={20} />
                  </span>
                  View
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
                //@ts-ignore
                isBookmarked={task?.data?.is_bookmarked}
                handleBookmark={handleBookmark}
              />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default TaskDetail;
