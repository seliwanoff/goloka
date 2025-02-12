"use client";

import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import {
  ArrowUpDown,
  Dot,
  Edit,
  Eye,
  EyeIcon,
  LoaderCircle,
  LucideIcon,
  Play,
  Plus,
  Settings,
  SquarePen,
  Trash,
  UserRound,
  Workflow,
} from "lucide-react";
import { ArchiveMinus, EyeSlash, Note } from "iconsax-react";
// import Map from "@/public/assets/images/tasks/tasks.png";
import Link from "next/link";

import { useStepper } from "@/context/TaskStepperContext.tsx";
import TaskStepper from "@/components/task-stepper/TaskStepper";
import { Toaster } from "@/components/ui/sonner";

import { getCampaignQuestion, getTaskById } from "@/services/contributor";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/lib/navigation/Pagination";

import moment from "moment";
import {
  bookmarkCampaign,
  createCampaignResponse,
  getCampaignByIdDetails,
  removeBookmark,
  submitCampaign,
  updateCampaignByStatus,
} from "@/services/campaign";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Status = "draft" | "running" | "completed" | "archived";

interface StatusPillProps {
  status: Status;
}

import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  deleteQuestionCampaign,
  getAllResponseByCampaign,
  getAResponse,
  getCampaignQuestions,
} from "@/services/response";
import { BookmarkButton } from "@/components/contributor/BookmarkButton";
import Map from "@/components/map/map";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { getStatusText } from "@/helper";
import { chunkArray, cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BsThreeDots } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import UpdateCampaignDialog from "@/components/lib/modals/confirm_update_campaign_modal";
import CampaignButton from "@/components/organization-comps/campaign_status_button";
import WalletTableOptions from "@/components/lib/widgets/WalletTableOptions";
import ResponseOptions from "@/components/lib/widgets/ReponseOptions";
import EditMainCampaign from "@/components/lib/modals/edit_man_campaign";
import { useEditMainCampaignOverlay } from "@/stores/overlay";
//import ConfirmFunding from "@/components/wallet_comps/confirm_funding";

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

const CampaignDetails: React.FC<PageProps> = ({}) => {
  const [isStepper, setIsStepper] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: campaignId } = useParams();
  const [responseId, setResponseId] = useState<string | null>(null);
  const [campaignList, setCampaignList] = useState<[]>([]);

  // const { step } = useStepper();
  const [activeTab, setActiveTab] = useState("campaigns");
  const { user } = useRemoteUserStore();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const [pageSize, setPageSize] = useState<number>(10);
  const [campaignGroupList, setCampaignGroupList] = useState<[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(
    activeTab === "campaigns" ? campaignList : campaignGroupList,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pages = chunkArray(filteredData, pageSize);
  const [isSubmitting, setisSubmititng] = useState(false);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [openQuestion, setOpenQuestion] = useState<boolean>(false);

  const [openSumit, setOpenSubmit] = useState<boolean>(false);
  const [isSubmittingCampaign, setisSubmititngCampaign] =
    useState<boolean>(false);

  const [selectedStatus, setSeletctedStatus] = useState("");
  const {
    show,
    setShow,
    setDescription,
    setId,
    setTitle,
    setStateIds,
    setpayment_rate_for_response,
    setNumberOfresponse,
    setEndDate,
    setStartDate,
    number_of_responses,
    payment_rate_for_response,

    setLgids,
  } = useEditMainCampaignOverlay();
  const deletQuestion = async (id: any) => {
    //setClickedId(id);
    setisSubmititng(true);
    try {
      const response = await deleteQuestionCampaign(campaignId as string, id);

      if (response) {
        toast.success("Question deleted successfully");
        getQuestionByCampaignId();
        setOpenQuestion(false);
      }
    } catch (e) {
      console.log(e);
      toast.error("Error deleting question");
    } finally {
      setisSubmititng(false);
    }
  };

  const handleSubmitCampaign = async () => {
    // setisSubmititng(true);
    setisSubmititngCampaign(true);
    try {
      const response = await submitCampaign(campaignId as string);

      if (response) {
        toast.success("Campaign submitted sucessfully");
        getQuestionByCampaignId();
        setOpenQuestion(false);
      }
    } catch (e) {
      console.log(e);
      /**@ts-ignore **/
      toast.error(e?.response?.data.message || "Error submitting question");
    } finally {
      setisSubmititngCampaign(false);
      setOpenSubmit(false);
    }
  };
  const CampaignTable = ({ tdata }: { tdata: any[] }) => {
    const router = useRouter();

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead className="">Question type</TableHead>
            <TableHead className="">Required</TableHead>

            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tdata?.map((data, index) => (
            <TableRow
              key={index}
              className="cursor-pointer"
              // onClick={() => router.push(`campaigns/${data.id}`)}
            >
              <TableCell>{data?.label}</TableCell>
              <TableCell className="">{data?.type}</TableCell>
              <TableCell className="">
                <SwitchPrimitive.Root
                  id="switch"
                  checked={data.required}
                  onCheckedChange={(checked) => handleToggle(data.id, checked)}
                  className="relative h-6 w-10 rounded-full bg-gray-300 transition"
                >
                  <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 transform rounded-full shadow-md transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-blue-500" />
                </SwitchPrimitive.Root>
              </TableCell>

              <TableCell className="">
                <div className="flex items-center justify-center space-x-2">
                  <span className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F8F8F8] p-2 px-2.5 text-sm text-[#4F4F4F]">
                    <Edit size={18} onClick={() => {}} /> Edit
                  </span>
                  <span
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#FF4C4C14] p-2 px-2.5 text-sm text-[#FF4C4C]"
                    onClick={() => {
                      setClickedId(data.id);
                      setOpenQuestion(true);
                    }}
                  >
                    <Trash size={18} />{" "}
                    {isSubmitting && clickedId === data.id ? (
                      <FaSpinner className="animate-spin text-[#FF4C4C]" />
                    ) : (
                      "Delete"
                    )}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const CampaignGroupTable = ({ tdata }: { tdata: any[] }) => {
    // const { setShow, setTitle, setDescription, setId } = useEditCampaignOverlay();

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contributor</TableHead>
              <TableHead className="">Location</TableHead>

              <TableHead className="table-cell">Date submitted</TableHead>

              <TableHead className="">Status</TableHead>
              <TableHead className=""></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tdata?.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data?.contributor}</TableCell>
                <TableCell className="">{data?.location}</TableCell>

                <TableCell className="">
                  {moment(data?.created_at).format("DD MMMM YYYY hh:mm A")}
                </TableCell>

                <TableCell className=" ">
                  <StatusPill status={data.status} />
                </TableCell>
                <TableCell className="">
                  <Link href={`response/${data.id}`}>
                    <span className="inline-flex cursor-pointer items-center gap-2 text-nowrap rounded-full p-2 px-2.5 text-sm text-[#4F4F4F]">
                      <Eye size={20} /> View response
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };
  const renderTable = (tab: string, tdata: any[]) => {
    switch (tab.toLowerCase()) {
      case "campaigns":
        return <CampaignTable tdata={tdata} />;

      case "campaign-groups":
        return <CampaignGroupTable tdata={tdata} />;

      default:
        break;
    }
  };

  const currentPageData = pages[currentPage - 1] || [];
  const {
    data: task,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["Get task"],
    queryFn: async () => await getCampaignByIdDetails(campaignId as string),
  });
  // console.log(responseId, "responseId");
  const { data: getResponse, refetch: refetchResponse } = useQuery({
    queryKey: ["get a Campaign", responseId],
    queryFn: async () =>
      responseId ? await getCampaignByIdDetails(responseId) : null,
    enabled: !!responseId,
  });

  //@ts-ignore
  const locations = useMemo(
    () => task?.data?.locations?.states?.map((state: any) => state.label),
    [task],
  );
  //@ts-ignore
  const responses = useMemo(() => task?.data?.responses, [task]);

  const getQuestionByCampaignId = async () => {
    try {
      const response = await getCampaignQuestions(campaignId as string);

      if (response) {
        //@ts-ignore
        const groupedQuestions =
          //@ts-ignore
          response.question_groups?.flatMap((group) => group.questions) || [];
        //@ts-ignore
        const ungroupedQuestions = response.ungrouped_questions || [];

        const allQuestions = [...groupedQuestions, ...ungroupedQuestions];

        //@ts-ignore
        setCampaignList(allQuestions);
      }

      console.log(response, "response");
    } catch (error) {
      console.error("Error fetching campaign questions:", error);
    }
  };

  const getQuestionResponse = async () => {
    try {
      const response = await getAllResponseByCampaign(campaignId as string);
      console.log(response);
      //@ts-ignore
      setCampaignGroupList(response.data.responses);

      //@ts-ignore
      console.log(response.data.responses, "response");

      //console.log(response, "response");
    } catch (error) {
      console.error("Error fetching campaign questions:", error);
    }
  };

  useEffect(() => {
    getQuestionByCampaignId();
    getQuestionResponse();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "campaigns") {
      setFilteredData(campaignList);
    } else if (activeTab === "campaign-groups") {
      setFilteredData(campaignGroupList);
    }
  }, [activeTab, campaignList, campaignGroupList]);

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
    queryKey: ["campaign questions", campaignId], // The key used for caching
    queryFn: () => getCampaignQuestion(campaignId as string), // Function to fetch data
    enabled: !!campaignId, // Ensures the query only runs when campaignId exists
    retry: 2, // Retry failed queries up to 2 times
  });

  const handleStatusCampaign = (status: any) => {
    setSeletctedStatus(status);
    setOpen(true);
  };

  const updateCampaignStatus = async (status: string) => {
    setisSubmititngCampaign(true);
    try {
      const response = await updateCampaignByStatus(
        campaignId as string,
        //@ts-ignore
        selectedStatus,
      );
      toast.success(`Campaign status changed successfully`);
      setOpen(false);
      refetchResponse();
    } catch (e) {
      console.log(e);
      toast.error("Error updating status");
      setOpen(false);
    } finally {
      setisSubmititngCampaign(false);
    }
  };
  const updateStepUrl = (newStep: number) => {
    router.push(`${window.location.pathname}?stepper=true&step=${newStep}`);
  };

  //@ts-ignore
  const locationData = task?.data?.locations;
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
  const Date = moment(task?.data?.starts_at).format("DD MMMM YYYY");
  //@ts-ignore
  const Time = moment(task?.data?.starts_at).format("hh:mm A");

  const endDate = moment(task?.data?.ends_at).format("DD MMMM YYYY");
  //@ts-ignore
  const endTime = moment(task?.data?.ends_at).format("hh:mm A");

  const createdDate = moment(task?.data?.created_at).format("DD MMMM YYYY");
  //@ts-ignore
  const createdTime = moment(task?.data?.created_at).format("hh:mm A");

  if (isLoading) {
    return <SkeletonLoader />;
  }
  console.log(task?.data.states);
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "running":
        return "bg-orange-400/5 border-orange-400 text-orange-400";
      case "completed":
        return "bg-emerald-600/5 border-emerald-600 text-emerald-600";
      case "archived":
        return "bg-red-500/5 border-red-500 text-red-500";
      case "draft":
        return "bg-gray-500/5 border-gray-500 text-gray-500";
    }
  };

  const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
    return (
      <span
        className={cn(
          "inline-flex w-20 items-center justify-center rounded-full border px-2 py-1 text-xs font-medium",
          getStatusColor(status),
        )}
      >
        {getStatusText(status)}
      </span>
    );
  };
  const StatusButtonBubble = () => {
    return (
      <div className="flex w-full items-center justify-center gap-[14px]">
        {/**** BUTTON PAUSE RUNNING STATUS */}

        {task?.data?.status === "running" && (
          <div
            className="flex cursor-pointer justify-center gap-2 rounded-full bg-[#FFEDED] px-8 py-3 font-poppins text-base text-[#FF4C4C]"
            onClick={() => handleStatusCampaign("paused")}
          >
            <EyeSlash size={20} />
            Pause
          </div>
        )}
        {task?.data?.status === "paused" && (
          <div
            className="flex cursor-pointer justify-center gap-2 rounded-full border border-blue-600 px-8 py-3 font-poppins text-base text-blue-600"
            onClick={() => handleStatusCampaign("running")}
          >
            <Play size={20} />
            Run
          </div>
        )}
        {task?.data?.status === "draft" && (
          <div
            className="flex w-full cursor-pointer justify-center gap-2 rounded-full border border-blue-600 px-8 py-3 font-poppins text-base text-blue-600"
            onClick={() => {
              setTitle(task?.data.title);
              setDescription(task?.data.description);
              setStateIds(
                task?.data.locations.states
                  ? task.data.locations.states.map((state: any) => state.id)
                  : [],
              );
              setLgids(
                task?.data.locations.states
                  ? task.data.locations.states.flatMap(
                      (state: any) =>
                        state.lgas?.map((lga: any) => lga.id) || [],
                    )
                  : [],
              );

              setpayment_rate_for_response(
                task?.data.payment_rate_for_response,
              );
              setStartDate(task?.data.starts_at);
              setId(task?.data.id);
              setEndDate(task?.data.ends_at);
              setNumberOfresponse(task?.data.number_of_responses);
              setShow(true);
            }}
          >
            <Edit size={20} />
            <span className="text-nowrap">Edit campaign</span>
          </div>
        )}
        {task?.data?.status === "draft" && (
          <div
            className="flex w-full cursor-pointer justify-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-8 py-3 font-poppins text-base text-white"
            onClick={() => setOpenSubmit(true)}
          >
            <Edit size={20} />
            {isSubmittingCampaign ? (
              <FaSpinner className="animate-spin text-blue-600" />
            ) : (
              <span className="text-nowrap">Submit for approval</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    {
      label: "Questions",
      value: "campaigns",
    },
    {
      label: "Response",
      value: "campaign-groups",
    },
  ];
  const QuestionBubbleButton: {
    icon: LucideIcon;
    title: string;
    href: string;
  }[] = [
    {
      icon: ArrowUpDown,
      title: "Rearrange",
      href: `/organization/dashboard/campaigns/questions?questionId=${campaignId}`,
    },
    {
      icon: EyeIcon,
      title: "Preview",
      href: `/organization/dashboard/campaigns/questions?questionId=${campaignId}`,
    },
    {
      icon: Plus,
      title: "Add question",
      href: `/organization/dashboard/campaigns/questions?questionId=${campaignId}`,
    },
    /**
    {
      icon: Settings,
      title: "Generate with AI",
      href: "/dashboard/settings",
    },
     */
  ];
  const handleToggle = (id: any, checked: any) => {};
  return (
    <>
      <CampaignButton
        open={open}
        setOpen={setOpen}
        status={selectedStatus}
        action={updateCampaignStatus}
        isSubmitting={isSubmittingCampaign}
      />

      <UpdateCampaignDialog
        title={"Delete Question"}
        content={"Are you sure you want to delete this question?"}
        action={() => deletQuestion(clickedId)}
        open={openQuestion}
        setOpen={setOpenQuestion}
        status="delete"
        isSubmitting={isSubmitting}
      />

      <UpdateCampaignDialog
        title={"Submit Campaign"}
        content={"Are you sure you want to submit this campaign?"}
        action={handleSubmitCampaign}
        open={openSumit}
        setOpen={setOpenSubmit}
        isSubmitting={isSubmittingCampaign}
        status="submit"
      />

      <EditMainCampaign />

      <Toaster richColors position={"top-right"} />
      <section className="space-y-4 py-8 pt-[34px]">
        <div className="flex items-center justify-between">
          <CustomBreadCrumbs />
          <div className="fex items-center gap-[14px]">
            <StatusButtonBubble />
          </div>
        </div>

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
                    alt="campaign image"
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
              {/***
              <div className="hidden items-center justify-center space-x-2 md:flex">

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
              */}
              <div>{<StatusPill status={task?.data?.status} />}</div>
            </div>

            {/* -- Details */}
            <div className="grid h-[30%] gap-4">
              <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Campaign Details
                </h3>
                <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
                  <div>
                    <h4 className="text-[#101828]">
                      {USER_CURRENCY_SYMBOL} {/* @ts-ignore */}
                      {task?.data?.payment_rate_for_response}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Per response</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.type}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign type </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.number_of_responses}
                    </h4>
                    <p className="text-sm text-gray-400">Number of response</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#101828]">{locations}</h4>
                    <p className="text-sm text-gray-400">Location</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.number_of_responses_received}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Number of response received
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.number_of_pending_responses}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Number of pending response
                    </p>
                  </div>
                  <div className="md:text-left">
                    <h4 className="font-medium text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.campaign_group}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign group</p>
                  </div>
                  <div className="">
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#101828]">{Date}</h4>
                      <div className="font-medium text-[#101828]">
                        <Dot size={30} />
                      </div>
                      <span className="font-medium text-[#101828]">{Time}</span>
                    </div>
                    <p className="text-sm text-gray-400">Starts on</p>
                  </div>
                  <div className="">
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#101828]">{endDate}</h4>
                      <div className="font-medium text-[#101828]">
                        <Dot size={30} />
                      </div>
                      <span className="font-medium text-[#101828]">
                        {endTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Ends on</p>
                  </div>
                  <div className="">
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#101828]">
                        {createdDate}
                      </h4>
                      <div className="font-medium text-[#101828]">
                        <Dot size={30} />
                      </div>
                      <span className="font-medium text-[#101828]">
                        {createdTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">Created</p>
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
            </div>

            {/* ####################################### */}
            {/* -- Tasks section */}
            {/* ####################################### */}
            <div className="col-span-5 mt-8 flex justify-center">
              <div>
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => setActiveTab(val)}
                  className="w-full justify-center md:w-max"
                >
                  <TabsList
                    className={cn(
                      "w-full justify-start rounded-full bg-[#fff] px-1 py-6 sm:w-auto md:justify-center",
                    )}
                  >
                    {tabs.map((tab: any, index: number) => (
                      <TabsTrigger
                        value={tab?.value}
                        key={index}
                        className={cn(
                          "flex-grow rounded-full px-6 py-2.5 text-sm font-normal data-[state=active]:bg-blue-700 data-[state=active]:text-white sm:flex-grow-0",
                        )}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}{" "}
                  </TabsList>
                </Tabs>
              </div>

              {/* TABLE DATA */}

              {/* Task list */}
              {/* <div className="grid gap-5 md:grid-cols-2 1xl:grid-cols-3 xl:grid-cols-3">
                {tasks.map((task: any, index: number) => (
                  <TaskCardWidget {...task} key={index} />
                ))}
              </div> */}
            </div>
            <div className="flex flex-col gap-[10px] rounded-[16px] bg-white p-6">
              <div className="mb-2 mt-2 flex items-center justify-between">
                {activeTab === "campaigns" ? (
                  <h3 className="font-Satoshi text-2xl font-bold text-[#101828]">
                    {filteredData?.length} Questions
                  </h3>
                ) : (
                  <div className="flex w-full items-center justify-between">
                    <h3 className="font-Satoshi text-2xl font-bold text-[#101828]">
                      {filteredData?.length} Contributors
                    </h3>

                    <ResponseOptions />
                  </div>
                )}

                {activeTab === "campaigns" && (
                  <div className="flex items-center gap-[13px]">
                    {QuestionBubbleButton.map((item, index) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="transit flex items-center gap-3 text-gray-500 hover:text-gray-800"
                      >
                        <div
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#EBEBEB] px-3 py-2"
                          key={index}
                        >
                          <item.icon size={20} strokeWidth={1.5} />
                          {item.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {renderTable(activeTab, currentPageData)}

              <div className="mt-6">
                <Pagination
                  // @ts-ignore
                  totalPages={currentPageData.length}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onRowSizeChange={setPageSize}
                />
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default CampaignDetails;
