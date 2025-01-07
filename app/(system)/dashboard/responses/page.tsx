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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar, Setting4 } from "iconsax-react";
import { chunkArray, cn, responseStatus } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
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

type ResponseStatus =
  | "reviewed"
  | "pending"
  | "accepted"
  | "rejected"
  | "draft"
  | "all";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ResponseStatus>(
    (searchParams.get("status") as ResponseStatus) || "all",
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [startDate, setStartDate] = useState<Date | null>(
    searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null,
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("perPage")) || 10,
  );

  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const [data, setData] = useState<DashboardData | null>(null);

  const [date, setDate] = useState<Date>();

  // const pages = chunkArray(filteredData, pageSize);

  const [type, setType] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(9);
  const [min_payment, setmin_payment] = useState<number | undefined>(undefined);
  const responseRef = useRef<HTMLDivElement>(null);
  const [max_payment, setmax_payment] = useState<number | undefined>(undefined);

  const { data: responseData, isLoading } = useQuery({
    queryKey: [
      "responses",
      activeTab !== "all" ? activeTab : undefined,
      searchTerm,
      startDate,
      endDate,
      currentPage,
      pageSize,
    ],
    queryFn: () =>
      getAllResponses({
        page: currentPage,
        per_page: pageSize,
        search: searchTerm,
        start_date: startDate?.toISOString(),
        end_date: endDate?.toISOString(),
        status: activeTab !== "all" ? activeTab : undefined,
      }),
  });

  console.log(responseData, "responseData");
  const { data: stats } = useQuery({
    queryKey: ["Get response stats"],
    queryFn: getResponseStats,
  });
  useEffect(() => {
    if (stats?.data) {
      setData(stats.data);
    }
  }, [stats]);
  const [filteredData, setFilteredData] = useState<Response[]>(
    responseData?.data?.filter(
      (item: { status: string }) => item?.status === activeTab,
    ),
  );
  console.log(stats, "stats");
  useEffect(() => {
    const filter = (status: string) =>
      responseData?.data?.filter(
        (item: { status: string }) => item?.status === status,
      );

    switch (activeTab) {
      case "reviewed":
        return setFilteredData(filter(activeTab));
      case "pending":
        return setFilteredData(filter(activeTab));
      case "accepted":
        return setFilteredData(filter(activeTab));
      case "rejected":
        return setFilteredData(filter(activeTab));
      case "draft":
        return setFilteredData(filter(activeTab));
    }
  }, [activeTab]);

  const updateQueryParams = (key: string, value: string | null) => {
    const queryParams = new URLSearchParams(window.location.search);

    if (value) {
      queryParams.set(key, value); // Add or update parameter
    } else {
      queryParams.delete(key); // Remove parameter if value is null
    }

    // Update the URL without reloading
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${queryParams.toString()}`,
    );
  };

  useEffect(() => {
    const params = new URLSearchParams();

    // Add non-default values to params
    if (searchTerm) params.set("search", searchTerm);
    if (activeTab !== "all") params.set("status", activeTab);
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    if (currentPage !== 1) params.set("page", currentPage.toString());
    if (pageSize !== 10) params.set("perPage", pageSize.toString());

    // Update URL without reload
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }, [searchTerm, activeTab, startDate, endDate, currentPage, pageSize]);

  const tabs: { label: string; value: ResponseStatus }[] = [
    { label: "All", value: "all" },
    { label: "On Review", value: "reviewed" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
    { label: "Draft", value: "draft" },
  ];
  const pages = chunkArray(filteredData, pageSize);
  console.log(responseData, "responseData");
  // console.log(res, "res");
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
            onValueChange={(tab: string) => setActiveTab(tab as ResponseStatus)}
            className="mb-6 mt-7 w-full md:mt-12 md:w-max"
          >
            <TabsList className="w-full justify-start rounded-full bg-white px-1 py-6 sm:w-auto md:justify-center">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-grow rounded-full py-2.5 text-sm font-normal data-[state=active]:bg-blue-700 data-[state=active]:text-white sm:flex-grow-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
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
                placeholder="Search campaign, organization"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full bg-gray-50 pl-10"
              />
            </div>

            <div className="hidden lg:flex lg:gap-4">
              {/* DATE RANGE */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    //@ts-ignore
                    variant="outline"
                    className={cn(
                      "w-min justify-start gap-3 rounded-full px-3 pr-1 text-center text-sm font-normal",
                    )}
                  >
                    {startDate && endDate
                      ? `${format(startDate, "PPP")} - ${format(endDate, "PPP")}`
                      : "Select date range"}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                      <Calendar size={20} color="#828282" />
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-4">
                  <div className="flex flex-col items-center gap-4">
                    <CalenderDate
                      mode="range"
                      //@ts-ignore
                      selected={{ from: startDate, to: endDate }}
                      onSelect={(range) => {
                        setStartDate(range?.from || null);
                        setEndDate(range?.to || null);
                      }}
                      initialFocus
                    />

                    <div className="flex w-full items-center justify-between">
                      <button
                        className="rounded-full bg-[#F8F8F8] px-2 py-1 text-sm text-blue-500"
                        onClick={() => {
                          updateQueryParams("startDate", null);
                          updateQueryParams("endDate", null);
                          setStartDate(null);
                          setEndDate(null);
                        }}
                      >
                        Clear
                      </button>
                      <button
                        className="rounded-full bg-blue-500 px-2 py-1 text-sm text-[#F8F8F8]"
                        // onClick={applyFilters}
                        onClick={() => {
                          // Update the URL with the selected dates
                          const params = new URLSearchParams(
                            window.location.search,
                          );
                          if (startDate)
                            params.set("startDate", startDate.toISOString());
                          if (endDate)
                            params.set("endDate", endDate.toISOString());
                          window.history.replaceState(
                            null,
                            "",
                            `${window.location.pathname}?${params.toString()}`,
                          );
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
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
                              {formatResponseTime(res?.created_at)}
                            </span>
                          </div>{" "}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatResponseDate(res?.created_at)} -{" "}
                          {formatResponseTime(res?.created_at)}
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
                //@ts-ignore
                totalItems={responseData?.pagination?.total_items || 0}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onRowSizeChange={setPageSize}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResponsesPage;


interface StatusPillProps {
  status: Status;
}

// StatusPill component
const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium",
        getStatusColor(status),
      )}
    >
      {getStatusText(status)}
    </span>
  );
};
