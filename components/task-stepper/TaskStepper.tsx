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
  value?: string;
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

import React, { useEffect, useState } from "react";

import { useStepper } from "@/context/TaskStepperContext.tsx";
import DynamicQuestion from "./task_question_1";
import SuccessModal from "./customSuccess";
import { useSuccessModalStore } from "@/stores/misc";
import { useRouter, useSearchParams } from "next/navigation";

const TaskStepper = ({
  response,
  reftechResponse,
  quest,
}: {
  reftechResponse: any;
  response: any;
  quest: { question_groups: QuestionGroup[]; ungrouped_questions: Question[] };
}) => {
  const { isModalOpen, closeModal, isLastStepLoading } = useSuccessModalStore();
  const { step, setStep } = useStepper();
  const { question_groups, ungrouped_questions } = quest;

  console.log("questions", quest);

  const [isFirstTime, setIsFirstTime] = useState(
    localStorage.getItem("firstTime"),
  );

  const allGroups = [
    ...(ungrouped_questions.length > 0
      ? [{ order: 1, questions: ungrouped_questions }]
      : []),
    ...question_groups.map((group, index) => ({
      ...group,
      order: ungrouped_questions.length > 0 ? index + 2 : index + 1, // Adjust order based on ungrouped_questions
    })),
  ];
  /***
  const allGroups = [
    ...(ungrouped_questions.length > 0
      ? [{ order: 1, questions: ungrouped_questions }]
      : []),
    ...question_groups.map((group, index) => ({
      ...group,
      order: index + 2, // Start from 2 since ungrouped questions have order 1
    })),
  ];
  */

  // console.log(allGroups);

  const totalQuestions = allGroups.reduce((sum, group) => {
    return sum + (group.questions ? group.questions.length : 0);
  }, 0);

  // console.log(step);

  // const currentGroup = allGroups.find((group) => group.order === step);

  const currentGroup = allGroups.find((group) => group.order === step);

  console.log(currentGroup);

  const isLastStep = step === allGroups.length;

  const res = response?.data;

  //  console.log(res);

  const router = useRouter();
  const searchParams = useSearchParams();
  //@ts-ignore
  const local_id = searchParams.get("responseID") || "0";

  console.log(step);

  // Function to check if the page is being loaded for the first time
  const isFirstLoad = () => {
    const isFirstLoadFlag = localStorage.getItem("isFirstLoad");
    const responseId = localStorage.getItem("responseId");
    return isFirstLoadFlag === null && responseId === null;
  };

  const setFirstLoadFlag = () => {
    localStorage.setItem("isFirstLoad", "isloading");
    localStorage.setItem("responseId", local_id.toString());
  };

  // console.log(setFirstLoadFlag());

  const isCurrentResponse = () => {
    const responseId = localStorage.getItem("responseId");
    return responseId === local_id.toString();
  };

  const findUnansweredQuestion = (answers: any) => {
    for (const group of allGroups) {
      const unansweredQuestion = group.questions.find((question) => {
        const answer = answers.find(
          (ans: any) => ans.question.id === question.id,
        );
        return !answer || !answer.value;
      });

      if (unansweredQuestion) {
        return group.order;
      }
    }
    return null; // Return null if all questions are answered
  };

  // Function to update the step and URL
  const updateStepAndURL = (newStep: any) => {
    if (step !== newStep) {
      setStep(newStep);

      // Update URL with the new step
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("step", newStep.toString());
      router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
    }
  };
  //console.log(isCurrentResponse());
  // Run only on the first page load for the current response
  useEffect(() => {
    if (isFirstLoad()) {
      setFirstLoadFlag();
    }
    if (localStorage.getItem("isFirstLoad") === "loaded") {
      return;
    }
    if (isCurrentResponse()) {
      const { answers } = response?.data || {};

      if (!answers) return; // Exit if answers are not available

      const groupOrderWithUnansweredQuestion = findUnansweredQuestion(answers);

      if (groupOrderWithUnansweredQuestion !== null) {
        updateStepAndURL(groupOrderWithUnansweredQuestion);
      }

      localStorage.setItem("isFirstLoad", "loaded");
      localStorage.setItem("responseId", local_id.toString());
    }
  }, [isFirstLoad, local_id]);

  useEffect(() => {
    if (response === undefined) {
      reftechResponse();
    }
  }, []);

  return currentGroup ? (
    <div>
      <DynamicQuestion
        response={res}
        //@ts-ignore
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
