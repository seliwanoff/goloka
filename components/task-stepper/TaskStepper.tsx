import { useStepper } from "@/context/TaskStepperContext.tsx";
import React from "react";
import QuestionOne from "./task_question_1";

const TaskStepper = () => {
  const { step } = useStepper();

  switch (step) {
    case 1:
      return <QuestionOne />;
    case 2:
      return "<QuestionTwo />";
    //  return <QuestionTwo />;
    // Add more cases for each question...
    default:
      return <div>All questions completed!</div>;
  }
};

export default TaskStepper;
