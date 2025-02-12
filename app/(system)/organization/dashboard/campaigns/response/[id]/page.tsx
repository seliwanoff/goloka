"use client";

import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import dropdownData from "@/utils/question";
import Add from "@/components/ui/add";
import MultipleChoices from "@/components/ui/multiple-choices";
import FileUpload from "@/components/task-stepper/fileUpload";
//import Boolean from "@/components/question/boolean";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  // PopoverClose,
} from "@/components/ui/popover";
//import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import {
  Calendar,
  EllipsisVertical,
  MoveLeft,
  OctagonAlert,
  Timer,
  X,
} from "lucide-react";
import { TimePicker } from "@/components/ui/time";
import AudioUpload from "@/components/task-stepper/inputs/audioUpload";
import CheckboxList from "@/components/task-stepper/checkboxOption";
import DynamicSelect from "@/components/task-stepper/dropdownOption";
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
  Message,
  Note,
} from "iconsax-react";
// import Map from "@/public/assets/images/tasks/tasks.png";
import Link from "next/link";

import { useStepper } from "@/context/TaskStepperContext.tsx";
import TaskStepper from "@/components/task-stepper/TaskStepper";
import { Toaster } from "@/components/ui/sonner";

import { getCampaignQuestion, getTaskById } from "@/services/contributor";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
import {
  useEditMainCampaignOverlay,
  useGoogleMap,
  useMediaViewer,
} from "@/stores/overlay";
import ResponseMessageModal from "@/components/lib/modals/message_repone_modal";
import { Input } from "@/components/ui/input";
import RadioSelection from "@/components/ui/radio-select";
import RadioGroupWrapper from "@/components/question/boolean";
import AudioRecorder from "@/components/task-stepper/customAudioRecorder";
import AudioPlayer from "@/components/task-stepper/audioPlayer";
import FileItem from "@/components/ui/FileItem";
import LocationFile from "@/components/ui/location";
import GoogleMapLocationModal from "@/components/lib/modals/google_map_response";
import FileReaderModal from "@/components/lib/modals/fileReader";
import ChatWidget from "@/components/lib/widgets/response-chat-widget";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";
import { useMediaQuery } from "@react-hook/media-query";
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
  const queryClient = useQueryClient();

  const [selectedStatus, setSeletctedStatus] = useState("");
  const [step, setStep] = useState(1);
  const [area, setArea] = useState(["4"]);
  const [location, setLocation] = useState([""]);
  const [line, setLine] = useState(["2"]);
  const [lines] = useState(["", ""]);
  const [areas] = useState(["", "", "", ""]);
  const { show, setShow, setCoordinates, setMethod } = useGoogleMap();
  const { shows, setShows, setType, setUrl } = useMediaViewer();
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [openMessages, setOpenMessages] = useState(false);

  const handleUpdateResponseStatus = async (status: string) => {
    //setClickedId(id);
    setisSubmititng(true);
    try {
      const response = await updateResponseStatus(
        responseId as string,
        status,
        message,
      );
      //  refetchResponse();
      //@ts-ignore
      queryClient.invalidateQueries(["Get Response", responseId as string]);

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
              <TableCell className="">
                {data?.question?.type &&
                  renderQuestionInput(
                    data.question.type,
                    JSON.stringify(data?.value),
                    "preview",
                  )}
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

  console.log(task);

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
      // console.log(response);
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
        {task?.data?.status !== "rejected" &&
          task?.data?.status !== "approved" && (
            <div
              className="flex cursor-pointer justify-center gap-2 rounded-full bg-[#FFEDED] px-8 py-3 font-poppins text-base text-[#FF4C4C]"
              onClick={() => setOpenQuestion(true)}
            >
              <Danger size={20} />
              Reject
            </div>
          )}
        {task?.data?.status !== "reviewed" &&
          task?.data?.status !== "approved" && (
            <div
              className="flex cursor-pointer justify-center gap-2 rounded-full border border-blue-600 px-8 py-3 font-poppins text-base text-blue-600"
              onClick={() => setOpenReview(true)}
            >
              <DocumentText size={20} />
              Review
            </div>
          )}

        {task?.data?.status !== "approved" && (
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
        )}
      </div>
    );
  };

  const handleFileClick = (url: any, type: any) => {
    //alert(`Clicked on`);
    setType(type);
    setUrl(url);
    setShows(true);
  };
  const renderQuestionInput = (
    type: string,
    value: any,
    preview?: any,
    id?: number,
    options?: any,
  ) => {
    //  console.log(preview);
    switch (type) {
      case "text":
        return (
          <div className="text-[14px]]font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "line":
        return (
          <LocationFile
            imageUrl={JSON.parse(value)}
            onClick={() => {
              setMethod("line");
              setCoordinates(JSON.parse(value));
              setShow(true);
            }}
          />
        );
      case "location":
        return (
          <LocationFile
            imageUrl={JSON.parse(value)}
            onClick={() => {
              setCoordinates(JSON.parse(value));
              setShow(true);
            }}
          />
        );
      case "area":
        return (
          <LocationFile
            imageUrl={JSON.parse(value)}
            onClick={() => {
              setMethod("polygon");
              setCoordinates(JSON.parse(value));
              setShow(true);
            }}
          />
        );
      case "textarea":
        return (
          <div className="text-[14px]] w-full font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "select":
        return (
          <MultipleChoices
            label="Select option"
            placeholder="Type something..."
            preview={preview}
            initialOptions={(() => {
              try {
                const parsedValue = value ? JSON.parse(value) : [];

                // Ensure parsedValue is always an array
                const normalizedArray = Array.isArray(parsedValue)
                  ? parsedValue
                  : [parsedValue]; // Wrap single object in array

                return normalizedArray.map((option) =>
                  typeof option === "object" && option !== null
                    ? { ...option, value: option.value }
                    : { value: option },
                );
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
          />
        );
      case "radio":
        return (
          <RadioSelection
            initialOptions={(() => {
              try {
                const parsedValue = value ? JSON.parse(value) : [];

                const normalizedArray = Array.isArray(parsedValue)
                  ? parsedValue
                  : [parsedValue];

                return normalizedArray.map((option) =>
                  typeof option === "object" && option !== null
                    ? { ...option, value: option.value }
                    : { value: option },
                );
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            preview={preview}
          />
        );
      case "checkbox":
        return (
          <CheckboxList
            initialOptions={(() => {
              try {
                const parsedValue = value ? JSON.parse(value) : [];
                return Array.isArray(parsedValue)
                  ? parsedValue.map((option) =>
                      typeof option === "object" && option !== null
                        ? { ...option, value: option.value }
                        : { value: option },
                    )
                  : [];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            preview={preview}
          />
        );
      case "MultipleDrop":
        return (
          <DynamicSelect
            label=" "
            name="country"
            control={""}
            initialOptions={(() => {
              try {
                return options ? options : [];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            placeholder="Enter option"
            onChange={(value: any) => {
              console.log(value);

              // handleAnswerChange(id, value);
            }}
            rules={{ required: "Country is required" }}
            // errors={errors}
          />
        );
      case "video":
        return (
          <FileItem
            imageUrl=""
            fileName="video"
            fileSize="20"
            onClick={() => handleFileClick(JSON.parse(value), "video")}
          />
        );
      case "photo":
        return (
          <FileItem
            imageUrl={JSON.parse(value)}
            fileName="photo"
            fileSize="20"
            onClick={() => handleFileClick(JSON.parse(value), "image")}
          />
        );

      case "file":
        return (
          <FileItem
            imageUrl={JSON.parse(value)}
            fileName="file"
            fileSize="20"
            onClick={() => handleFileClick(JSON.parse(value), "document")}
          />
        );
      case "email":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "url":
        return (
          <Link
            href={`${JSON.parse(value)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {JSON.parse(value)}
          </Link>
        );
      case "password":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "tel":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "number":
        return (
          <div className="text-[14px]] font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "audio":
        return <AudioPlayer src={JSON.parse(value)} />;
      case "boolean":
        return (
          <RadioGroupWrapper
            options={(() => {
              try {
                const parsedOptions = options ? JSON.parse(options) : [];
                return Array.isArray(parsedOptions)
                  ? parsedOptions.map((option) =>
                      typeof option === "object" && option !== null
                        ? {
                            ...option,
                            value: option.value ?? option.label ?? option,
                          }
                        : { label: option, value: option },
                    )
                  : [
                      { label: "True", value: "true" },
                      { label: "False", value: "false" },
                    ];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [
                  { label: "True", value: "true" },
                  { label: "False", value: "false" },
                ];
              }
            })()}
            selectedValue={JSON.parse(value)}
            onChange={() => alert()}
          />
        );
      case "time":
        return (
          <div className="text-[14px]] w-full font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );
      case "date":
        return (
          <div className="text-[14px]] w-full font-poppins text-[#333333]">
            {JSON.parse(value)}
          </div>
        );

      default:
        return null;
    }
  };

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
        action={() => handleUpdateResponseStatus("approved")}
        open={openSumit}
        isSubmitting={isSubmitting}
        setOpen={setOpenSubmit}
        status="accept"
      />

      <EditMainCampaign />

      <GoogleMapLocationModal />

      <FileReaderModal />

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

            {/* MESSAGE CHAT SHEET */}
            <div className="col-span-2 md:col-span-1 md:place-self-end">
              {isDesktop ? (
                <>
                  <Sheet open={openMessages} onOpenChange={setOpenMessages}>
                    <SheetTrigger asChild className="relative flex justify-end">
                      {task?.data?.status !== "draft" &&
                        task?.data?.status !== "approved" && (
                          <Button className="h-full w-[150px] gap-3 rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314]">
                            Message{" "}
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                              {/* @ts-ignore */}
                              {/***res?.unread_messages_count **/}
                            </span>
                          </Button>
                        )}
                    </SheetTrigger>
                    <SheetContent className="border-0 p-0 md:max-w-md lg:max-w-xl">
                      <SheetHeader className="absolute right-0 top-0 z-10 w-full bg-main-100 p-5">
                        <div className="flex items-center gap-5">
                          <div
                            onClick={() => setOpenMessages(false)}
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
                          modelType="response"
                          modelId={+responseId}
                          currentUserId={currentOrganization?.id as number}
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
                </>
              ) : (
                <>
                  <Drawer open={open} onOpenChange={setOpen}>
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
                        modelId={+responseId}
                        currentUserId={currentOrganization?.id as number}
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

            {/* ####################################### */}
            {/* -- Tasks section */}
            {/* ####################################### */}

            <div className="flex flex-col gap-[10px] rounded-[16px] bg-white p-6">
              {renderTable(activeTab, currentPageData)}

              <div className="mt-6">
                <Pagination
                  // @ts-ignore
                  totalPages={task?.data?.answers?.length}
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
