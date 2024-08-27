"use client";
import DashboardWidget from "@/components/lib/widgets/dashboard_card";
import { DocumentCopy, Eye, Note, NoteRemove, TickSquare } from "iconsax-react";
import React, { useEffect, useState } from "react";
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
import { chunkArray, cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Pagination from "@/components/lib/navigation/Pagination";

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

// TABLE COLUMNS
// const columns: ColumnDef<Response>[] = [
//   {
//     accessorKey: "category",
//     header: "Campaign title",
//   },
//   {
//     accessorKey: "company",
//     header: "Organisation",
//     cell: ({ row }) => {
//       console.log(row);

//       return (
//         <div className="inline-flex items-start gap-2">
//           <span className="text-sm">{row?.original?.company}</span>
//           {row?.original?.unread > 0 && (
//             <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
//               {row?.original?.unread}
//             </span>
//           )}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "price",
//     header: "Amount",
//   },
//   {
//     accessorKey: "date",
//     header: () => <div className="text-left">Date submitted</div>,
//     cell: ({ row }) => {
//       console.log(row);

//       return (
//         <div className="">
//           {row?.original?.date} - {row?.original?.time}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "status",
//     header: () => <div className="text-left">Status</div>,
//     cell: ({ row }) => {
//       return (
//         <span
//           className={cn(
//             "rounded-full px-2 py-1 text-xs font-medium",
//             responseStatus(row?.original?.status),
//           )}
//         >
//           {row?.original?.status}
//         </span>
//       );
//     },
//   },

//   {
//     accessorKey: "",
//     header: " ",
//     cell: ({ row }) => {
//       return (
//         <>
//           <span
//             className="cursor-pointer"
//             // onClick={() => router.push("/dashboard/responses/1")}
//           >
//             <Eye size={20} />
//           </span>
//         </>
//       );
//     },
//   },
// ];

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
  const [activeTab, setActiveTab] = useState("On Review");
  const [filteredData, setFilteredData] = useState<Response[]>(
    responsesTableData?.filter((item) => item?.status === activeTab),
  );
  const [date, setDate] = useState<Date>();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const pages = chunkArray(filteredData, pageSize);
  console.log(pages, "pages");

  useEffect(() => {
    const filter = (status: string) =>
      responsesTableData?.filter((item) => item?.status === status);

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
  return (
    <>
      <section className="pb-10 pt-[34px]">
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
                placeholder="Search task, organisation"
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
                    {pages[currentPage - 1].map((res: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <h4
                              onClick={() =>
                                router.push("/dashboard/responses/1")
                              }
                            >
                              {res.category}
                            </h4>
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
                          <div className="inline-flex items-start gap-2">
                            <span className="text-sm">{res.company}</span>
                            {res?.unread > 0 && (
                              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                                {res?.unread}
                              </span>
                            )}
                          </div>{" "}
                        </TableCell>

                        <TableCell className="table-cell">
                          <div className="inline-flex flex-col items-start gap-2">
                            <span className="text-sm font-medium lg:font-normal">
                              {res.price}
                            </span>
                            <span className="text-xs lg:hidden">
                              {res?.date} - {res?.time}
                            </span>
                          </div>{" "}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {res?.date} - {res?.time}
                        </TableCell>
                        <TableCell className={cn("hidden md:table-cell")}>
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
                          <span
                            className="cursor-pointer"
                            onClick={() =>
                              router.push("/dashboard/responses/1")
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
