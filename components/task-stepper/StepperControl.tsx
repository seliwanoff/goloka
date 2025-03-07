import React from "react";

import { Button } from "../ui/button";
import { useStepper } from "@/context/TaskStepperContext.tsx";
import { useRouter, useSearchParams } from "next/navigation";

interface StepperControlProps {
  next: () => void;
  isLastStep?: boolean;
  isLoading: boolean;
}

const StepperControl: React.FC<StepperControlProps> = ({
  next,
  isLastStep,
  isLoading,
}) => {
  const { prevStep, step, totalSteps } = useStepper();

  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrlStep = (newStep: number) => {
    // Create a new URLSearchParams object
    const newSearchParams = new URLSearchParams(searchParams.toString());
    // Update the step parameter
    newSearchParams.set("step", newStep.toString());
    // Update the URL
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
  };

  //console.log(isLastStep, "isLastStep");

  const handleNext = () => {
    next();
    //updateUrlStep(step + 1);
  };
  const handleNext2 = () => {
    next();
    updateUrlStep(step + 1);
  };
  const handlePrevious = () => {
    prevStep();
    updateUrlStep(step - 1);
  };

  return (
    <div className="mt-10 flex justify-between p-5">
      {/* Previous Button */}
      <Button
        onClick={handlePrevious}
        variant="outline"
        className="cursor-pointer rounded-full border-main-100 px-10 py-3 text-sm font-medium text-main-100 hover:border-blue-700 hover:text-blue-700"
        disabled={step === 1}
      >
        Previous
      </Button>

      {/* Next/Submit Button with Loading Indicator */}

      {!isLastStep && (
        <Button
          onClick={handleNext2}
          className={`cursor-pointer rounded-full px-14 py-3 text-sm font-medium text-white ${
            isLoading ? "bg-gray-400" : "bg-main-100 hover:bg-blue-700"
          }`}
          disabled={isLoading} // Disable the button while loading
        >
          Next
        </Button>
      )}
      {isLastStep && (
        <Button
          onClick={handleNext}
          className={`cursor-pointer rounded-full px-14 py-3 text-sm font-medium text-white ${
            isLoading ? "bg-gray-400" : "bg-main-100 hover:bg-blue-700"
          }`}
          disabled={isLoading} // Disable the button while loading
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="mr-2 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Loading...
            </span>
          ) : isLastStep ? (
            "Submit"
          ) : (
            "Next"
          )}
        </Button>
      )}
    </div>
  );
};

export default StepperControl;
