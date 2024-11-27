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
import SuccessModal from "./customSuccess";
import { useSuccessModalStore } from "@/stores/misc";

const TaskStepper = ({
  quest,
}: {
  quest: { question_groups: QuestionGroup[]; ungrouped_questions: Question[] };
}) => {
  const { isModalOpen, closeModal, isLastStepLoading } = useSuccessModalStore();
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
    <div>
      <DynamicQuestion
        questions={currentGroup.questions}
        isUngrouped={step === question_groups.length + 1}
        isLastStep={isLastStep}
        title={currentGroup.name}
        questionsLength={allGroups.length}
        totalQuestions={totalQuestions}
      />
      {isModalOpen && <SuccessModal />}
      <LoadingOverlay isVisible={isLastStepLoading} />
    </div>
  ) : (
    <div>No questions available for this Campaign</div>
  );
};

export default TaskStepper;

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-spin">
        <svg
          className="h-16 w-16 text-blue-500"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
};
