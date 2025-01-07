"use client";
import DashboardWidget from "@/components/lib/widgets/dashboard_card";
import {
  Calendar,
  Calendar1,
  ClipboardExport,
  Note,
  Setting4,
  Task,
  TrendUp,
  Wallet3,
} from "iconsax-react";
import Img from "@/public/assets/images/svg/task-empty-state-icon.svg";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TaskCardWidget from "@/components/lib/widgets/task_card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { MouseEvent, useEffect, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getAllTask, getContributorsProfile } from "@/services/contributor";
import { SkeletonLoader } from "@/components/lib/loader";
import { useRouter, useSearchParams } from "next/navigation";
import { getDashboardStats } from "@/services/response";
import { numberWithCommas } from "@/helper";
import { SkeletonXLoader } from "@/helper/loader";
import React from "react";
import { useRemoteUserStore } from "@/stores/contributors";
import { useUserStore } from "@/stores/currentUserStore";
import { toast } from "sonner";
import Map from "@/components/map/map";
import { useLocationAddress } from "@/stores/useLocation";
const locationData = {
  label: "Nigeria",
  lat: "8.9773705",
  lng: "8.6774730",
  states: [
    {
      label: "Enugu",
      lat: "6.3962482",
      lng: "7.3203590",
      lgas: [
        {
          label: "Isi uzo",
          lat: "6.7132491",
          lng: "7.6401447",
        },
      ],
    },
    {
      label: "Rivers",
      lat: "4.8768905",
      lng: "6.8806697",
      lgas: [
        {
          label: "Ogba egbema ndoni",
          lat: "5.3950449",
          lng: "6.6022382",
        },
      ],
    },
  ],
};

type PageProps = {};

interface DashboardData {
  wallet_balance: number;
  total_earnings: number;
  total_campaigns_taken: number;
  responses_awaiting_approval: number;
}

type Stats = {
  data: DashboardData;
};

const DashboardRoot: React.FC<PageProps> = ({}) => {
  const { latitude, longitude, location, error, loading } =
    useLocationAddress();
  const [openFilter, setOpenFilter] = useState(false);
  const { user } = useRemoteUserStore();
  const searchParams = useSearchParams();
  const currentUser = useUserStore((state) => state.user);
  const router = useRouter();

  const tasksRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateQueryParams("search", value);
  };

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [min_question, setMin_question] = useState<string>("");
  const [max_question, setMax_question] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [responseType, setResponseType] = useState("");

  const generateFilteredSearchMessage = () => {
    const filters: string[] = [];

    const searchTerm = searchParams.get("search");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const minQuestion = searchParams.get("min_question");
    const maxQuestion = searchParams.get("max_question");
    const responseType = searchParams.get("response_type");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    if (searchTerm) filters.push(`search term "${searchTerm}"`);

    if (minPrice || maxPrice)
      filters.push(
        `price range ${minPrice || "0"} - ${maxPrice || "unlimited"}`,
      );

    if (minQuestion || maxQuestion)
      filters.push(
        `question count ${minQuestion || "0"} - ${maxQuestion || "unlimited"}`,
      );

    if (responseType) filters.push(`${responseType} response type`);

    if (startDateParam && endDateParam) {
      try {
        const startDate = new Date(startDateParam);
        const endDate = new Date(endDateParam);

        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          filters.push(
            `between ${format(startDate, "PP")} and ${format(endDate, "PP")}`,
          );
        }
      } catch (error) {
        // Silently handle invalid date parsing
      }
    }

    return filters.length > 0
      ? `No tasks found for applied filters: ${filters.join(", ")}.`
      : "No tasks found matching your search criteria.";
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setMinPrice(searchParams.get("min_price") || "");
    setMaxPrice(searchParams.get("max_price") || "");
    setMin_question(searchParams.get("min_question") || "");
    setMax_question(searchParams.get("max_question") || "");
    setResponseType(searchParams.get("response_type") || "");

    // Parse date params
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    setStartDate(startDateParam ? new Date(startDateParam) : null);
    setEndDate(endDateParam ? new Date(endDateParam) : null);
  }, [searchParams]);

  const applyFilters = () => {
    const queryParams = new URLSearchParams();

    if (startDate)
      queryParams.set("start_date", format(startDate, "yyyy-MM-dd"));
    if (endDate) queryParams.set("end_date", format(endDate, "yyyy-MM-dd"));
    if (minPrice) queryParams.set("min_price", minPrice);
    if (maxPrice) queryParams.set("max_price", maxPrice);
    if (min_question) queryParams.set("min_question", min_question);
    if (max_question) queryParams.set("max_question", max_question);

    //  router.push(`/tasks?${queryParams.toString()}`);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${queryParams.toString()}`,
    );
  };

  const updateQueryParams = (key: string, value: string | null) => {
    const queryParams = new URLSearchParams(window.location.search);

    if (value) {
      queryParams.set(key, value);
    } else {
      queryParams.delete(key);
    }

    // Update the URL without reloading
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${queryParams.toString()}`,
    );
  };

  const [data, setData] = useState<DashboardData | null>(null);

  // Query for dashboard stats
  const {
    data: stats,
    error: statsError,
    isError: isStatsError,
  } = useQuery({
    queryKey: ["Get dashboard stats"],
    queryFn: getDashboardStats,
    retry: 2, // Retry failed requests 2 times
  });

  useEffect(() => {
    if (stats?.data) {
      setData(stats.data);
    }
  }, [stats]);

  // Debounce search term
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //   }, 300);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [searchTerm]);

  // useEffect(() => {
  //   const params = new URLSearchParams();

  //   if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
  //   if (type) params.set("type", type);
  //   if (page) params.set("page", page.toString());
  //   if (perPage) params.set("per_page", perPage.toString());
  //   if (minPrice) params.set("min_price", minPrice.toString());
  //   if (maxPrice) params.set("max_price", maxPrice.toString());

  //   router.push(`?${params.toString()}`);

  //   if (tasksRef.current && searchTerm) {
  //     tasksRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [
  //   debouncedSearchTerm,
  //   type,
  //   page,
  //   perPage,
  //   minPrice,
  //   maxPrice,
  //   router,
  //   searchTerm,
  // ]);

  const Name = currentUser?.name?.split(" ")[0] || "";
  const FirstName = Name
    ? Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase()
    : "";

  // Query for tasks
  const {
    data: tasks,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["Get task list", searchParams.toString()],
    queryFn: () =>
      getAllTask({
        //  page: currentPage,
        //  per_page: 9,
        search: searchParams.get("search") || undefined,
        //@ts-ignore
        min_price: searchParams.get("min_price") || undefined,
        //@ts-ignore
        max_price: searchParams.get("max_price") || undefined,
        //@ts-ignore
        min_question: searchParams.get("min_question") || undefined,
        //@ts-ignore
        max_question: searchParams.get("max_question") || undefined,
        allows_multiple_responses:
          searchParams.get("response_type") === "multiple"
            ? true
            : searchParams.get("response_type") === "one-time"
              ? false
              : undefined,
        campaign_start_date: searchParams.get("startDate") || undefined,
        campaign_end_date: searchParams.get("endDate") || undefined,
      }),
  });

  console.log(user, "user");

  // Safely handle tasks data
  const tasksList = tasks?.data || [];
  const isValidTasksList = Array.isArray(tasksList) && tasksList.length > 0;

  // Handle authentication errors and redirect
  // useEffect(() => {
  //   const handleError = (error: any) => {
  //     // Check for authentication-related errors
  //     if (
  //       error?.response?.status === 401 ||
  //       error?.message?.includes("unauthorized") ||
  //       error?.message?.includes("Unauthenticated") ||
  //       // Add any other error conditions that indicate auth issues
  //       error?.response?.status === 403
  //     ) {
  //       // Show error toast
  //       toast.error("Session expired. Please login again.");

  //       // Clear any auth-related state/storage if needed
  //       // localStorage.removeItem('token'); // If you're using localStorage
  //       // Or clear your auth state management store

  //       // Redirect to login
  //       router.push("/signin");
  //       return true;
  //     }
  //     return false;
  //   };

  //   // Check for errors and handle redirection
  //   if (isStatsError || isTasksError) {
  //     const statsAuthError = statsError && handleError(statsError);
  //     const tasksAuthError = tasksError && handleError(tasksError);

  //     // If neither error was an auth error, show generic error
  //     if (!statsAuthError && !tasksAuthError) {
  //       toast.error("An error occurred. Please try again later.");
  //       router.push("/signin");
  //     }
  //   }
  // }, [isStatsError, isTasksError, statsError, tasksError, router]);

  return (
    <>
      <div className="grid h-max grid-cols-5 gap-6 py-10">
        {/* Welcome section */}
        <div className="col-span-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome to Goloka,&nbsp;
              <span className="text-main-100">{FirstName}</span>
            </h1>
            <p className="text-gray-600">
              Start earning by contribute to different campaigns from divers
              niche
            </p>
          </div>
        </div>

        {/* Stats section */}
        <div className="no-scrollbar col-span-5 mt-4 w-full overflow-x-auto">
          <div className="col-span-5 flex w-min gap-4 1xl:grid 1xl:grid-cols-4 xl:w-full">
            {!data ? (
              <>
                <SkeletonXLoader />
                <SkeletonXLoader />
                <SkeletonXLoader />
                <SkeletonXLoader />
              </>
            ) : (
              <>
                <DashboardWidget
                  title="Wallet balance"
                  bg="bg-white bg-opacity-[12%]"
                  fg="text-white"
                  containerBg="bg-gradient-to-tr from-[#3365E3] to-[#1C387D]"
                  textColor="text-white"
                  icon={Wallet3}
                  value={`₦ ${numberWithCommas(data.wallet_balance)}`}
                  footer={
                    <span className="font-medium">
                      Minimum withdrawal ₦ 100
                    </span>
                  }
                  isAnalytics={false}
                  increase={true}
                  percents={40}
                />

                <DashboardWidget
                  title="Total earnings"
                  bg="bg-[#FEC53D] bg-opacity-[12%]"
                  fg="text-[#FEC53D]"
                  icon={TrendUp}
                  value={
                    data.total_earnings
                      ? //@ts-ignore
                        `₦ ${numberWithCommas(data.total_earnings?.overall)}`
                      : "0.00"
                  }
                  footer="vs last month"
                  isAnalytics={true}
                  increase={true}
                  //@ts-ignore
                  percents={data.total_earnings?.percentage_increase}
                />

                <DashboardWidget
                  title="Market-place taken"
                  bg="bg-main-100 bg-opacity-[12%]"
                  fg="text-main-100"
                  icon={Note}
                  //@ts-ignore
                  value={data.total_campaigns_taken?.count}
                  footer="vs last month"
                  isAnalytics={true}
                  increase={true}
                  percents={
                    //@ts-ignore
                    data.total_campaigns_taken?.percentage_increase
                  }
                />

                <DashboardWidget
                  title="Awaiting approval"
                  bg="bg-[#EB5757] bg-opacity-[12%]"
                  fg="text-[#EB5757]"
                  icon={ClipboardExport}
                  //@ts-ignore
                  value={data.responses_awaiting_approval?.count}
                  footer="vs last month"
                  isAnalytics={true}
                  increase={false}
                  percents={
                    //@ts-ignore
                    data.responses_awaiting_approval?.percentage_increase
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* Map section */}
        <div className="col-span-5 mt-4 xl:rounded-[16px] xl:bg-white xl:p-5">
          <h3 className="mb-4 text-lg font-semibold text-[#333]">
            Places with highest tasks
          </h3>
          <figure className="h-[200px] xl:h-[300px]">
            {/* <Image src={Map} alt="map" className="h-full w-full object-cover" /> */}
            <Map location={locationData} />
          </figure>
        </div>

        {/* Tasks section */}
        <div className="col-span-5 mt-4" ref={tasksRef}>
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-[#333]">Tasks for you</h3>
            <Link
              href="/dashboard/root"
              className="text-lg font-semibold text-main-100"
            >
              See all
            </Link>
          </div>

          {/* Search and filters */}
          <div className="my-4 flex justify-between lg:justify-start lg:gap-4 lg:rounded-full lg:bg-white lg:p-2">
            {/* -- search section */}
            <div className="relative flex w-[200px] items-center justify-center md:w-[300px]">
              <Search className="absolute left-3 text-gray-500" size={18} />
              <Input
                placeholder="Search task"
                type="text"
                className="rounded-full bg-gray-50 pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="hidden lg:flex lg:gap-4">
              {/* PRICE */}
              {/* <Select>
              <SelectTrigger className="w-min rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="2">$2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select> */}

              <Popover>
                <PopoverTrigger className="rounded-full border px-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm">Price Range</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[300px]">
                  <div className="flex flex-col gap-4 p-2">
                    <div className="flex items-center justify-between gap-4">
                      <Input
                        placeholder="Min Price"
                        type="number"
                        value={minPrice}
                        // className="outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        placeholder="Max Price"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between">
                      <button
                        className="rounded-full bg-[#F8F8F8] px-2 py-1 text-sm text-blue-500"
                        onClick={() => {
                          updateQueryParams("min_price", null);
                          updateQueryParams("max_price", null);
                          setMinPrice("");
                          setMaxPrice("");
                        }}
                      >
                        Clear
                      </button>
                      <button
                        className="rounded-full bg-blue-500 px-2 py-1 text-sm text-[#F8F8F8]"
                        onClick={applyFilters}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Question NUMBER */}
              <Popover>
                <PopoverTrigger className="rounded-full border px-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm">Number of question</span>{" "}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] shadow-md">
                  {/* <Label htmlFor="number" className="mb-3 inline-block">
                  Input number
                </Label>
                <Input
                  name="number"
                  id="number"
                  type="number"
                  className="form-input w-full appearance-none rounded-lg border border-[#d9dec0] px-4 py-6 placeholder:text-[#828282] focus:border-0 focus:outline-none focus-visible:ring-0"
                  placeholder="0"
                  onChange={(e) => setNumber(parseInt(e.target.value))}
                /> */}

                  <div className="flex items-center justify-between gap-4">
                    <Input
                      placeholder="Min Question number"
                      type="number"
                      value={min_question}
                      // className="outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                      onChange={(e) => setMin_question(e.target.value)}
                    />
                    <Input
                      placeholder="Max Question number"
                      type="number"
                      value={max_question}
                      onChange={(e) => setMax_question(e.target.value)}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      className="rounded-full bg-[#F8F8F8] px-2 py-1 text-sm text-blue-500"
                      onClick={() => {
                        updateQueryParams("min_question", null);
                        updateQueryParams("max_question", null);
                        // updateQueryParams("endDate", null);
                        // setNumber(0);
                        setMax_question("");
                        setMin_question("");
                      }}
                    >
                      Clear
                    </button>
                    <button
                      className="rounded-full bg-blue-500 px-2 py-1 text-sm text-[#F8F8F8]"
                      onClick={applyFilters}
                    >
                      Done
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* DATE RANGE */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
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

              {/* RESPONSE */}
              {/* <Select>
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
            </Select> */}

              <Select
                onValueChange={(value) => {
                  if (value === "all") {
                    updateQueryParams("response_type", null);
                  } else {
                    updateQueryParams("response_type", value);
                  }
                }}
              >
                <SelectTrigger className="w-max rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                  <SelectValue placeholder="Response type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Select type</SelectLabel>
                    <SelectItem value="all">All response</SelectItem>{" "}
                    {/* Clear the filter */}
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

          {/* Task list */}

          <div className="my-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            ) : isValidTasksList ? (
              tasksList.map((task, index) => (
                <TaskCardWidget
                  key={`task-${index}`}
                  {...task}
                  refetch={refetch}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center text-gray-500">
                <div className="mx-auto mt-9 flex max-w-96 flex-col items-center lg:mt-[100px]">
                  <Image src={Img} alt="No task illustrations" />
                  <h3 className="mb-4 mt-11 text-center text-2xl font-medium text-main-100">
                    {/* Determine heading based on filter status */}
                    {searchParams.toString()
                      ? "No Tasks Found"
                      : "No task related to you"}
                  </h3>
                  <p className="text-center text-base text-[#4F4F4F]">
                    {searchParams.toString()
                      ? generateFilteredSearchMessage()
                      : "There is no task related to your location presently, update your location to see tasks"}
                  </p>
                  <button
                    // onClick={() => setOpen(true)}
                    className="mt-11 rounded-full bg-main-100 px-10 py-3 text-sm font-medium text-white"
                  >
                    Update Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRoot;
