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
  Edit2,
  EllipsisVertical,
  Eye,
  EyeIcon,
  LoaderCircle,
  LucideIcon,
  MoveLeft,
  OctagonAlert,
  Play,
  Plus,
  Settings,
  SquarePen,
  Trash,
  UserRound,
  Workflow,
  X,
} from "lucide-react";
import { ArchiveMinus, EyeSlash, Note } from "iconsax-react";
import Link from "next/link";

import { useStepper } from "@/context/TaskStepperContext.tsx";
import TaskStepper from "@/components/task-stepper/TaskStepper";
import { Toaster } from "@/components/ui/sonner";

import { getCampaignQuestion, getTaskById } from "@/services/contributor";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/lib/navigation/Pagination";
import { useQueryClient } from "@tanstack/react-query";

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
import { getStatusText, numberWithCommas } from "@/helper";
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
  useEditAQuestion,
  useEditMainCampaignOverlay,
  useRearrageQuestion,
  useShowReport,
} from "@/stores/overlay";
import ReArrangeQuestion from "@/components/lib/modals/rearrange_modal";
import EditQuestionModal from "@/components/lib/modals/Edit_question_modal";
import { updateQuestion } from "@/services/campaign/question";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";
import ChatWidget from "@/components/lib/widgets/response-chat-widget";
import { useMediaQuery } from "@react-hook/media-query";
import { getCurrentUser } from "@/services/user";
import ReportModal from "@/components/lib/modals/report_modal";
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
  const queryClient = useQueryClient();

  // const { step } = useStepper();
  const [activeTab, setActiveTab] = useState("campaigns");
  const { user } = useRemoteUserStore();

  const [userId, setUserId] = useState("");
  const { setShowReport, setReportId } = useShowReport();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [openMessages, setOpenMessages] = useState(false);
  const [openMessagesAdmin, setOpenMessagesAdmin] = useState(false);

  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );

  // console.log(user);
  const USER_CURRENCY_SYMBOL =
    currentOrganization && currentOrganization["symbol"];
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
    setGroupId,
    setStartDate,
    number_of_responses,
    payment_rate_for_response,
    setImage,

    setLgids,
  } = useEditMainCampaignOverlay();

  const { setShowQuestionEdit } = useEditAQuestion();
  const { setShowQuestion, showQuestion } = useRearrageQuestion();

  const [selectedQuestion, setSelectedQuestion] = useState([]);
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

  /***
  useEffect(() => {
    const getCurrentUserResponse = async () => {
      const user = await getCurrentUser();
      //   console.log(user);
      //@ts-ignore
      setUserId(user.data.id);
    };
    getCurrentUserResponse();
  }, [setUserId]);

  */
  const handleUpdate = (id: string, required: boolean) => {
    console.log("Heelo");
  };

  const ToggleSwitch = ({
    data,
    onUpdate,
  }: {
    data: {
      id: string;
      required: boolean;
      label: string;
      type: string;
      options: any[];
    };
    onUpdate: (id: string, required: boolean) => void;
  }) => {
    const [localChecked, setLocalChecked] = useState(data.required);

    const handleToggle = async (checked: boolean) => {
      setLocalChecked(checked);
      //  console.log(data.options);

      try {
        await updateQuestion(
          campaignId,
          {
            question_group_id: "",
            required: checked,
            label: data.label,
            name: data.label,
            type: data.type,
            options: data.options
              ? JSON.stringify([...data.options].map((item: any) => item.label))
              : null,
            attributea: null,
          },
          data.id,
        );
        onUpdate(data.id, checked);
        getCampaignQuestions(campaignId as string);
      } catch (error) {
        console.error("Error updating required state:", error);
        setLocalChecked(!checked); // Revert UI if request fails
        toast.error("Failed to update requirement.");
      }
    };

    return (
      <SwitchPrimitive.Root
        id="switch"
        checked={localChecked}
        // onCheckedChange={handleToggle}
        className="relative h-6 w-10 rounded-full bg-gray-300 transition"
      >
        <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 transform rounded-full shadow-md transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-blue-500" />
      </SwitchPrimitive.Root>
    );
  };
  const MessageComponent = () => {
    return (
      <div className="col-span-2 md:col-span-1 md:place-self-end">
        {isDesktop ? (
          <>
            <Sheet open={openMessages} onOpenChange={setOpenMessages}>
              <SheetTrigger asChild className="relative flex justify-end">
                <Button className="h-full w-[150px] gap-3 rounded-full bg-[#3365E314] py-3 font-medium text-main-100 hover:bg-[#3365E314]">
                  Message{" "}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f10] text-xs font-normal text-white">
                    {/* @ts-ignore */}
                    {/***res?.unread_messages_count **/}
                  </span>
                </Button>
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
                    modelType="campaign"
                    modelId={+campaignId}
                    status={task?.data?.status}
                    //@ts-ignore
                    currentUserId={user?.id}
                  />
                </div>
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
                  modelId={+campaignId}
                  status={task?.data?.status}
                  //@ts-ignore
                  currentUserId={user?.id}
                />
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>
    );
  };

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
                    modelType="report"
                    modelId={+campaignId}
                    status={task?.data?.status}
                    //@ts-ignore
                    currentUserId={user?.id}
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
                  modelId={+campaignId}
                  status={task?.data?.status}
                  //@ts-ignore
                  currentUserId={user?.id}
                />
              </DrawerContent>
            </Drawer>
          </>
        )}
      </div>
    );
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
          {[...tdata]
            ?.sort((a, b) => a.order - b.order)
            .map((data, index) => (
              <TableRow
                key={index}
                className="cursor-pointer"
                // onClick={() => router.push(`campaigns/${data.id}`)}
              >
                <TableCell>{data?.label}</TableCell>
                <TableCell className="">{data?.type}</TableCell>
                <TableCell className="">
                  <ToggleSwitch
                    key={data.id}
                    data={data}
                    onUpdate={handleUpdate}
                  />
                </TableCell>

                <TableCell className="">
                  <div className="flex items-center justify-center space-x-2">
                    <span
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F8F8F8] p-2 px-2.5 text-sm text-[#4F4F4F]"
                      onClick={() => {
                        if (task?.data?.status === "draft") {
                          setSelectedQuestion(data);
                          setShowQuestionEdit(true);
                        } else {
                          toast.error(
                            "Your campaign must be in draft for you to edit question(s).",
                          );
                        }
                      }}
                    >
                      <Edit size={18} /> Edit
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
    queryKey: ["Get task", show],
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
  const locations = useMemo(() => {
    //@ts-ignore
    if (!task?.data?.locations) return null;
    //@ts-ignore
    const { label: country, states } = task.data.locations;

    return (
      <div className="flex items-center gap-2">
        {/* Display Country */}
        <span className="rounded-lg bg-gray-200 px-[6px] py-[3px] font-poppins text-[12px] text-[#4F4F4F]">
          {country}
        </span>

        {/* Display States and LGAs */}
        {states?.map((state: any) => (
          <div key={state.label} className="flex items-center gap-2">
            <span className="rounded-lg bg-gray-200 px-[6px] py-[3px] font-poppins text-[12px] text-[#4F4F4F]">
              {state.label}
            </span>

            {/* Display LGAs */}
            {state.lgas?.map((lga: any) => (
              <span
                key={lga.label}
                className="rounded-lg bg-gray-200 px-[6px] py-[3px] font-poppins text-[12px] text-[#4F4F4F]"
              >
                {lga.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }, [task]);

  //@ts-ignore
  const responses = useMemo(() => task?.data?.responses, [task]);

  const getQuestionByCampaignId = async () => {
    try {
      const response = await getCampaignQuestions(campaignId as string);

      if (response) {
        //@ts-ignore
        const groupedQuestions =
          //@ts-ignore
          response.grouped_questions?.flatMap((group) => group.questions) || [];
        //@ts-ignore
        const ungroupedQuestions = response.ungrouped_questions || [];

        //  console.log("ungrouped", grouped_questions)

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
  const handleSubmitCampaign = async () => {
    // setisSubmititng(true);
    setisSubmititngCampaign(true);
    try {
      const response = await submitCampaign(campaignId as string);
      //@ts-ignore
      queryClient.invalidateQueries(["get a Campaign", campaignId as string]);

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
      //@ts-ignore
      queryClient.invalidateQueries(["get a Campaign", campaignId as string]);
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
            Resume
          </div>
        )}

        {task?.data?.status !== "completed" &&
          task?.data?.status !== "running" &&
          task?.data?.status !== "draft" && (
            <div
              className="flex w-fit cursor-pointer justify-center gap-2 text-nowrap rounded-full border border-blue-600 px-8 py-3 font-poppins text-base text-blue-600"
              onClick={() => handleStatusCampaign("draft")}
            >
              <Note size={20} />
              Change to draft
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
              setImage(task.data.image_path[0]);
              setId(task?.data.id);
              setEndDate(task?.data.ends_at);
              setNumberOfresponse(task?.data.number_of_responses);
              setShow(true);
              setGroupId(task?.data?.campaign_group_id);
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
    href?: string;
    action?: () => void;
  }[] = [
    {
      icon: ArrowUpDown,
      title: "Rearrange",
      action: () => {
        setShowQuestion(true);
      },
      //  href: "#",
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

      <EditQuestionModal
        questions={selectedQuestion}
        id={campaignId as string}
        action={getQuestionByCampaignId}
      />

      <ReArrangeQuestion
        questions={campaignList}
        id={campaignId}
        action={getQuestionByCampaignId}
      />

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

              <div>{<StatusPill status={task?.data?.status} />}</div>
            </div>
            <div className="flex w-full items-center justify-end gap-2">
              {task?.data.status === "rejected" && (
                <>
                  <MessageComponentWithAdmin />

                  <MessageComponent />
                </>
              )}

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
                      setReportId(campaignId);
                    }}
                  >
                    <OctagonAlert />
                    <p className="text-[#EB5757]">Report user</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* -- Details */}
            <div className="grid h-[30%] gap-4">
              <div className="mb-4 h-full w-full rounded-2xl bg-white p-5 md:mb-0">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Campaign Details
                </h3>
                <div className="mt-6 flex flex-wrap gap-5 md:justify-between">
                  <div className="basis-[300px]">
                    <h4 className="text-[#101828]">
                      {USER_CURRENCY_SYMBOL} {/* @ts-ignore */}
                      {task?.data?.payment_rate_for_response}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Per response</p>
                  </div>

                  <div className="basis-[300px]">
                    <h4 className="text-[#101828]">
                      {USER_CURRENCY_SYMBOL} {/* @ts-ignore */}
                      {numberWithCommas(task?.data?.campaign_fee)}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign cost</p>
                  </div>

                  <div className="basis-[300px]">
                    <h4 className="text-[#101828]">
                      {USER_CURRENCY_SYMBOL} {/* @ts-ignore */}
                      {numberWithCommas(task?.data?.admin_fee)}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Admin fee</p>
                  </div>
                  <div className="basis-[300px]">
                    <h4 className="text-[#101828]">
                      {USER_CURRENCY_SYMBOL} {/* @ts-ignore */}
                      {numberWithCommas(task?.data?.total_fee)}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Total fee</p>
                  </div>
                  <div className="basis-[300px]">
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.type}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign type </p>
                  </div>

                  <div className="basis-[300px]">
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.number_of_responses}
                    </h4>
                    <p className="text-sm text-gray-400">Number of response</p>
                  </div>
                  <div className="basis-[300px]">
                    <h4 className="flex gap-2 font-medium text-[#101828]">
                      {locations}
                    </h4>
                    <p className="text-sm text-gray-400">Location</p>
                  </div>
                  <div className="basis-[300px]">
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.number_of_responses_received}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Number of response received
                    </p>
                  </div>
                  <div className="basis-[300px]">
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.number_of_pending_responses}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Number of pending response
                    </p>
                  </div>
                  <div className="basis-[300px]">
                    <h4 className="font-medium text-[#101828]">
                      {task?.data?.number_of_pending_responses}
                    </h4>
                    <p className="text-sm text-gray-400">Expected response</p>
                  </div>
                  <div className="basis-[300px] md:text-left">
                    <h4 className="font-medium text-[#101828]">
                      {/* @ts-ignore */}
                      {task?.data?.number_of_responses}{" "}
                    </h4>
                    <p className="text-sm text-gray-400">Campaign group</p>
                  </div>
                  <div className="basis-[300px]">
                    <div className="flex items-center">
                      <h4 className="font-medium text-[#101828]">{Date}</h4>
                      <div className="font-medium text-[#101828]">
                        <Dot size={30} />
                      </div>
                      <span className="font-medium text-[#101828]">{Time}</span>
                    </div>
                    <p className="text-sm text-gray-400">Starts on</p>
                  </div>
                  <div className="basis-[300px]">
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
                  <div className="basis-[300px]">
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
                      {filteredData?.length} Contributions
                    </h3>

                    <ResponseOptions />
                  </div>
                )}

                {activeTab === "campaigns" && (
                  <div className="flex items-center gap-[13px]">
                    {QuestionBubbleButton.map((item, index) => (
                      <Link
                        key={item.title}
                        onClick={item.action}
                        href={item.href || "javascript:void"}
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

      {/****  REPORT MODAL */}

      <ReportModal />
    </>
  );
};

export default CampaignDetails;
