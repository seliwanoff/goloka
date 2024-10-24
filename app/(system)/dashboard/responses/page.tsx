"use client";
import DashboardWidget from "@/components/lib/widgets/dashboard_card";
import { DocumentCopy, Eye, Note, NoteRemove, TickSquare } from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, Search } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar, Setting4 } from "iconsax-react";
import { responsesTableData } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/lib/widgets/DataTable";
import { chunkArray, cn, responseStatus } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Pagination from "@/components/lib/navigation/Pagination";
import { useQuery } from "@tanstack/react-query";
import { getAllResponses, getResponseStats } from "@/services/response";

import {
  formatResponseDate,
  formatResponseTime,
  getStatusColor,
  getStatusText,
  numberWithCommas,
  Status,
} from "@/helper";
import { SkeletonXLoader } from "@/helper/loader";

type PageProps = {};

type Response = {
  campaign_id: number;
  campaign_title: string;
  created_at: string; // Assuming it's a date string in ISO or a similar format
  id: number;
  organization: string;
  payment_rate_for_response: string; // If it's stored as a string, not a number
  status: "draft" | "published" | "archived"; // Example of string literal types for status
  unread_messages_count: number;
};

type Stats = {
  count: number;
  percentage_increase: number;
};

type DashboardData = {
  data: {
    campaign_count: Stats;
    response_stats: Stats;
    accepted_response_stats: Stats;
    rejected_response_stats: Stats;
  };
};

const ResponsesPage: React.FC<PageProps> = ({}) => {
  const fetchData = () => {
    return getAllResponses({
      // search: debouncedSearchTerm,
      // type,
      // page,
      // per_page: perPage,
      // min_price: min_payment,
      // max_price: max_payment,
    });
  };
  const {
    data: responseData,
    isLoading,
    isFetching,
    isRefetching,
  } = useQuery({
    queryKey: [
      "Get task list",
      //    debouncedSearchTerm,
      //    type,
      //    page,
      //    perPage,
      //    min_payment,
      //    max_payment,
    ],
    queryFn: fetchData,
  });

  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("On Review");
  const [filteredData, setFilteredData] = useState<Response[]>(
    responseData?.data?.filter(
      (item: { status: string }) => item?.status === activeTab,
    ),
  );
  const [data, setData] = useState<DashboardData | null>(null);

  const [date, setDate] = useState<Date>();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const pages = chunkArray(filteredData, pageSize);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(9);
  const [min_payment, setmin_payment] = useState<number | undefined>(undefined);
  const responseRef = useRef<HTMLDivElement>(null);
  const [max_payment, setmax_payment] = useState<number | undefined>(undefined);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);
  console.log(pages, "pages");
  const { data: stats } = useQuery({
    queryKey: ["Get response stats"],
    queryFn: getResponseStats,
  });
  useEffect(() => {
    if (stats?.data) {
      setData(stats.data);
    }
  }, [stats]);

  console.log(stats, "stats");
  useEffect(() => {
    const filter = (status: string) =>
      responseData?.data?.filter(
        (item: { status: string }) => item?.status === status,
      );

    switch (activeTab) {
      case "On Review":
        return setFilteredData(filter(activeTab));
      case "Pending":
        return setFilteredData(filter(activeTab));
      case "Accepted":
        return setFilteredData(filter(activeTab));
      case "Rejected":
        return setFilteredData(filter(activeTab));
    }
  }, [activeTab]);

  useEffect(() => {
    const params = {
      search: debouncedSearchTerm,
      type,
      page,
      per_page: perPage,
      min_price: min_payment,
      max_price: max_payment,
    };

    const newParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value.toString());
    });

    router.push(`?${newParams.toString()}`);

    // Fetch tasks with updated params
    //  if (tasksRef.current && searchTerm) {
    //    tasksRef.current.scrollIntoView({ behavior: "smooth" });
    //  }
    fetchData();
  }, [
    debouncedSearchTerm,
    type,
    page,
    perPage,
    min_payment,
    max_payment,
    router,
  ]);

  console.log(responseData, "responseData");
  return (
    <>
      <section className="pb-10 pt-[34px]">
        {/* ####################################### */}
        {/* -- stats card section */}
        {/* ####################################### */}
        <div className="no-scrollbar col-span-5 mt-4 w-full overflow-x-auto">
          <div className="col-span-5 flex w-min gap-4 1xl:grid 1xl:grid-cols-4 xl:w-full">
            {/* Projects Card */}
            {!data ? (
              <>
                <SkeletonXLoader />

                <SkeletonXLoader />

                <SkeletonXLoader />

                <SkeletonXLoader />
                {/* <SkeletonXLoader /> */}
              </>
            ) : (
              <>
                <div className="">
                  <DashboardWidget
                    title="Total response"
                    bg="bg-[#079455] bg-opacity-[12%]"
                    fg="text-[#079455]"
                    icon={DocumentCopy}
                    //@ts-ignore
                    value={numberWithCommas(data?.response_stats.count)}
                    footer="vs last month"
                    isAnalytics
                    increase={true}
                    //@ts-ignore
                    percents={(data?.response_stats.percentage_increase).toString()}
                  />
                </div>
                <div className="">
                  <DashboardWidget
                    title="Total campaign"
                    bg="bg-[#FEC53D] bg-opacity-[12%]"
                    fg="text-[#FEC53D]"
                    icon={Note}
                    //@ts-ignore
                    value={numberWithCommas(data?.campaign_count?.count)}
                    footer="vs last month"
                    isAnalytics
                    increase={true}
                    //@ts-ignore
                    percents={(data?.campaign_count?.percentage_increase).toString()}
                  />
                </div>
                <div className="">
                  <DashboardWidget
                    title="Accepted response"
                    bg="bg-[#7F55DA] bg-opacity-[12%]"
                    fg="text-[#7F55DA]"
                    icon={TickSquare}
                    value={numberWithCommas(
                      //@ts-ignore
                      data?.accepted_response_stats?.count,
                    )}
                    footer="vs last month"
                    isAnalytics
                    increase={true}
                    //@ts-ignore
                    percents={(data?.accepted_response_stats?.percentage_increase).toString()}
                  />
                </div>{" "}
                <div className="">
                  <DashboardWidget
                    title="Rejected response"
                    bg="bg-[#EB5757] bg-opacity-[12%]"
                    fg="text-[#EB5757]"
                    icon={NoteRemove}
                    value={numberWithCommas(
                      //@ts-ignore
                      data?.accepted_response_stats.count,
                    )}
                    footer="vs last month"
                    isAnalytics
                    increase={true}
                    //@ts-ignore
                    percents={(data?.accepted_response_stats.percentage_increase).toString()}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* FILTER TABS */}
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6 mt-7 w-full md:mt-12 md:w-max"
          >
            <TabsList
              className={cn(
                "w-full justify-start rounded-full bg-white px-1 py-6 sm:w-auto md:justify-center",
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

        {/* TABLE */}
        <div className="rounded-2xl bg-white p-[14px]">
          {/* OPTIONS */}
          <div className="mb-5 flex justify-between gap-4 lg:justify-start">
            {/* -- search section */}
            <div className="relative flex w-[250px] items-center justify-center md:w-[300px]">
              <Search className="absolute left-3 text-gray-500" size={18} />
              <Input
                placeholder="Search task, organization"
                type="text"
                className="w-full rounded-full bg-gray-50 pl-10"
              />
            </div>

            <div className="hidden lg:flex lg:gap-4">
              {/* PRICE */}
              <Select>
                <SelectTrigger className="w-min rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="2">$2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* NUMBER */}
              <Popover>
                <PopoverTrigger className="rounded-full border px-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm">Number of question</span>{" "}
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
                    {date ? format(date, "PPP") : <span>End date</span>}
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

              {/* RESPONSE */}
              <Select>
                <SelectTrigger className="w-max rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                  <SelectValue placeholder="Response type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select type</SelectLabel>
                    <SelectItem value="one-time">One-time response</SelectItem>
                    <SelectItem value="multiple">Multiple response</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
          <div className="">
            <Card className="border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Title</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Organisation
                      </TableHead>
                      <TableHead className="table-cell">Amount</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Date submitted
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Status{" "}
                      </TableHead>
                      <TableHead className="hidden lg:table-cell"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responseData?.data?.map((res: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <h4
                              className="w-40 cursor-pointer truncate hover:text-blue-700 hover:underline"
                              onClick={() =>
                                router.push(`/dashboard/responses/${res?.id}`)
                              }
                              title={res.campaign_title} // Tooltip for full text on hover
                            >
                              {res.campaign_title}
                            </h4>

                            <div className="inline-flex items-center gap-2 lg:hidden">
                              <span className="text-[#828282]">
                                {res.organization}
                              </span>
                              {res?.unread_messages_count > 0 && (
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                                  {res?.unread_messages_count}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="inline-flex items-start gap-2">
                            <span className="text-sm">{res.organization}</span>
                            {res?.unread_messages_count > 0 && (
                              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                                {res?.unread_messages_count}
                              </span>
                            )}
                          </div>{" "}
                        </TableCell>

                        <TableCell className="table-cell">
                          <div className="inline-flex flex-col items-start gap-2">
                            <span className="text-sm font-medium lg:font-normal">
                              {res.payment_rate_for_response}
                            </span>
                            <span className="text-xs lg:hidden">
                              {res?.payment_rate_for_response} -{" "}
                              {formatResponseTime(res?.data?.created_at)}
                            </span>
                          </div>{" "}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatResponseDate(res?.data?.created_at)} -{" "}
                          {formatResponseTime(res?.data?.created_at)}
                        </TableCell>
                        <TableCell className={cn("hidden md:table-cell")}>
                          <span>
                            <StatusPill status={res?.status as Status} />
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(`/dashboard/responses/${res?.id}`)
                            }
                          >
                            <Eye size={20} />
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Pagination
                totalPages={pages?.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                RowSize={pageSize}
                onRowSizeChange={setPageSize}
              />
            </div>
          </div>
          {/* <div className="mx-auto hidden py-10 lg:hidden">
            <DataTable columns={columns} data={responsesTableData} />
          </div> */}
        </div>
      </section>
    </>
  );
};

export default ResponsesPage;

const tabs = [
  {
    label: "On Review",
    value: "On Review",
  },
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Accepted",
    value: "Accepted",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
];





// Define props for the StatusPill component
interface StatusPillProps {
  status: Status;
}

// StatusPill component
const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium",
        getStatusColor(status)
      )}
    >
      {getStatusText(status)}
    </span>
  );
};
