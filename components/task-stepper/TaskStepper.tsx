import { useStepper } from "@/context/TaskStepperContext.tsx";
import React from "react";
import QuestionOne from "./task_question_1";
import QuestionTwo from "./task_question_2";
import QuestionThree from "./task_question_3";
import QuestionFour from "./task_question_4";

const TaskStepper = () => {
  const { step } = useStepper();

  switch (step) {
    case 1:
      return <QuestionOne />;
    case 2:
      return <QuestionTwo />;
    case 3:
      return <QuestionThree />;
    case 4:
      return <QuestionFour />;
  }
};

export default TaskStepper;
