import React, { ReactNode } from "react";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";
import { cn, classMerge } from "@/lib/utils"; // Ensure these utility functions are efficient
import Link from "next/link";

interface ComponentProps {
  bg: string;
  fg: string;
  footer: string | ReactNode;
  containerBg?: string;
  icon: React.ElementType; // Explicitly typing the icon prop
  value: string | number | null; // Allow value to be nullable
  title: string;
  percents: number | null; // Allow percents to be nullable
  increase?: boolean;
  isAnalytics?: boolean;
  textColor?: string;
}

const DashboardWidget: React.FC<ComponentProps> = ({ increase, ...props }) => {
  return (
    <div className={cn("rounded-lg bg-white p-4", props.containerBg)}>
      <div className="flex justify-between">
        <div>
          <span className={cn("text-sm text-[#828282]", props.textColor)}>
            {props.title}
          </span>
          <h3
            className={cn(
              "mt-3 text-2xl font-semibold text-[#333333]",
              props.textColor,
            )}
          >
            {props.value !== null ? props.value : "0.00"}
          </h3>
        </div>
        <div>
          <span
            className={classMerge(
              "flex items-center justify-center rounded-full p-3",
              props.bg,
              props.fg,
            )}
          >
            <props.icon
              size={26}
          
              color="currentColor"
              strokeWidth={1}
            />
          </span>
        </div>
      </div>

      {props.isAnalytics && props.percents !== null ? (
        <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
          <p
            className={classMerge(
              "flex items-center gap-1 text-sm font-semibold",
              increase ? "text-green-600" : "text-rose-600",
            )}
          >
            {increase ? (
              <ArrowUp size={16} />
            ) : (
              <ArrowDown className="text-rose-600" size={16} />
            )}
            <span>{props.percents}%</span>
          </p>
          <p className="text-sm font-medium text-gray-600">{props.footer}</p>
        </div>
      ) : (
        <p className={cn("mt-3 text-[#475467]", props.textColor)}>
          {props.footer}
        </p>
      )}
    </div>
  );
};

export default DashboardWidget;
