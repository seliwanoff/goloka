"use client";
import DashboardWidget from "@/components/lib/widgets/dashboard_card";
import { DocumentCopy, Eye, Note, NoteRemove, TickSquare } from "iconsax-react";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { format } from "date-fns";
import { Calendar, Setting4 } from "iconsax-react";
import { responsesTableData } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/lib/widgets/DataTable";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type PageProps = {};

type Response = {
  category: string;
  company: string;
  status: string;
  price: string;
  date: string;
  time: string;
  unread: number;
};

export const responseStatus = (status: string) => {
  switch (status) {
    case "On Review":
      return "bg-violet-500 border border-violet-500 bg-opacity-5 text-violet-500";
    case "Pending":
      return "bg-orange-400 border border-orange-400 bg-opacity-5 text-orange-400";
    case "Accepted":
      return "bg-emerald-700 border border-emerald-700 bg-opacity-5 text-emerald-700";
    case "Rejected":
      return "bg-[#FF0000] border border-[#FF0000] bg-opacity-5 text-[#FF0000]";
  }
};

const ResponsesPage: React.FC<PageProps> = ({}) => {
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("on-review");
  const [date, setDate] = useState<Date>();
  const router = useRouter();

  // TABLE COLUMNS
  const columns: ColumnDef<Response>[] = [
    {
      accessorKey: "category",
      header: "Campaign title",
    },
    {
      accessorKey: "company",
      header: "Organisation",
      cell: ({ row }) => {
        console.log(row);

        return (
          <div className="inline-flex items-start gap-2">
            <span className="text-sm">{row?.original?.company}</span>
            {row?.original?.unread > 0 && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                {row?.original?.unread}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: () => <div className="text-left">Date submitted</div>,
      cell: ({ row }) => {
        console.log(row);

        return (
          <div className="">
            {row?.original?.date} - {row?.original?.time}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              responseStatus(row?.original?.status),
            )}
          >
            {row?.original?.status}
          </span>
        );
      },
    },

    {
      accessorKey: "",
      header: " ",
      cell: ({ row }) => {
        return (
          <>
            <span
              className="cursor-pointer"
              onClick={() => router.push("/dashboard/responses/1")}
            >
              <Eye size={20} />
            </span>
          </>
        );
      },
    },
  ];

  return (
    <>
      <section className="pb-10 pt-[34px]">
        {/* <CustomBreadCrumbs /> */}
        {/* <h1 className="mb-6 text-2xl font-semibold text-[#333]">
          Tasks for you
        </h1> */}

        {/* ####################################### */}
        {/* -- stats card section */}
        {/* ####################################### */}
        <div className="no-scrollbar col-span-5 mt-4 w-full overflow-x-auto">
          <div className="col-span-5 flex w-min gap-4 1xl:grid 1xl:grid-cols-4 xl:w-full">
            {/* Projects Card */}
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Total response"
                bg="bg-[#079455] bg-opacity-[12%]"
                fg="text-[#079455]"
                icon={DocumentCopy}
                value={"256"}
                footer="vs last month"
                isAnalytics
                increase={true}
                percents={40}
              />
            </div>
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Total campaign"
                bg="bg-[#FEC53D] bg-opacity-[12%]"
                fg="text-[#FEC53D]"
                icon={Note}
                value={100}
                footer="vs last month"
                isAnalytics
                increase={true}
                percents={40}
              />
            </div>
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Accepted response"
                bg="bg-[#7F55DA] bg-opacity-[12%]"
                fg="text-[#7F55DA]"
                icon={TickSquare}
                value={160}
                footer="vs last month"
                isAnalytics
                increase={true}
                percents={40}
              />
            </div>{" "}
            <div className="w-[300px] xl:w-full">
              <DashboardWidget
                title="Rejected response"
                bg="bg-[#EB5757] bg-opacity-[12%]"
                fg="text-[#EB5757]"
                icon={NoteRemove}
                value={82}
                footer="vs last month"
                isAnalytics
                increase={true}
                percents={40}
              />
            </div>
          </div>
        </div>

        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-7 w-max md:mt-12"
          >
            <TabsList className={cn("rounded-full bg-white px-1 py-6")}>
              {tabs.map((tab: any, index: number) => (
                <TabsTrigger
                  value={tab?.value}
                  key={index}
                  className={cn(
                    "rounded-full py-2.5 text-sm font-normal data-[state=active]:bg-blue-700 data-[state=active]:text-white",
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}{" "}
            </TabsList>
            {/* <TabsContent value="on-review">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="pending">
              Change your password here.
            </TabsContent> */}
          </Tabs>
        </div>

        <div className="rounded-2xl bg-white p-[14px]">
          {/* OPTIONS */}
          <div className="flex justify-between lg:justify-start lg:gap-4">
            {/* -- search section */}
            <div className="relative flex w-[200px] items-center justify-center md:w-[300px]">
              <Search className="absolute left-3 text-gray-500" size={18} />
              <Input
                placeholder="Search task, organisation"
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
          <Card className="border-0 lg:hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Title</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Organisation
                    </TableHead>
                    <TableHead className="table-cell">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Date submitted
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Status{" "}
                    </TableHead>
                    <TableHead className="hidden lg:table-cell"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responsesTableData?.map((res: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <h4>{res.category}</h4>
                          <div className="inline-flex items-center gap-2 lg:hidden">
                            <span className="text-[#828282]">
                              {res.company}
                            </span>
                            {res?.unread > 0 && (
                              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                                {res?.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="inline-flex flex-col items-start gap-2">
                          <span className="text-sm font-medium">
                            {res.company}
                          </span>
                          {res?.unread > 0 && (
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                              {res?.unread}
                            </span>
                          )}
                        </div>{" "}
                      </TableCell>

                      <TableCell className="table-cell">
                        <div className="inline-flex flex-col items-start gap-2">
                          <span className="text-sm font-medium">
                            {res.price}
                          </span>
                          <span className="text-xs md:hidden">
                            {res?.date} - {res?.time}
                          </span>
                        </div>{" "}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {res?.date} - {res?.time}
                      </TableCell>
                      <TableCell className={cn("hidden lg:table-cell")}>
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-xs font-medium",
                            responseStatus(res?.status),
                          )}
                        >
                          {res.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="cursor-pointer">
                          <Eye size={20} />
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="mx-auto hidden py-10 lg:block">
            <DataTable columns={columns} data={responsesTableData} />
          </div>
        </div>
      </section>
    </>
  );
};

export default ResponsesPage;

const tabs = [
  {
    label: "On review",
    value: "on-review",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Accepted",
    value: "accepted",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];
