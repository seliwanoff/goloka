// import { useStepper } from "@/context/TaskStepperContext.tsx";
// import React from "react";
// import QuestionOne from "./task_question_1";
// import QuestionTwo from "./task_question_2";
// import QuestionThree from "./task_question_3";
// import QuestionFour from "./task_question_4";

// const TaskStepper = () => {
//   const { step } = useStepper();

//   switch (step) {
//     case 1:
//       return <QuestionOne />;
//     case 2:
//       return <QuestionTwo />;
//     case 3:
//       return <QuestionThree />;
//     case 4:
//       return <QuestionFour />;
//   }
// };

// export default TaskStepper;
// import { useStepper } from "@/context/TaskStepperContext.tsx";
// import React from "react";


// import DynamicQuestion from "./task_question_1";

// const TaskStepper = (quest: any) => {
//   const { step } = useStepper();
//   const { question_groups, ungrouped_questions } = quest?.quest;

//   console.log(question_groups, "question_groups");

//   // Combine grouped and ungrouped questions
//   const allQuestions = [...question_groups, ...ungrouped_questions];

//   console.log(allQuestions,"uju");

//   // Get the questions for the current step
//   const currentGroup = question_groups?.find((group: { order: number; }) => group.order === step);

//   return currentGroup ? (
//     <DynamicQuestion questions={currentGroup.questions} />
//   ) : (
//     <div>No questions available for this step</div>
//   );
// };




// Types
type Question = {
  id: string | number;
  type: "text" | "textarea" | "radio" | "checkbox" | "dropdown" | "date" | "number";
  name?: string;
  label: string;
  options?: string[];
  placeholder?: string;
  attributes?: {
    accept?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
  };
};

type QuestionGroup = {
  order: number;
  title?: string;
  questions: Question[];
};

import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { useStepper } from "@/context/TaskStepperContext.tsx";
import StepperControl from "./StepperControl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DynamicQuestion from "./task_question_1";


const TaskStepper = ({
  quest,
}: {
  quest: { question_groups: QuestionGroup[]; ungrouped_questions: Question[] };
}) => {
  const { step } = useStepper();
  const { question_groups, ungrouped_questions } = quest;

  const allGroups = [
    ...question_groups,
    ...(ungrouped_questions.length > 0
      ? [{ order: question_groups.length + 1, questions: ungrouped_questions }]
      : []),
  ];

  const currentGroup = allGroups.find((group) => group.order === step);
  const isLastStep = step === allGroups.length;

  return currentGroup ? (
    <DynamicQuestion
      questions={currentGroup.questions}
      isUngrouped={step === question_groups.length + 1}
      isLastStep={isLastStep}
    />
  ) : (
    <div>No questions available for this step</div>
  );
};


export default TaskStepper;