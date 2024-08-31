import React, { useState } from "react";
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

const WalletTableOptions = () => {
  const [date, setDate] = useState<Date | undefined>();
  const { setOpenFilter } = useShowFilter();

  return (
    <div className="mb-5 flex justify-between gap-4 lg:justify-start">
      {/* -- search section */}
      <div className="relative flex w-[250px] items-center justify-center md:w-[300px]">
        <Search className="absolute left-3 text-gray-500" size={18} />
        <Input
          placeholder="Search task, organisation"
          type="text"
          className="w-full rounded-full bg-gray-50 pl-10"
        />
      </div>

      <div className="hidden lg:flex lg:gap-4">
        {/* PRICE */}
        <Select>
          <SelectTrigger className="w-max gap-3 rounded-full focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
            <SelectValue placeholder="All type" className="line-clamp-none" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All type</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* DATE */}
        <Popover>
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
