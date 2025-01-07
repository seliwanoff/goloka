import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Pie, PieChart } from "recharts";

const chartDataSummary = [
  { type: "draft", summary: 275, fill: "var(--color-draft)" },
  { type: "ongoing", summary: 200, fill: "var(--color-ongoing)" },
  { type: "rejected", summary: 187, fill: "var(--color-rejected)" },
];

const chartConfigSummary = {
  summary: {
    label: "Summary",
  },
  ongoing: {
    label: "Ongoing",
    color: "#3365E3",
  },
  draft: {
    label: "Draft",
    color: "#FFD66B",
  },
  rejected: {
    label: "Rejected",
    color: "#DA3F0E",
  },
} satisfies ChartConfig;

const labels = [
  {
    label: "Ongoing",
    color: "#3365E3",
  },
  {
    label: "Draft",
    color: "#FFD66B",
  },
  {
    label: "Rejected",
    color: "#DA3F0E",
  },
];

console.log(
  Object.values(chartConfigSummary).filter((item) => item?.label !== "Summary"),
  "Chart summary cof",
);

const CampaignSummary = () => {
  return (
    <>
      <ChartContainer
        config={chartConfigSummary}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={chartDataSummary}
            dataKey="summary"
            nameKey="type"
            innerRadius={60}
            outerRadius={100}
          />
        </PieChart>
      </ChartContainer>

      <div className="mt-8 flex items-center justify-center gap-6 border-t border-neutral-300 pt-2">
        {labels.map((item, index) => {
          return (
            <div key={index} className="space-x-1.5">
              <span
                style={{ background: item?.color }}
                className={cn(`inline-block h-2 w-2 rounded`)}
              ></span>
              <span className="text-xs text-[#434343]">{item?.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CampaignSummary;
