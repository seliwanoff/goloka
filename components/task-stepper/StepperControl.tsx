// import React from "react";
// import { useStepper } from "@/context/TaskStepperContext.tsx";
// import { Button } from "../ui/button";

// type ComponentProps = {
//   next: () => void;
// };

// const StepperControl: React.FC<ComponentProps> = ({ next }) => {
//   const { prevStep } = useStepper();

//   return (
//     <div className="mt-10 flex justify-evenly p-5">
//       <Button
//         onClick={prevStep}
//         variant="outline"
//         className="cursor-pointer rounded-full border-main-100 px-10 py-3 text-sm font-medium text-main-100 hover:border-blue-700 hover:text-blue-700"
//       >
//         Previous
//       </Button>
//       <Button
//         onClick={next}
//         className="cursor-pointer rounded-full bg-main-100 px-10 py-3 text-sm font-medium text-white hover:bg-blue-700"
//       >
//         Next
//       </Button>
//     </div>
//   );
// };

// export default StepperControl;

import React from "react";

import { Button } from "../ui/button";
import { useStepper } from "@/context/TaskStepperContext.tsx";

interface StepperControlProps {
  next: () => void;
  isLastStep?: boolean;
}

const StepperControl: React.FC<StepperControlProps> = ({
  next,
  isLastStep = false,
}) => {
  const { prevStep, step, totalSteps } = useStepper();

  return (
    <div className="mt-10 flex justify-evenly p-5">
      <Button
        onClick={prevStep}
        variant="outline"
        className="cursor-pointer rounded-full border-main-100 px-10 py-3 text-sm font-medium text-main-100 hover:border-blue-700 hover:text-blue-700"
        disabled={step === 1}
      >
        Previous
      </Button>
      <Button
        onClick={next}
        className="cursor-pointer rounded-full bg-main-100 px-10 py-3 text-sm font-medium text-white hover:bg-blue-700"
      >
        {isLastStep ? "Submit" : "Next"}
      </Button>
    </div>
  );
};

export default StepperControl;

