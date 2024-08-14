"use client";
import React from "react";
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
import { tasks } from "@/utils";

type ComponentProps = {};

const TaskPage: React.FC<ComponentProps> = ({}) => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [task, setTask] = useState<any[]>([]);

  const handleUpdateLocation = () => {
    setOpen(false);
    setTask(tasks);
  };

  return (
    <>
      <section className="pb-10 pt-[34px]">
        <h1 className="mb-6 text-2xl font-semibold text-[#333]">
          Tasks for you
        </h1>

        {/* OPTIONS */}
        <div className="my-4 flex justify-between lg:justify-start lg:gap-4 lg:rounded-full lg:bg-white lg:p-2">
          {/* -- search section */}
          <div className="relative flex w-[200px] items-center justify-center md:w-[300px]">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <Input
              placeholder="Search task, organization"
              type="text"
              className="rounded-full bg-gray-50 pl-10"
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

        {/* EMPTY STATE */}

        {task?.length < 1 ? (
          <div className="mx-auto mt-9 flex max-w-96 flex-col items-center lg:mt-[100px]">
            <Image src={Img} alt="No task illustrations" />
            <h3 className="mb-4 mt-11 text-center text-2xl font-medium text-main-100">
              No task related to you
            </h3>
            <p className="text-center text-base text-[#4F4F4F]">
              There is no task related to your location presently, update your
              location to see tasks
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
            {/* Task list */}
            <div className="grid gap-5 md:grid-cols-2 1xl:grid-cols-3 xl:grid-cols-3">
              {tasks.map((task: any, index: number) => (
                <TaskCardWidget {...task} key={index} />
              ))}
            </div>
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
