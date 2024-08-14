import React from "react";
import { useStepper } from "@/context/TaskStepperContext.tsx";
import { Button } from "../ui/button";

type ComponentProps = {
  next: () => void;
};

const StepperControl: React.FC<ComponentProps> = ({ next }) => {
  const { step, nextStep, updateAnswer } = useStepper();

  return (
    <div className="mt-10 flex justify-evenly p-5">
      <Button
        variant="outline"
        className="cursor-pointer rounded-full border-main-100 px-10 py-3 text-sm font-medium text-main-100"
      >
        Previous
      </Button>
      <Button
        onClick={next}
        className="cursor-pointer rounded-full bg-main-100 px-10 py-3 text-sm font-medium text-white"
      >
        Next
      </Button>
    </div>
  );
};

export default StepperControl;
