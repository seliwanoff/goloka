import React from "react";
import { IPlan } from "./pricing_list";
import { Zap } from "lucide-react";
import { BiCheck } from "react-icons/bi";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const PriceCard = ({
  item,
  className,
}: {
  item: IPlan;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[#EAECF0]",
        className,
        item.isPopular
          ? "bg-gradient-to-b from-main-100 to-main-200 shadow-[0px_0px_30px_2px_rgb(51,101,227,.18)]"
          : "bg-white",
      )}
    >
      <div className="flex flex-col items-center justify-center px-8 py-8">
        <span
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-[8px] border border-[#EAECF0] text-[#344054]",
            item.isPopular && "bg-white text-main-100",
          )}
        >
          <Zap />
        </span>

        <h3
          className={cn(
            "pt-6 text-xl font-semibold text-main-100",
            item.isPopular && "text-white",
          )}
        >
          {item.name}
        </h3>

        <span
          className={cn(
            "py-2 text-[42px] font-semibold text-[#101828]",
            item.isPopular && "text-white",
          )}
        >
          ${item.price}/{item.billingCycle === "monthly" ? "mth" : "yr"}
        </span>
        <span className={cn("text-[#475467]", item.isPopular && "text-white")}>
          Billed {item.billingCycle}
        </span>
      </div>
      <div className="px-8 pb-12">
        <ul className="space-y-4">
          {item?.features?.map((feat, index) => (
            <li key={index}>
              <div className="inline-flex gap-3">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EBF0FC] text-main-100",
                    item?.isPopular && "bg-white",
                  )}
                >
                  <BiCheck size={20} />
                </span>
                <span
                  className={cn(
                    item.isPopular ? "text-white" : "text-[#475467]",
                  )}
                >
                  {feat}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn(
          "border-t border-[#EAECF0] bg-[#F9FAFB] p-8",
          item?.isPopular && "bg-transparent",
        )}
      >
        <Button
          className={cn(
            "h-auto w-full rounded-full bg-main-100 py-3 font-semibold hover:bg-blue-700",
            item?.isPopular && "bg-white text-main-100 hover:bg-white",
          )}
        >
          Get started
        </Button>
      </div>
    </div>
  );
};

export default PriceCard;
