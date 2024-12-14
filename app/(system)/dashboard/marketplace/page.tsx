"use client";
import React, { useEffect } from "react";
import Img from "@/public/assets/images/svg/task-empty-state-icon.svg";
import { CalendarIcon, ChevronDown, Search } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar, Setting4 } from "iconsax-react";
import Image from "next/image";
import UpdateLocationDialog from "@/components/lib/modals/task_update_location";

import TaskCardWidget from "@/components/lib/widgets/task_card";
import TaskFilterDrawerMobile from "@/components/lib/modals/task_filter";

import { useQuery } from "@tanstack/react-query";
import { getAllTask } from "@/services/contributor";
import { SkeletonLoader } from "@/components/lib/loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

type ComponentProps = {};

const TaskPage: React.FC<ComponentProps> = ({}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateQueryParams("search", value);
  };

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
      queryParams.delete(key); // Remove parameter if value is null
    }

    // Update the URL without reloading
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${queryParams.toString()}`,
    );
  };

  const {
    data: tasks,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["Get task list", currentPage, searchParams.toString()],
    queryFn: () =>
      getAllTask({
        page: currentPage,
        per_page: 9,
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
  console.log(tasks, "tasks");
  //@ts-ignore
  const totalPages = tasks?.pagination?.total_pages || 1;

  // Event handlers for pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageSelect = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleUpdateLocation = () => {
    setOpen(false);
    // setTask(tasks);
  };

  // Render ellipsis if necessary
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                handlePageSelect(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        pageNumbers.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }
    }
    return pageNumbers;
  };

  return (
    <>
      <section className="pb-10 pt-[34px]">
        <h1 className="mb-6 text-2xl font-semibold text-[#333]">
          Marketplace for you
        </h1>

        {/* OPTIONS */}
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
                    // onClick={() => {
                    //   // Update the URL with the selected dates
                    //   const params = new URLSearchParams(
                    //     window.location.search,
                    //   );
                    //   if (startDate)
                    //     params.set("startDate", startDate.toISOString());
                    //   if (endDate) params.set("endDate", endDate.toISOString());
                    //   window.history.replaceState(
                    //     null,
                    //     "",
                    //     `${window.location.pathname}?${params.toString()}`,
                    //   );
                    // }}
                  >
                    Done
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* DATE */}
            {/* <Popover>
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
            </Popover> */}

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
                  {/* <div className="flex w-full justify-between gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
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
                    </Button>
                  </div> */}
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
              <Setting4 size={20} color="currentColor" />
            </span>
            <span>Filter</span>
          </div>
        </div>

        {/* EMPTY STATE */}

        {tasks?.data?.length < 1 ? (
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
              onClick={() => setOpen(true)}
              className="mt-11 rounded-full bg-main-100 px-10 py-3 text-sm font-medium text-white"
            >
              Update Location
            </button>
          </div>
        ) : (
          <>
            <div className="my-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonLoader key={index} />
                  ))
                : //@ts-ignore
                  tasks?.data.map((task: any, index: number) => (
                    <TaskCardWidget {...task} key={index} refetch={refetch} />
                  ))}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePreviousPage();
                    }}
                    isActive={currentPage === 1 || isLoading || isFetching}
                  />
                </PaginationItem>

                {renderPageNumbers()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                    isActive={
                      currentPage === totalPages || isLoading || isFetching
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </section>

      {/* DIALOG: UPDATE LOCATION */}
      <UpdateLocationDialog
        open={open}
        action={handleUpdateLocation}
        setOpen={setOpen}
      />

      {/* DRAWER: MOBILE FILTER */}
      <TaskFilterDrawerMobile
        open={openFilter}
        action={handleUpdateLocation}
        setOpen={setOpenFilter}
      />
    </>
  );
};

export default TaskPage;
