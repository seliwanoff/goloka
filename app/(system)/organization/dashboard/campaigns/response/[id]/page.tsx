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
  NotepadText,
  Play,
  Plus,
  Settings,
  SquarePen,
  Trash,
  UserRound,
  Workflow,
} from "lucide-react";
import {
  ArchiveMinus,
  CloseCircle,
  Danger,
  DocumentText,
  EyeSlash,
  Note,
} from "iconsax-react";
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
  getResponseDetails,
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
  updateResponseStatus,
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
import ResponseMessageModal from "@/components/lib/modals/message_repone_modal";
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

const ViewResponse: React.FC<PageProps> = ({}) => {
  const [isStepper, setIsStepper] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: responseId } = useParams();
  //  const [responseId, setResponseId] = useState<string | null>(null);
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
  const [openReview, setOpenReview] = useState<boolean>(false);
  const [openMessage, setOpenMessage] = useState(true);

  const [openSumit, setOpenSubmit] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isSubmittingCampaign, setisSubmititngCampaign] =
    useState<boolean>(false);
  const [message, setMessage] = useState("");

  const [selectedStatus, setSeletctedStatus] = useState("");
  const [step, setStep] = useState(1);
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
  const handleUpdateResponseStatus = async (status: string) => {
    //setClickedId(id);
    setisSubmititng(true);
    try {
      const response = await updateResponseStatus(
        responseId as string,
        status,
        message,
      );
      refetchResponse();

      if (response) {
        toast.success("Response updated successfully");

        // setOpenQuestion(false);
      }
    } catch (e) {
      console.log(e);
      toast.error("Error updating response");
    } finally {
      refetchResponse();

      setOpen(false);
      setStep(0);
      setOpenMessage(false);
      setisSubmititng(false);
      setOpenQuestion(false);
      setOpenReview(false);
      setOpenSubmit(false);
    }
  };
  //console.log(step);

  const handleUpdateResponseStatusbyReviewandReject = async (
    status: string,
  ) => {
    if (status === "rejected") {
      setStep(2);
      setCurrentStatus(status);
      setOpenMessage(true);
    }
    if (status === "reviewed") {
      setStep(2);
      setCurrentStatus(status);
      setOpenMessage(true);
    }
    /***
    //setClickedId(id);
    setisSubmititng(true);
    try {
      const response = await updateResponseStatus(responseId as string, status);

      if (response) {
        toast.success("Response updated successfully");

        // setOpenQuestion(false);
      }
    } catch (e) {
      console.log(e);
      toast.error("Error updating response");
    } finally {
      setisSubmititng(false);
      setOpenQuestion(false);
      setOpenReview(false);
      setOpenSubmit(false);
    }
      */
  };

  const handleSubmitCampaign = async () => {
    // setisSubmititng(true);
    setisSubmititngCampaign(true);
    try {
      const response = await submitCampaign(responseId as string);

      if (response) {
        toast.success("Campaign submitted sucessfully");
        getQuestionByresponseId();
        setOpenQuestion(false);
      }
    } catch (e) {
      console.log(e);
      toast.error("Error submitting campaign");
    } finally {
      setisSubmititngCampaign(false);
    }
  };
  const CampaignTable = ({ tdata }: { tdata: any[] }) => {
    const router = useRouter();

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead className="">Answer</TableHead>

            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {task?.data?.answers?.map((data: any, index: any) => (
            <TableRow
              key={index}
              className="cursor-pointer"
              // onClick={() => router.push(`campaigns/${data.id}`)}
            >
              <TableCell>{data?.question.label}</TableCell>
              <TableCell className="">{"answer"}</TableCell>
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
                <TableCell>{data?.organization}</TableCell>
                <TableCell className="">{data?.campaign_title}</TableCell>

                <TableCell className="">
                  {moment(data?.created_at).format("DD MMMM YYYY hh:mm A")}
                </TableCell>

                <TableCell className=" ">
                  <StatusPill status={data.status} />
                </TableCell>
                <TableCell className="">
                  <Link href={``}>
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
    queryKey: ["Get Response"],
    queryFn: async () => await getResponseDetails(responseId as string),
  });
  // console.log(responseId, "responseId");
  const { data: getResponse, refetch: refetchResponse } = useQuery({
    queryKey: ["get a Campaign", responseId],
    queryFn: async () =>
      responseId ? await getResponseDetails(responseId) : null,
    enabled: !!responseId,
  });

  //@ts-ignore
  const locations = useMemo(
    () => task?.data?.locations?.states?.map((state: any) => state.label),
    [task],
  );
  //@ts-ignore
  const responses = useMemo(() => task?.data?.responses, [task]);

  const getQuestionByresponseId = async () => {
    try {
      const response = await getCampaignQuestions(responseId as string);

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
      const response = await getAllResponseByCampaign(responseId as string);
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
    getQuestionByresponseId();
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
    queryKey: ["campaign questions", responseId], // The key used for caching
    queryFn: () => getCampaignQuestion(responseId as string), // Function to fetch data
    enabled: !!responseId, // Ensures the query only runs when responseId exists
    retry: 2, // Retry failed queries up to 2 times
  });

  const handleStatusCampaign = (status: any) => {
    setSeletctedStatus(status);
    setOpen(true);
  };

  const updateCampaignStatus = async (status: string) => {
    try {
      const response = await updateCampaignByStatus(
        responseId as string,
        //@ts-ignore
        selectedStatus === "running" ? "start" : selectedStatus,
      );
      toast.success(`Campaign status changed to ${status}`);
    } catch (e) {
      console.log(e);
      toast.error("Error updating status");
      setOpen(false);
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

  if (isLoading) {
    return <SkeletonLoader />;
  }
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "running":
        return "bg-orange-400/5 border-orange-400 text-orange-400";
      case "completed":
        return "bg-emerald-600/5 border-emerald-600 text-emerald-600";
      case "rejected":
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
        {task?.data?.status !== "rejected" && (
          <div
            className="flex cursor-pointer justify-center gap-2 rounded-full bg-[#FFEDED] px-8 py-3 font-poppins text-base text-[#FF4C4C]"
            onClick={() => setOpenQuestion(true)}
          >
            <Danger size={20} />
            Reject
          </div>
        )}
        {task?.data?.status !== "reviewed" && (
          <div
            className="flex cursor-pointer justify-center gap-2 rounded-full border border-blue-600 px-8 py-3 font-poppins text-base text-blue-600"
            onClick={() => setOpenReview(true)}
          >
            <DocumentText size={20} />
            Review
          </div>
        )}

        <div
          className="flex w-full cursor-pointer justify-center gap-2 rounded-full border border-blue-600 bg-blue-600 px-8 py-3 font-poppins text-base text-white"
          onClick={() => setOpenSubmit(true)}
        >
          <NotepadText size={20} />
          {isSubmittingCampaign ? (
            <FaSpinner className="animate-spin text-blue-600" />
          ) : (
            <span className="text-nowrap">Accept response</span>
          )}
        </div>
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
      href: `/organization/dashboard/campaigns/questions?questionId=${responseId}`,
    },
    {
      icon: EyeIcon,
      title: "Preview",
      href: `/organization/dashboard/campaigns/questions?questionId=${responseId}`,
    },
    {
      icon: Plus,
      title: "Add question",
      href: `/organization/dashboard/campaigns/questions?questionId=${responseId}`,
    },
    /**
    {
      icon: Settings,
      title: "Generate with AI",
      href: "/dashboard/settings",
    },
     */
  ];

  return (
    <>
      <CampaignButton
        open={open}
        setOpen={setOpen}
        status={selectedStatus}
        action={updateCampaignStatus}
        isSubmitting={isSubmitting}
      />

      <UpdateCampaignDialog
        title={"Reject response"}
        content={"Are you sure you want to reject this response?"}
        action={() => handleUpdateResponseStatusbyReviewandReject("rejected")}
        open={openQuestion}
        setOpen={setOpenQuestion}
        isSubmitting={isSubmitting}
        status="reject"
      />
      <UpdateCampaignDialog
        title={"Review response"}
        content={
          "Are you sure you want to reject this response? This user won’t get paid for their contribution"
        }
        action={() => handleUpdateResponseStatusbyReviewandReject("reviewed")}
        open={openReview}
        setOpen={setOpenReview}
        isSubmitting={isSubmitting}
        status="reject"
      />

      {step === 2 && openMessage && (
        <ResponseMessageModal
          title="Enter message"
          content="Provide reason for your actions."
          open={openMessage}
          status={currentStatus}
          setOpen={setOpenMessage}
          isSubmitting={isSubmitting}
          message={message}
          setMessage={setMessage}
          setStep={setStep}
          action={() => handleUpdateResponseStatus(currentStatus)}
        />
      )}

      <UpdateCampaignDialog
        title={"Accept response"}
        content={"Are you sure you want to accept this response?"}
        action={() => handleUpdateResponseStatus("accepted")}
        open={openSumit}
        isSubmitting={isSubmitting}
        setOpen={setOpenSubmit}
        status="accept"
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
              <div className="items-center gap-4">
                <div className="">
                  <h3 className="font-semibold text-neutral-900">
                    {/* @ts-ignore */}
                    {task?.data?.contributor}
                  </h3>
                  <p className="text-sm text-[#828282]">
                    {/* @ts-ignore */}
                    submitted{" "}
                    {moment(task?.data?.created_at).format(
                      "DD MMMM YYYY hh:mm A",
                    )}
                  </p>
                </div>
              </div>

              <div>{<StatusPill status={task?.data?.status} />}</div>
            </div>

            {/* ####################################### */}
            {/* -- Tasks section */}
            {/* ####################################### */}

            <div className="flex flex-col gap-[10px] rounded-[16px] bg-white p-6">
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

export default ViewResponse;
