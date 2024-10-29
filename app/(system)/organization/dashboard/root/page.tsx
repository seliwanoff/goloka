"use client";
import DashboardWidget from "@/components/lib/widgets/dashboard_card";
import React, { useState } from "react";
import {
  Calendar,
  Calendar1,
  ClipboardExport,
  DocumentUpload,
  Eye,
  Note,
  Setting4,
  Task,
  TrendUp,
  Wallet3,
} from "iconsax-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/lib/navigation/Pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { chunkArray, cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { responsesTableData } from "@/utils";
import { useRouter } from "next/navigation";
import {
  formatResponseDate,
  formatResponseTime,
  getStatusColor,
  getStatusText,
  Status,
} from "@/helper";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  // const [filteredData, setFilteredData] = useState<Response[]>(
  //   responseData?.data?.filter(
  //     (item: { status: string }) => item?.status === activeTab,
  //   ),
  // );

  const [filteredData, setFilteredData] = useState<any[]>(responsesTableData);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [date, setDate] = useState<Date>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const pages = chunkArray(filteredData, pageSize);
  const router = useRouter();

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
        <div className="col-span-5 flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-4 xl:w-full">
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
      <div className="col-span-5 grid w-full grid-cols-[2fr_1fr] gap-6">
        <div className="rounded-2xl bg-white p-[14px]">
          <CampaignChart />
        </div>
        <div className="rounded-2xl bg-white p-[14px]"></div>
      </div>
      {/* RECENT RESPONSES */}

      {/* TABLE */}
      <div className="col-span-5 w-full rounded-2xl bg-white p-[14px]">
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
        <div className="w-full">
          <Card className="border-0">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contributor</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Campaign
                    </TableHead>
                    <TableHead className="table-cell">Location</TableHead>
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
                  {filteredData?.map((res: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <h4
                            className="w-40 cursor-pointer truncate hover:text-blue-700 hover:underline"
                            onClick={() =>
                              router.push(`/dashboard/responses/${res?.id}`)
                            }
                            title={res.campaign_title || "Muhammad Jamiu"} // Tooltip for full text on hover
                          >
                            {res.campaign_title || "Muhammad Jamiu"}
                            Muhammad Jamiu
                          </h4>

                          <div className="inline-flex items-center gap-2 lg:hidden">
                            <span className="text-[#828282]">
                              {res.organization || "Goloka Test"}
                            </span>
                            {/* {res?.unread_messages_count > 0 && (
                              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                                {res?.unread_messages_count}
                              </span>
                            )} */}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="inline-flex items-start gap-2">
                          <span className="text-sm">
                            {res.organization || "Goloka Test"}
                          </span>
                          {/* {res?.unread_messages_count > 0 && (
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4C4C] text-xs text-white">
                              {res?.unread_messages_count}
                            </span>
                          )} */}
                        </div>{" "}
                      </TableCell>

                      <TableCell className="table-cell">
                        <div className="inline-flex flex-col items-start gap-2">
                          <span className="text-sm font-medium lg:font-normal">
                            {res.payment_rate_for_response || "Kwara"}
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

// Define props for the StatusPill component
interface StatusPillProps {
  status: Status;
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium",
        getStatusColor(status),
      )}
    >
      {getStatusText(status)}
    </span>
  );
};

export const description = "A stacked area chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 105, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CampaignChart() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [date, setDate] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());

  // Generates an array of years for DOB selection (adjust range as needed)
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });
  return (
    <>
      <Card className="border-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b border-none py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle className="text-base font-medium">
              Campaign against response
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="border-0 p-0">
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={true}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              {/* <YAxis
                dataKey="month"
                tickLine={true}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              /> */}
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                fillOpacity={0.4}
                stroke="var(--color-mobile)"
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start justify-between gap-2 text-sm">
            <div className="flex items-start gap-6">
              <div className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-400"></span>
                <div className="">
                  <span className="text-sm text-[#828282]">Total campagn</span>
                  <p className="font-semibold text-[#333333]">54</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-main-100"></span>
                <div className="">
                  <span className="text-sm text-[#828282]">Total response</span>
                  <p className="font-semibold text-[#333333]">569</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#828282]">Amount spent</p>
              <h4 className="font-semibold text-[#333333]">$2500</h4>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
