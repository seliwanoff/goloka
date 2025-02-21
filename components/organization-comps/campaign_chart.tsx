"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchOrganizationChart } from "@/services/organization";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
/***
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 105, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
 */

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

interface CampaignChartProps {
  data: any[];
}

export default function CampaignChart({ data }: CampaignChartProps) {
  const [timeRange, setTimeRange] = useState("90d");
  const [date, setDate] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());

  // Generates an array of years for DOB selection (adjust range as needed)

  //@ts-ignore
  const chartData = data?.monthly_data?.labels.map(
    (month: any, index: any) => ({
      month, // Month name from labels
      //@ts-ignore

      campaigns: data?.monthly_data?.campaigns[index],
      //@ts-ignore
      // Assign campaigns count
      responses: data?.monthly_data?.responses[index], // Assign responses count
    }),
  );

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  const filteredData = chartData?.filter((item: any) => {
    // const date = new Date(item.date);
    const date = new Date();
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

  //console.log(chartData);

  const hasData = chartData?.some(
    (data: any) => data.campaigns !== 0 || data.responses !== 0,
  );

  // console.log(hasData);
  return (
    <>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        {hasData ? (
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
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              padding={{ left: 20 }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}K`}
            />
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
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No Data Available
          </div>
        )}
      </ChartContainer>
    </>
  );
}
