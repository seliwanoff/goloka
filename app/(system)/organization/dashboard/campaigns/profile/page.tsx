"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chunkArray, cn } from "@/lib/utils";
import { Eye, Note, ProfileDelete } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { ChevronDown, Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { Calendar, Setting4 } from "iconsax-react";
import DeleteDialog from "@/components/lib/modals/delete_modal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BsThreeDots } from "react-icons/bs";
import Pagination from "@/components/lib/navigation/Pagination";
import { getStatusText } from "@/helper";
import router, { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useAddcampaignGroupOverlay,
  useEditCampaignOverlay,
} from "@/stores/overlay";
import EditCampaign from "@/components/lib/modals/edit_campaign";
import { deleteCampaign, getCampaignById } from "@/services/campaign";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/task-stepper/skeleton";
import { toast } from "sonner";

type ProfileProps = {
  campaignData: any;
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

const ProfilePage: React.FC = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[]>(campaignList);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [date, setDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const pages = chunkArray(filteredData, pageSize);
  const currentPageData = pages[currentPage - 1] || [];
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const { setShow } = useEditCampaignOverlay();
  const [open, setOpen] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [isLoading, setisloading] = useState(false);

  const searchParams = useSearchParams();

  const campaignId = searchParams.get("campaignId") || 0;

  useEffect(() => {
    function filter(status: string) {
      return campaignList?.filter(
        (item) => item?.status.toLowerCase() === status,
      );
    }

    switch (activeStatus.toLowerCase()) {
      case "draft":
        setFilteredData(filter(activeStatus));
        break;
      case "running":
        setFilteredData(filter(activeStatus));
        break;
      case "archived":
        setFilteredData(filter(activeStatus));
        break;
      case "completed":
        setFilteredData(filter(activeStatus));
        break;
      default:
        setFilteredData(campaignList);
    }
  }, [activeStatus]);
  const getCampaign = async () => {
    setisloading(true);
    try {
      const response = await getCampaignById(campaignId);
      console.log(response);
      if (response && response.data) {
        setCampaign(response.data);
        //   setCampaignList(response.data);
      } else {
        console.warn("Response is null or does not contain data");
      }
    } catch (error) {
      console.error("Error fetching campaign groups:", error);
    } finally {
      setisloading(false);
    }
  };
  useEffect(() => {
    getCampaign();
  }, []);
  const router = useRouter();

  useEffect(() => {
    if (activeTab === "campaigns") {
      setFilteredData(campaignList);
    } else if (activeTab === "campaign-groups") {
      setFilteredData(campaignGroupList);
    }
  }, [activeTab]);

  const deleteGroup = async () => {
    try {
      const response = await deleteCampaign(campaignId);
      toast.success("Campagn group deleted succesfully");
      router.push(`/organization/dashboard/campaigns`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
      setShow(false);
    }

    console.log("delete");
  };

  return (
    <>
      {/*** Edit Campaign */}
      <EditCampaign />

      {/*** DELETE GROUP */}

      <DeleteDialog
        title={"Delete group"}
        open={open}
        setOpen={setOpen}
        content={
          "Are you sure you want to delete this group? all campaigns under this group will be moved to campaign page"
        }
        action={deleteGroup}
      />

      <section className="mt-5">
        {/* HEADING */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-main-100">Campaigns</h2>

          <div className="inline-flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-[50px] border-[#FF4C4C] font-Satoshi font-medium leading-6 text-[#FF4C4C]"
              onClick={() => setOpen(true)}
            >
              Delete campaign
            </Button>
            <Button
              variant="outline"
              className="items-center gap-2 rounded-[50px] bg-main-100 font-Satoshi text-white"
              onClick={() => setShow(true)}
            >
              <span>
                <ProfileDelete />
              </span>
              Edit campaign
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton />
        ) : (
          <CampaignDetailsCard campaignData={campaign} />
        )}

        {/* TABLE OPTIONS */}
        <div className="rounded-2xl bg-white p-[14px]">
          {/* OPTIONS */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h2 className="font-poppins text-[20px] font-bold leading-[30px] text-[#101828]">
                Campaign
              </h2>
              <div className="flex justify-between gap-4 lg:justify-start">
                {/* -- search section */}
                <div className="relative flex w-[250px] items-center justify-center md:w-[250px]">
                  <Search className="absolute left-3 text-gray-500" size={18} />
                  <Input
                    placeholder="Search campaign"
                    type="text"
                    className="w-full rounded-full bg-gray-50 pl-10"
                  />
                </div>

                <div className="hidden lg:flex lg:gap-4">
                  {/* Status */}

                  {activeTab !== "campaign-groups" ? (
                    <Select
                      value={activeStatus}
                      onValueChange={setActiveStatus}
                    >
                      <SelectTrigger
                        className={cn(
                          "w-[110px] rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0",
                        )}
                      >
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="running">Running</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <></>
                  )}

                  {/* NUMBER */}
                  <Popover>
                    <PopoverTrigger className="rounded-full border px-3">
                      <div className="inline-flex items-center gap-2">
                        <span className="text-sm">No of question</span>{" "}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px]">
                      <Label htmlFor="number" className="mb-3 inline-block">
                        Input number
                      </Label>
                      <Input
                        name="number"
                        id="number"
                        type="tel"
                        className="form-input w-full appearance-none rounded-lg border border-[#d9dec0] px-4 py-6 placeholder:text-[#828282] focus:border-0 focus:outline-none focus-visible:ring-0"
                        placeholder="0"
                      />
                    </PopoverContent>
                  </Popover>

                  {/* DATE */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-min justify-start gap-3 rounded-full px-3 pr-1 text-center text-sm font-normal",
                        )}
                      >
                        {date ? format(date, "PPP") : <span>Select date</span>}
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                          <Calendar size={20} color="#828282" className="m-0" />
                        </span>{" "}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalenderDate
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* -- filter icon */}
                <div
                  onClick={() => setOpenFilter(true)}
                  className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-full border bg-white p-1 pr-3 lg:hidden"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                    <Setting4 size={20} />
                  </span>
                  <span>Filter</span>
                </div>
              </div>

              {/* FILTER TABS */}
            </div>
          </div>

          {/* TABLE DATA */}
          <div className="">{renderTable(activeTab, currentPageData)}</div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              // @ts-ignore
              totalPages={pages?.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              RowSize={pageSize}
              onRowSizeChange={setPageSize}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;

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

const CampaignTable = ({ tdata }: { tdata: any[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign Title</TableHead>
          <TableHead className="">Campaign Group</TableHead>
          <TableHead className="table-cell">Locations</TableHead>
          <TableHead className="">Responses</TableHead>
          <TableHead className=" ">Last updated </TableHead>
          <TableHead className="">Status</TableHead>
          <TableHead className=""></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tdata?.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data?.title}</TableCell>
            <TableCell className="">{data?.group}</TableCell>
            <TableCell className="table-cell">
              {data?.locations?.join(", ")}
            </TableCell>
            <TableCell className="">{data?.title}</TableCell>
            <TableCell className=" ">{data?.lastUpdated}</TableCell>
            <TableCell className="">
              <StatusPill status={data?.status} />
            </TableCell>
            <TableCell className="">
              <span className="cursor-pointer">
                <BsThreeDots />
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const CampaignDetailsCard: React.FC<ProfileProps> = ({ campaignData }) => {
  return (
    <div className="mb-4 w-full rounded-[16px] bg-white p-[24px]">
      <div className="flex flex-col gap-[16px]">
        <h2 className="font-poppins text-[20px] font-bold text-[#101828]">
          {campaignData && campaignData.name}
        </h2>

        <span className="font-Satoshi text-[14px] font-medium text-[#4F4F4F]">
          {campaignData && campaignData.description}
        </span>
      </div>
    </div>
  );
};

const CampaignGroupTable = ({ tdata }: { tdata: any[] }) => {
  const { setShow, setTitle, setDescription } = useEditCampaignOverlay();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group Title</TableHead>
          <TableHead className="">Description</TableHead>
          <TableHead className="table-cell">Total Campaign</TableHead>
          <TableHead className=" ">Last updated </TableHead>
          <TableHead className="">Action</TableHead>
          <TableHead className=""></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tdata?.map((data, index) => (
          <TableRow key={index}>
            <TableCell>{data?.title}</TableCell>
            <TableCell className="">{data?.description}</TableCell>
            <TableCell className="">{data?.totalCampaign}</TableCell>
            <TableCell className=" ">{data?.lastUpdated}</TableCell>
            <TableCell className="">
              <Link href="/campaign-profile">
                <span className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-main-100/5 p-2 px-2.5 text-sm text-main-100">
                  <Eye size={20} /> View
                </span>
              </Link>
            </TableCell>
            <TableCell className="">
              <span className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#F8F8F8] p-2 px-2.5 text-sm text-[#4F4F4F]">
                <Edit
                  size={20}
                  onClick={() => {
                    setShow(true);
                    setTitle(data?.title);
                    setDescription(data?.description);
                  }}
                />{" "}
                Edit
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export type Status = "draft" | "running" | "completed" | "archived";

interface StatusPillProps {
  status: Status;
}

// StatusPill component
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

const tabs = [
  {
    label: "Campaigns",
    value: "campaigns",
  },
  {
    label: "Campaign Groups",
    value: "campaign-groups",
  },
];

const campaignList = [
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Draft",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Completed",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Archived",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },

  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Draft",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Completed",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Archived",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Draft",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Completed",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Archived",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Draft",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Completed",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Archived",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locationss: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Draft",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Completed",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Archived",
    responses: "184",
  },
  {
    title: "Agriculture & Food Security",
    group: "Agriculture",
    locations: ["Lagos", "Kwara", "Abuja"],
    lastUpdated: "Tue 28th June ",
    status: "Running",
    responses: "184",
  },
];

const campaignGroupList = [
  {
    title: "Dataphyte customers",
    description: "Data on Dataphyte products user and their feedback",
    totalCampaign: "24",
    lastUpdated: "Tue 28th June",
  },
];
