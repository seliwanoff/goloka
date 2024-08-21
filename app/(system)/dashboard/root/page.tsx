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
import { CalendarIcon, ChevronDown, Search } from "lucide-react";
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
import { useState } from "react";
// import { tasks } from "@/utils";
import { useUserStore } from "@/stores/use-user-store";
import { useQuery } from "@tanstack/react-query";
import { getAllTask } from "@/services/contributor";

type PageProps = {};

const DashboardRoot: React.FC<PageProps> = ({}) => {
  const [date, setDate] = useState<Date>();
  const currentUser = useUserStore((state) => state.currentUser);
  const { data: tasks, isLoading} = useQuery({
    queryKey: ["Get task list"],
    queryFn: getAllTask,
  });
  const Name = currentUser?.data?.name?.split(" ")[0];
  const FirstName = Name
    ? Name.charAt(0).toUpperCase() + Name.slice(1).toLowerCase()
    : "";

  console.log(tasks, "tasks");
  return (
    <>
      <div className="grid h-max grid-cols-5 gap-6 py-10">
        {/* ####################################### */}
        {/* -- Welcome text section */}
        {/* ####################################### */}
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

        {/* ####################################### */}
        {/* -- stats card section */}
        {/* ####################################### */}
        <div className="no-scrollbar col-span-5 w-full overflow-x-auto">
          <div className="col-span-5 flex w-min gap-4 1xl:grid 1xl:grid-cols-4 xl:w-full">
            {/* Projects Card */}
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Wallet balance"
                bg="bg-white bg-opacity-[12%]"
                fg="text-white"
                containerBg="bg-gradient-to-tr from-[100%] to-[100%] from-[#3365E3] to-[#1C387D]"
                textColor="text-white"
                icon={Wallet3}
                value="₦200,500"
                footer={
                  <>
                    <span className="font-medium">₦5,250</span> Pending balance
                  </>
                }
                isAnalytics={false}
                increase={true}
                percents={40}
              />
            </div>
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Total earning"
                bg="bg-[#FEC53D] bg-opacity-[12%]"
                fg="text-[#FEC53D]"
                icon={TrendUp}
                value={"₦750,000"}
                footer="vs last month"
                isAnalytics
                increase={true}
                percents={40}
              />
            </div>
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Tasks taken"
                bg="bg-main-100 bg-opacity-[12%]"
                fg="text-main-100"
                icon={Note}
                value={640}
                footer="vs last month"
                isAnalytics
                increase={true}
                percents={40}
              />
            </div>
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Awaiting approval"
                bg="bg-[#EB5757] bg-opacity-[12%]"
                fg="text-[#EB5757]"
                icon={ClipboardExport}
                value={36}
                footer="vs last month"
                isAnalytics
                increase={true}
                percents={40}
              />
            </div>
          </div>
        </div>

        {/* ####################################### */}
        {/* -- Places section */}
        {/* ####################################### */}
        <div className="col-span-5 mt-4 xl:rounded-[16px] xl:bg-white xl:p-5">
          <h3 className="mb-4 text-lg font-semibold text-[#333]">
            Places with highest tasks
          </h3>

          <figure className="h-[200px] xl:h-[300px]">
            <Image src={Map} alt="map" className="h-full w-full object-cover" />
          </figure>
        </div>

        {/* ####################################### */}
        {/* -- Tasks section */}
        {/* ####################################### */}
        <div className="col-span-5 mt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold text-[#333]">Tasks for you</h3>

            <Link
              href="/dashboard/root"
              className="text-lg font-semibold text-main-100"
            >
              Sell all
            </Link>
          </div>
          <div className="my-4 flex justify-between xl:justify-start xl:gap-4 xl:rounded-full xl:bg-white xl:p-2">
            {/* -- search section */}
            <div className="relative flex w-[200px] items-center justify-center md:w-[300px]">
              <Search className="absolute left-3 text-gray-500" size={18} />
              <Input
                placeholder="Search task, organisation"
                type="text"
                className="rounded-full bg-gray-50 pl-10"
              />
            </div>

            <div className="hidden xl:flex xl:gap-4">
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
            <div className="inline-flex items-center justify-center gap-3 rounded-full border bg-white p-1 pr-3 xl:hidden">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F8F8F8]">
                <Setting4 size={20} />
              </span>
              <span>Filter</span>
            </div>
          </div>

          {/* Task list */}
          <div className="my-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonLoader key={index} />
                ))
              : //@ts-ignore
                tasks?.data.map((task: any, index: number) => (
                  <TaskCardWidget {...task} key={index} />
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardRoot;

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-[18px] rounded-[16px] border border-[#F2F2F2] bg-white p-4">
      <figure className="relative h-[200px] w-full overflow-hidden rounded-[8px]">
        <SkeletonBox className="h-full w-full rounded-lg" />
        <div className="absolute right-3 top-3 rounded-full bg-gray-300 p-2 px-5 text-xs text-transparent">
          <SkeletonBox className="h-4 w-20" />
        </div>
      </figure>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 rounded-full bg-main-100 bg-opacity-5 p-2 pr-5">
          <SkeletonBox className="h-6 w-20" />
          <SkeletonBox className="h-6 w-24" />
        </div>
        <SkeletonBox className="h-10 w-10 rounded-full" />
      </div>
      <div>
        <SkeletonBox className="mb-2 h-6 w-48" />
        <SkeletonBox className="h-4 w-72" />
        <div className="mt-3 flex gap-2">
          <SkeletonBox className="h-4 w-6" />
          <SkeletonBox className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
};
