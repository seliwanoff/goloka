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
import Map from "@/public/assets/images/tasks/tasks.png";
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
import { useRouter } from "next/navigation";
import { getDashboardStats } from "@/services/response";
import { numberWithCommas } from "@/helper";
import { SkeletonXLoader } from "@/helper/loader";
import React from "react";
import { useRemoteUserStore } from "@/stores/contributors";
import { useUserStore } from "@/stores/currentUserStore";

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
  const [date, setDate] = useState<Date>();
  const { user } = useRemoteUserStore();
  const currentUser = useUserStore((state) => state.user);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(9);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const tasksRef = useRef<HTMLDivElement>(null);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);


  const [data, setData] = useState<DashboardData | null>(null);

  // Query for dashboard stats
const { data: stats, error: statsError } = useQuery({
  queryKey: ["Get dashboard stats"],
  queryFn: getDashboardStats,
  retry: 2, // Retry failed requests 2 times
});

  console.log(stats?.data, "rjrjrjrjrjj");

  useEffect(() => {
    if (stats?.data) {
      setData(stats.data);
    }
  }, [stats]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Update URL params and fetch data
  // useEffect(() => {
  //   const params = {
  //     search: debouncedSearchTerm,
  //     type,
  //     page,
  //     per_page: perPage,
  //     min_price: minPrice,
  //     max_price: maxPrice,
  //   };

  //   const newParams = new URLSearchParams();
  //   Object.entries(params).forEach(([key, value]) => {
  //     if (value) newParams.set(key, value.toString());
  //   });

  //   router.push(`?${newParams.toString()}`);

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

    useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (type) params.set('type', type);
    if (page) params.set('page', page.toString());
    if (perPage) params.set('per_page', perPage.toString());
    if (minPrice) params.set('min_price', minPrice.toString());
    if (maxPrice) params.set('max_price', maxPrice.toString());

    router.push(`?${params.toString()}`);

    if (tasksRef.current && searchTerm) {
      tasksRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [debouncedSearchTerm, type, page, perPage, minPrice, maxPrice, router, searchTerm]);

  const Name = currentUser?.name?.split(" ")[0] || "";
  const FirstName = Name
    ? Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase()
    : "";

  // Query for tasks
  const {
    data: tasks,
    refetch,
    isLoading,
    error: tasksError,
  } = useQuery({
    queryKey: [
      "Get task list",
      debouncedSearchTerm,
      type,
      page,
      perPage,
      minPrice,
      maxPrice,
    ],
    queryFn: () =>
      getAllTask({
        page,
        per_page: perPage,
        min_price: minPrice,
        max_price: maxPrice,
      }),
    retry: 2,
  });

  console.log(user, "user");

  // Safely handle tasks data
const tasksList = tasks?.data || [];
const isValidTasksList = Array.isArray(tasksList) && tasksList.length > 0;

   if (statsError || tasksError) {
     return (
       <div className="flex h-screen items-center justify-center">
         <div className="text-center">
           <h2 className="text-xl font-semibold text-red-600">
             Something went wrong
           </h2>
           <p className="mt-2 text-gray-600">Please try refreshing the page</p>
         </div>
       </div>
     );
   }

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
              Lorem ipsum dolor sit amet consectetur. Ultrices turpis amet et
              id.
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
            <Image src={Map} alt="map" className="h-full w-full object-cover" />
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
          <div className="my-4 flex justify-between xl:justify-start xl:gap-4 xl:rounded-full xl:bg-white xl:p-2">
            {/* Search input */}
            <div className="relative flex w-[200px] items-center justify-center md:w-[300px]">
              <Search className="absolute left-3 text-gray-500" size={18} />
              <Input
                placeholder="Search task, organisation"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-full bg-gray-50 pl-10"
              />
            </div>

            {/* Filters */}
            <div className="hidden xl:flex xl:gap-4">
              {/* Price filter */}
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

              {/* Number of questions */}
              <Popover>
                <PopoverTrigger className="rounded-full border px-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm">Number of question</span>
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

              {/* Date picker */}
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
                    </span>
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

              {/* Response type */}
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

            {/* Mobile filter button */}
            <div className="inline-flex items-center justify-center gap-3 rounded-full border bg-white p-1 pr-3 xl:hidden">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                <Setting4 size={20} />
              </span>
              <span>Filter</span>
            </div>
          </div>

          {/* Task list */}
          {/* <div className="my-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            ) : isValidTasksList ? (
              tasksList.map((task, index) => (
                <TaskCardWidget {...task} key={index} refetch={refetch} />
              ))
            ) : (
              <div className="col-span-full text-center">
                No tasks available
              </div>
            )}
          </div> */}
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
              <div className="col-span-full flex h-40 items-center justify-center text-gray-500">
                No tasks available at the moment
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRoot;
