import { cn } from "@/lib/utils";
import React from "react";
type PageProps = {
  step: number;
  setStep: any;
};

const steps = 2;
const StepperIndicator: React.FC<PageProps> = ({ step, setStep }) => {
  return (
    <div>
      <>
        <div className="mb-1.5 font-semibold">
          <span className={cn("text-main-100")}>{step}</span>/
          <span className={cn("text-[#828282]", step > 1 && "text-main-100")}>
            2
          </span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 2 }, (_: any, index: number) => (
            <span
              key={index}
              className={cn(
                "inline-block h-1 w-8 cursor-pointer rounded-full bg-[#F2EEFB] duration-300",
                step > 1 && "w-6 bg-main-100",
              )}
            ></span>
          ))}
        </div>
      </>
    </div>
  );
};

export default StepperIndicator;
