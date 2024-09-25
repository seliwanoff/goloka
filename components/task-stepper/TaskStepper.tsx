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
import { useStepper } from "@/context/TaskStepperContext.tsx";
import React from "react";


import DynamicQuestion from "./task_question_1";

const TaskStepper = (quest: any) => {
  const { step } = useStepper();
  const { question_groups, ungrouped_questions } = quest?.quest;

  console.log(question_groups, "question_groups");

  // Combine grouped and ungrouped questions
  const allQuestions = [...question_groups, ...ungrouped_questions];

  console.log(allQuestions,"uju");

  // Get the questions for the current step
  const currentGroup = question_groups?.find((group: { order: number; }) => group.order === step);

  return currentGroup ? (
    <DynamicQuestion questions={currentGroup.questions} />
  ) : (
    <div>No questions available for this step</div>
  );
};

export default TaskStepper;
