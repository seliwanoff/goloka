"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chunkArray, cn } from "@/lib/utils";
import { Eye, Note } from "iconsax-react";
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
import CreateCampaingGroup from "@/components/lib/modals/create_campaign_group";

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
import Link from "next/link";
import {
  useAddcampaignGroupOverlay,
  useEditCampaignOverlay,
} from "@/stores/overlay";
import EditCampaign from "@/components/lib/modals/edit_campaign";
import { getCampaign, getOrganizationCampaign } from "@/services/campaign";

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

const Page = () => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [campaignList, setCampaignList] = useState<[]>([]);

  const [activeTab, setActiveTab] = useState("campaigns");
  const [date, setDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [campaignGroupList, setCampaignGroupList] = useState<[]>([]);

  const [filteredData, setFilteredData] = useState<any[]>(
    activeTab === "campaigns" ? campaignList : campaignGroupList,
  );
  const pages = chunkArray(filteredData, pageSize);
  const currentPageData = pages[currentPage - 1] || [];
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const { setShowCreate } = useAddcampaignGroupOverlay();

  const { show } = useAddcampaignGroupOverlay();

  const { isShowEdit } = useEditCampaignOverlay();

  const getCampaignGroup = async () => {
    try {
      const response = await getOrganizationCampaign();
      if (response && response.data) {
        setCampaignGroupList(response.data);
      } else {
        console.warn("Response is null or does not contain data");
      }
    } catch (error) {
      console.error("Error fetching campaign groups:", error);
    }
  };
  const getCampaignMain = async () => {
    try {
      const response = await getCampaign();
      if (response && response.data) {
        setCampaignList(response.data);
      } else {
        console.warn("Response is null or does not contain data");
      }
    } catch (error) {
      console.error("Error fetching campaign groups:", error);
    }
  };
  useEffect(() => {
    getCampaignGroup();
    getCampaignMain();
  }, [show, isShowEdit]);

  useEffect(() => {
    function filter(status: string) {
      return campaignList?.filter(
        (item: any) => item?.status.toLowerCase() === status,
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

  useEffect(() => {
    if (activeTab === "campaigns") {
      setFilteredData(campaignList);
    } else if (activeTab === "campaign-groups") {
      setFilteredData(campaignGroupList);
    }
  }, [activeTab, campaignList, campaignGroupList]);

  return (
    <>
      {/*** Edit Campaign */}
      <EditCampaign />

      {/*** CREATE CAMPAIGN GROUP */}

      <CreateCampaingGroup />

      {/*** DELETE MODAL */}

      <section className="mt-5">
        {/* HEADING */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-main-100">Campaigns</h2>

          <div className="inline-flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-[50px] border-main-100 font-Satoshi text-main-100"
              onClick={() => setShowCreate(true)}
            >
              Create campaign group
            </Button>
            <Link href="/organization/dashboard/campaigns/create">
              <Button
                variant="outline"
                className="items-center gap-2 rounded-[50px] bg-main-100 font-Satoshi text-white"
              >
                <span>
                  <Note />
                </span>
                Create new campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* TABLE OPTIONS */}
        <div className="rounded-2xl bg-white p-[14px]">
          {/* OPTIONS */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <div className="flex justify-between gap-4 lg:justify-start">
                {/* -- search section */}
                <div className="relative flex w-[250px] items-center justify-center md:w-[250px]">
                  <Search className="absolute left-3 text-gray-500" size={18} />
                  <Input
                    placeholder="Search task, organization"
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
              <div>
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => setActiveTab(val)}
                  className="w-full md:w-max"
                >
                  <TabsList
                    className={cn(
                      "w-full justify-start rounded-full bg-[#F1F1F1] px-1 py-6 sm:w-auto md:justify-center",
                    )}
                  >
                    {tabs.map((tab: any, index: number) => (
                      <TabsTrigger
                        value={tab?.value}
                        key={index}
                        className={cn(
                          "flex-grow rounded-full py-2.5 text-sm font-normal data-[state=active]:bg-blue-700 data-[state=active]:text-white sm:flex-grow-0",
                        )}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}{" "}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {/* TABLE DATA */}
          <div className="">{renderTable(activeTab, currentPageData)}</div>

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              // @ts-ignore
              totalPages={currentPageData?.length}
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

export default Page;

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
            <TableCell className="">{data?.campaign_group}</TableCell>
            <TableCell className="table-cell">
              {data?.locations?.label}
            </TableCell>
            <TableCell className="">{data?.title}</TableCell>
            <TableCell className=" ">{data?.created_at}</TableCell>
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

const CampaignGroupTable = ({ tdata }: { tdata: any[] }) => {
  const { setShow, setTitle, setDescription, setId } = useEditCampaignOverlay();

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
            <TableCell>{data?.name}</TableCell>
            <TableCell className="">{data?.description}</TableCell>

            <TableCell className="">{data?.campaign_count}</TableCell>

            <TableCell className=" ">{data?.updated_at}</TableCell>
            <TableCell className="">
              <Link
                href={`/organization/dashboard/campaigns/profile?campaignId=${data.id}`}
              >
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
                    setTitle(data?.name);
                    setId(data?.id);
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

/***

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
**/
{
  /**
const campaignGroupList = [
  {
    title: "Dataphyte customers",
    description: "Data on Dataphyte products user and their feedback",
    totalCampaign: "24",
    lastUpdated: "Tue 28th June",
  },
];
*/
}
