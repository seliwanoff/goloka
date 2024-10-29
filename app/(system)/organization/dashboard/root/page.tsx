"use client";
import DashboardWidget from "@/components/lib/widgets/dashboard_card";
import React, { useState } from "react";
import {
  Calendar,
  Calendar1,
  ClipboardExport,
  DocumentUpload,
  Note,
  Setting4,
  Task,
  TrendUp,
  Wallet3,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
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
import { chunkArray, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";

const Dashboard = () => {
  const [filteredData, setFilteredData] = useState<Response[]>(
    responseData?.data?.filter(
      (item: { status: string }) => item?.status === activeTab,
    ),
  );
  const [date, setDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const pages = chunkArray(filteredData, pageSize);

  return (
    <div className="grid h-max grid-cols-5 gap-6 py-10">
      {/* Welcome section */}
      <div className="col-span-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome to Goloka for Organization &nbsp;
            <span className="text-main-100">Jamiu</span>
          </h1>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur. Ultrices turpis amet et id.
          </p>
        </div>
        <Button className="h-auto rounded-full bg-main-100 px-8 py-3 text-white hover:bg-blue-700">
          <span>
            <Note />
          </span>
          Create new campagn
        </Button>
      </div>

      {/* Stats section */}
      <div className="no-scrollbar col-span-5 mt-4 w-full overflow-x-auto">
        <div className="col-span-5 flex w-min gap-4 1xl:grid 1xl:grid-cols-4 xl:w-full">
          <>
            <DashboardWidget
              title="Wallet balance"
              bg="bg-white bg-opacity-[12%]"
              fg="text-white"
              containerBg="bg-gradient-to-tr from-[#3365E3] to-[#1C387D]"
              textColor="text-white"
              icon={Wallet3}
              value={`₦200,500`}
              footer={
                <span className="font-medium">₦5,250 Pending balance</span>
              }
              isAnalytics={false}
              increase={true}
              percents={40}
            />

            <DashboardWidget
              title="Total campaign"
              bg="bg-[#FEC53D] bg-opacity-[12%]"
              fg="text-[#FEC53D]"
              icon={TrendUp}
              value={127}
              footer="126 ongoing"
              isAnalytics={false}
              increase={true}
              percents={40}
            />

            <DashboardWidget
              title="Response"
              bg="bg-main-100 bg-opacity-[12%]"
              fg="text-main-100"
              icon={Note}
              value={64}
              footer="vs last month"
              isAnalytics={true}
              increase={true}
              percents={40}
            />

            <DashboardWidget
              title="Response Exports"
              bg="bg-[#EB5757] bg-opacity-[12%]"
              fg="text-[#EB5757]"
              icon={DocumentUpload}
              value={36}
              footer="Last export : 12/06/2024"
              isAnalytics={false}
              increase={false}
              percents={40}
            />
          </>
        </div>
      </div>

      {/* CHART */}

      {/* RECENT RESPONSES */}
      {/* TABLE */}
      <div className="rounded-2xl bg-white p-[14px]">
        {/* OPTIONS */}
        <div className="mb-5 flex justify-between gap-4 lg:justify-start">
          {/* -- search section */}
          <div className="relative flex w-[250px] items-center justify-center md:w-[300px]">
            <Search className="absolute left-3 text-gray-500" size={18} />
            <Input
              placeholder="Search task, organization"
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
                            {formatResponseTime(res?.data?.created_at)}
                          </span>
                        </div>{" "}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatResponseDate(res?.data?.created_at)} -{" "}
                        {formatResponseTime(res?.data?.created_at)}
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
    </div>
  );
};

export default Dashboard;
