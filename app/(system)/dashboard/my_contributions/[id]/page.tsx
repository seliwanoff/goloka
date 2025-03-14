"use client";

import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dot,
  EllipsisVertical,
  Eye,
  LoaderCircle,
  MoveLeft,
  OctagonAlert,
  SquarePen,
  Workflow,
  X,
} from "lucide-react";
import { ArchiveMinus, Note } from "iconsax-react";
// import Map from "@/public/assets/images/tasks/tasks.png";
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
import { useRemoteUserStore } from "@/stores/remoteUser";
import ResponseList from "@/components/response/responseListCard";
import Map from "@/components/map/map";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  // PopoverClose,
} from "@/components/ui/popover";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useShowReport } from "@/stores/overlay";
import { useMediaQuery } from "@react-hook/media-query";
import ChatWidget from "@/components/lib/widgets/response-chat-widget";
import ReportModal from "@/components/lib/modals/report_modal";

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

const ContributionDetails: React.FC<PageProps> = ({}) => {
  const [isStepper, setIsStepper] = useState<boolean>(false);
  const router = useRouter();
  const { user, isAuthenticated } = useRemoteUserStore();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const { id: taskId } = useParams();
  const [responseId, setResponseId] = useState<string | null>(null);
  const { step } = useStepper();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];

  const { setShowReport, setReportId } = useShowReport();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState<boolean>(false);
  const [openMessagesAdmin, setOpenMessagesAdmin] = useState<boolean>(false);

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

  const responses = useMemo(() => {
    //@ts-ignore
    return task?.data?.responses || [];
    //@ts-ignore
  }, [task?.data?.responses]);

  //@ts-ignore
  const locations = useMemo(() => task?.data?.locations, [task]);

  const currentUser = useRemoteUserStore((state) => state.user);

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
    // router.push(`/dashboard/responses/${res?.id}`);
  };

  const handleBookmark = async () => {
    setIsBookmarkLoading(true);
    try {
      //@ts-ignore
      if (task?.data?.is_bookmarked) {
        const response = await removeBookmark(taskId as string);
        toast.success(response?.message);
        setIsBookmarkLoading(false);
      } else {
        const response = await bookmarkCampaign({}, taskId as string);
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

  const WrappedTaskStepper = () => (
    <TaskStepper
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
  //@ts-ignore
  //console.log(task?.data?.responses, "jtjtjjt");

  const MessageComponentWithAdmin = () => {
    return (
      <div className="col-span-2 md:col-span-1 md:place-self-end">
        {isDesktop ? (
          <>
            <Sheet open={openMessagesAdmin} onOpenChange={setOpenMessagesAdmin}>
              <SheetTrigger asChild className="relative flex justify-end">
                <Button className="h-full w-[180px] gap-3 rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314]">
                  Chat with admin{" "}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                    {/* @ts-ignore */}
                    {/***res?.unread_messages_count **/}0{" "}
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
                <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
                  <div className="flex items-center gap-5">
                    <div
                      onClick={() => setOpenMessagesAdmin(false)}
                      className="cursor-pointer text-[#fff]"
                    >
                      <MoveLeft />
                    </div>
                    {/* <Image
                  src={profileImg}
                  alt="chat-user"
                  className="h-12 w-12 rounded-full object-cover object-center"
                /> */}
                    <SheetTitle className="font-normal text-white">
                      Message
                    </SheetTitle>
                    {/* <SheetDescription className="text-white">
                  24
                </SheetDescription> */}
                  </div>
                  {/* CUSTOM CLOSE */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <span className="absolute right-4 mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-white text-main-100">
                        <EllipsisVertical size={20} />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-fit cursor-pointer rounded-md text-[#EB5757] shadow-lg hover:bg-slate-200">
                      <div className="item-center flex gap-3 text-[#EB5757]">
                        <OctagonAlert />
                        <p className="text-[#EB5757]">Report user</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </SheetHeader>

                {/* CHAT WIDGET */}
                <div className="mt-24">
                  <ChatWidget
                    modelType="report"
                    modelId={+1}
                    status={task?.data?.status}
                    //@ts-ignore
                    currentUserId={20}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <>
            <Drawer
              open={openMessagesAdmin}
              onOpenChange={setOpenMessagesAdmin}
            >
              <DrawerTrigger asChild>
                <Button className="h-full w-full gap-3 place-self-end rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314] focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[150px]">
                  Message{" "}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                    {/* @ts-ignore */}
                    {/***res?.unread_messages_count () **/}
                  </span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="overflow-hidden border-0 focus-visible:outline-none">
                <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
                  <DrawerTitle className="font-normal text-white">
                    {" "}
                    Messages
                  </DrawerTitle>
                  <DrawerDescription className="text-white">
                    24
                  </DrawerDescription>
                  <span
                    onClick={() => setOpen(false)}
                    className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                  >
                    <X size={20} />
                  </span>
                </DrawerHeader>
                <div className="mt-24" />
                {/* <ChatWidget /> */}
                <ChatWidget
                  modelType="response"
                  modelId={+1}
                  status={task?.data?.status}
                  //@ts-ignore
                  currentUserId={20}
                />
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>
    );
  };

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
                {/* {task?.data?.responses && task.data.responses.length > 0 && (
                  <Button
                    onClick={onViewResponse}
                    className="h-auto gap-3 rounded-full border border-main-100 bg-white px-6 py-3 text-sm text-main-100 hover:bg-main-100 hover:text-white"
                  >
                    <span>
                      <Eye size={20} />
                    </span>
                    View Response
                  </Button>
                )} */}
                <Button
                  disabled={isContributeDisabled()}
                  onClick={onContribute}
                  className="h-auto gap-3 rounded-full bg-main-100 px-10 py-3 text-sm shadow-lg shadow-blue-50 hover:bg-blue-700"
                >
                  <span>
                    {getButtonText() === "Continue" ? (
                      <Workflow size={20} />
                    ) : (
                      <Note size={20} />
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

            {/* MESSAGE CHAT SHEET */}
            <div className="col-span-2 md:col-span-1 md:place-self-end">
              {isDesktop ? (
                <div className="flex w-full gap-[7px]">
                  <MessageComponentWithAdmin />
                  <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="flex gap-2">
                      <Button className="h-full w-[150px] gap-3 rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314]">
                        Messages{" "}
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                          {/* @ts-ignore */}0
                        </span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
                      <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
                        <div className="flex items-center gap-5">
                          <div
                            onClick={() => setOpen(false)}
                            className="cursor-pointer text-[#fff]"
                          >
                            <MoveLeft />
                          </div>
                          {/* <Image
                            src={profileImg}
                            alt="chat-user"
                            className="h-12 w-12 rounded-full object-cover object-center"
                          /> */}
                          <SheetTitle className="font-normal text-white">
                            Messages
                          </SheetTitle>
                          {/* <SheetDescription className="text-white">
                            24
                          </SheetDescription> */}
                        </div>
                        {/* CUSTOM CLOSE */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <span className="absolute right-4 mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-white text-main-100">
                              <EllipsisVertical size={20} />
                            </span>
                          </PopoverTrigger>
                          <PopoverContent className="max-w-fit cursor-pointer rounded-md text-[#EB5757] shadow-lg hover:bg-slate-200">
                            <div className="item-center flex gap-3 text-[#EB5757]">
                              <OctagonAlert />
                              <p className="text-[#EB5757]">Report user</p>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </SheetHeader>

                      {/* CHAT WIDGET */}
                      <div className="mt-24">
                        <ChatWidget
                          modelType="campaign"
                          status={""}
                          modelId={+taskId}
                          currentUserId={currentUser?.id as number}
                        />
                      </div>

                      {/* CHAT MESSAGE INPUT */}
                      {/* <SheetFooter className="absolute bottom-0 left-0 w-full border-t md:flex-row md:justify-start md:p-4">
                        <form id="chat-box" className="block w-full">
                          <div className="flex w-full items-center gap-6">
                            <Input
                              type="text"
                              name="message"
                              id="message"
                              aria-label="Message"
                              placeholder="Input your message"
                              className="form-input h-[50px] rounded-full border border-[#DAD8DF] bg-[#F5F5F5] focus:ring-main-100 focus:ring-offset-0 focus-visible:outline-none"
                            />
                            <Button className="h-[50px] items-center gap-2 rounded-full bg-main-100 px-5 font-medium text-white">
                              <span className="">
                                <Send2 size="24" />
                              </span>
                              Send
                            </Button>
                          </div>
                        </form>
                      </SheetFooter> */}
                    </SheetContent>
                  </Sheet>

                  <Popover>
                    <PopoverTrigger asChild>
                      <span className="mt-0 flex h-8 w-8 -translate-y-[calc(50%_-_20px)] cursor-pointer items-center justify-center rounded-full bg-[#F0F0F0] text-[#828282]">
                        <EllipsisVertical size={20} className="rotate-90" />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-fit cursor-pointer rounded-md text-[#EB5757] shadow-lg hover:bg-slate-200">
                      <div
                        className="item-center flex gap-3 text-[#EB5757]"
                        onClick={() => {
                          setShowReport(true);
                          //@ts-ignore
                          setReportId(taskId);
                        }}
                      >
                        <OctagonAlert />
                        <p className="text-[#EB5757]">Report user</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <>
                  <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                      <Button className="h-full w-full gap-3 place-self-end rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314] focus-visible:ring-0 focus-visible:ring-offset-0 md:w-[150px]">
                        Message{" "}
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                          {/* @ts-ignore */}0
                        </span>
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="overflow-hidden border-0 focus-visible:outline-none">
                      <DrawerHeader className="absolute left-0 top-0 z-10 w-full bg-main-100 p-5 text-left">
                        <DrawerTitle className="font-normal text-white">
                          {" "}
                          Messages
                        </DrawerTitle>
                        <DrawerDescription className="text-white">
                          24
                        </DrawerDescription>
                        <span
                          onClick={() => setOpen(false)}
                          className="absolute right-4 mt-0 flex h-8 w-8 translate-y-[24px] cursor-pointer items-center justify-center rounded-full bg-white text-main-100"
                        >
                          <X size={20} />
                        </span>
                      </DrawerHeader>
                      <div className="mt-24" />
                      {/* <ChatWidget /> */}
                      <ChatWidget
                        modelType="campaign"
                        modelId={+taskId}
                        status={""}
                        currentUserId={currentUser?.id as number}
                      />
                      {/* <DrawerFooter className="border-t">
                        <form id="chat-box">
                          <div className="flex items-center gap-6">
                            <Input
                              type="text"
                              name="message"
                              id="message"
                              aria-label="Message"
                              placeholder="Input your message"
                              className="form-input h-[50px] rounded-full border border-[#DAD8DF] bg-[#F5F5F5] focus:ring-main-100 focus:ring-offset-0 focus-visible:outline-none"
                            />
                            <Button className="h-[50px] items-center gap-2 rounded-full bg-main-100 px-5 font-medium text-white">
                              <span className="">
                                <Send2 size="24" />
                              </span>
                              Send
                            </Button>
                          </div>
                        </form>
                      </DrawerFooter> */}
                    </DrawerContent>
                  </Drawer>
                </>
              )}
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
                    6{" "}
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
            <div className="col-span-5 mt-8 rounded-2xl bg-[#fff] p-6">
              <div className="mb-6 flex justify-between">
                <div>
                  <span className="text-lg font-semibold text-[#000]">
                    {/* @ts-ignore */}
                    {task?.data?.responses?.length}{" "}
                  </span>
                  <span className="text-lg text-[#828282]">
                    {/* @ts-ignore */}
                    {task?.data?.responses?.length === 1
                      ? "Response"
                      : "Responses"}
                  </span>
                </div>

                {/* <Link
                  href="/dashboard/marketplace"
                  className="text-lg font-semibold text-main-100"
                >
                  See all
                </Link> */}
              </div>

              <ResponseList responses={responses} isLoading={isLoading} />
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
                    <Note size={20} />
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

      {/*** REPORT  */}

      <ReportModal />
    </>
  );
};

export default ContributionDetails;
