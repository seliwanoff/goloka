import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, Setting4 } from "iconsax-react";
import { Search } from "lucide-react";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { useShowFilter } from "@/stores/overlay";
import { useWalletFilter } from "@/stores/misc";
import { useSearchParams } from "next/navigation";

const WalletTableOptions = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const { setOpenFilter } = useShowFilter();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [type, setType] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    updateQueryParams("search", value);
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

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");

    setType(searchParams.get("type") || "");

    // Parse date params
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    setStartDate(startDateParam ? new Date(startDateParam) : null);
    setEndDate(endDateParam ? new Date(endDateParam) : null);
  }, [searchParams]);

  return (
    <div className="mb-5 flex justify-between gap-4 lg:justify-start">
      {/* -- search section */}
      <div className="relative flex w-[250px] items-center justify-center md:w-[300px]">
        <Search className="absolute left-3 text-gray-500" size={18} />
        <Input
          id="search-wallet"
          name="search-wallet"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search beneficiary."
          type="text"
          className="w-full rounded-full bg-gray-50 pl-10"
        />
      </div>

      <div className="hidden lg:flex lg:gap-4">
        {/* PRICE */}
        <Select
          onValueChange={(value) => {
            if (value === "all") {
              updateQueryParams("type", null);
            } else {
              updateQueryParams("type", value);
            }
          }}
        >
          <SelectTrigger className="w-max gap-3 rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
            <SelectValue placeholder="All type" className="line-clamp-none" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All type</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="successful">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* DATE */}
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-min justify-start gap-3 rounded-full px-3 pr-1 text-center text-sm font-normal",
              )}
            >
              {date ? format(date, "PPP") : <span>Pick date</span>}
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
                    const params = new URLSearchParams(window.location.search);
                    if (startDate)
                      params.set("startDate", startDate.toISOString());
                    if (endDate) params.set("endDate", endDate.toISOString());
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
  );
};

export default WalletTableOptions;
