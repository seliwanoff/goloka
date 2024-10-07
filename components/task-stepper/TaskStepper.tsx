// Types
type Question = {
  id: string | number;
  type:
    | "text"
    | "textarea"
    | "radio"
    | "checkbox"
    | "dropdown"
    | "date"
    | "number";
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
  name?: string;
  questions: Question[];
};

import React from "react";

import { useStepper } from "@/context/TaskStepperContext.tsx";
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
  const totalQuestions = allGroups.reduce((sum, group) => {
    return sum + (group.questions ? group.questions.length : 0);
  }, 0);

  console.log(totalQuestions);

  const currentGroup = allGroups.find((group) => group.order === step);
  const isLastStep = step === allGroups.length;

  // console.log(currentGroup, "currentGroupcurrentGroup");
  // console.log(allGroups, "allGroups");

  return currentGroup ? (
    <DynamicQuestion
      questions={currentGroup.questions}
      isUngrouped={step === question_groups.length + 1}
      isLastStep={isLastStep}
      title={currentGroup.name}
      questionsLength={allGroups.length}
      totalQuestions={totalQuestions}
    />
  ) : (
    <div>No questions available for this step</div>
  );
};

export default TaskStepper;
