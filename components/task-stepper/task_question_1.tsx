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
};

type SelectedValues = Record<
  string | number,
  string | string[] | number | null
>;

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStepper } from "@/context/TaskStepperContext.tsx";
import StepperControl from "./StepperControl";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { createContributorAnswers } from "@/services/contributor";
import Image from "next/image";

const options = (index: number) => {
  switch (index) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
  }
};

const DynamicQuestion = ({
  questions,
  isUngrouped = false,
  isLastStep,
  title,
  questionsLength,
  totalQuestions,
}: {
  questions: Question[];
  isUngrouped?: boolean;
  isLastStep?: boolean;
  title?: string;
  questionsLength: number;
  totalQuestions: number;
}) => {
  const { answers, nextStep, updateAnswer, step } = useStepper();
  const [selectedValues, setSelectedValues] = useState<
    Record<string | number, any>
  >({});
  const [filePreviews, setFilePreviews] = useState<
    Record<string | number, string>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<
    Record<string | number, HTMLInputElement | HTMLTextAreaElement | null>
  >({});
  const { id: taskId } = useParams();
  useEffect(() => {
    const initialAnswers: Record<string | number, any> = {};
    questions.forEach((ques) => {
      initialAnswers[ques.id] =
        answers[ques.id] || (ques.type === "checkbox" ? [] : "");
    });
    setSelectedValues(initialAnswers);
  }, [questions, answers]);

  const handleInputChange = (
    value: string | boolean | File | string[],
    quesId: string | number,
    type?: string,
  ) => {
    if (type === "file" && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prev) => ({
          ...prev,
          [quesId]: reader.result as string,
        }));
      };
      reader.readAsDataURL(value);
    }

    setSelectedValues((prev) => ({
      ...prev,
      [quesId]: value,
    }));
  };

  // const handleNext = () => {
  //   const allAnswered = questions.every(({ id, type }) => {
  //     const value = selectedValues[id];

  //     switch (type) {
  //       case "text":
  //       case "textarea":
  //         return typeof value === "string" && value.trim().length > 0;
  //       case "radio":
  //       case "dropdown":
  //         return value !== null && value !== "";
  //       case "checkbox":
  //         return Array.isArray(value) && value.length > 0;
  //       case "date":
  //         return typeof value === "string" && !isNaN(new Date(value).getTime());
  //       case "number":
  //         return typeof value === "number" && !isNaN(value);
  //       default:
  //         return true;
  //     }
  //   });
  //   console.log(allAnswered, "allAnswered");
  //   if (allAnswered) {
  //     nextStep();
  //   } else {
  //     toast.error("Please answer all questions before proceeding");
  //   }
  // };

  const handleNext = async () => {
    const allAnswered = questions.every(({ id, type }) => {
      const value = selectedValues[id];

      switch (type) {
        case "text":
        case "textarea":
          return typeof value === "string" && value.trim().length > 0;
        case "radio":
        case "dropdown":
          return value !== null && value !== "";
        case "checkbox":
          return Array.isArray(value) && value.length > 0;
        case "date":
          return typeof value === "string" && !isNaN(new Date(value).getTime());
        case "number":
          return typeof value === "number" && !isNaN(value);
        //@ts-ignore
        case "file":
          return value instanceof File;
        default:
          return true;
      }
    });

    if (!allAnswered) {
      toast.error("Please answer all questions before proceeding");
      return;
    }

    setIsLoading(true);
    try {
      const formattedAnswers = {
        answers: Object.keys(selectedValues).map((key) => ({
          question_id: Number(key),
          value: Array.isArray(selectedValues[key])
            ? { answer: selectedValues[key] }
            : { answer: selectedValues[key] },
        })),
      };

      await createContributorAnswers(taskId as string, formattedAnswers);
      nextStep();
    } catch (err) {
      toast.error("Failed to save answers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestion = (ques: any) => {
    switch (ques.type) {
      case "text":
      case "textarea":
        return (
          <div className="col-span-2">
            {ques.type === "textarea" ? (
              <textarea
                //@ts-ignore
                ref={(el) => (inputRefs.current[ques.id] = el)}
                value={selectedValues[ques.id] || ""}
                id={ques.name}
                placeholder={ques.placeholder || "Enter your answer"}
                onChange={(e) => handleInputChange(e.target.value, ques.id)}
                className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
              />
            ) : (
              <input
                //@ts-ignore
                ref={(el) => (inputRefs.current[ques.id] = el)}
                type="text"
                value={selectedValues[ques.id] || ""}
                id={ques.name}
                placeholder={ques.placeholder || "Enter your answer"}
                onChange={(e) => handleInputChange(e.target.value, ques.id)}
                className="form-input w-full rounded-lg border-[#D9DCE0] p-4"
              />
            )}
          </div>
        );

      case "radio":
        return (
          <div className="col-span-2">
            <RadioGroup
              value={selectedValues[ques.id] || ""}
              onValueChange={(val) => handleInputChange(val, ques.id)}
              className="grid grid-cols-2 gap-5"
            >
              {ques.options?.map(
                (opt: any, index: React.Key | null | undefined) => (
                  <div className="group w-full" key={index}>
                    <RadioGroupItem
                      //@ts-ignore
                      ref={(el) => (inputRefs.current[ques.id] = el)}
                      value={opt!}
                      id={`q${ques.id}-${index}`}
                      className="hidden"
                    />
                    <Label
                      htmlFor={`q${ques.id}-${index}`}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border border-[#D9DCE0] p-2.5 pr-3 transition-colors duration-200 ease-in-out",
                        selectedValues[ques.id] === opt && "border-main-100",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F8] text-[#828282]",
                          selectedValues[ques.id] === opt &&
                            "bg-main-100 text-white",
                        )}
                      >
                        {index}
                      </span>
                      <p
                        className={cn(
                          "text-sm text-[#101828]",
                          selectedValues[ques.id] === opt && "text-main-100",
                        )}
                      >
                        {opt}
                      </p>
                    </Label>
                  </div>
                ),
              )}
            </RadioGroup>
          </div>
        );

      case "checkbox":
        return (
          <div className="col-span-2 grid grid-cols-2 gap-5">
            {ques.options?.map(
              (opt: any, index: React.Key | null | undefined) => (
                <div key={index} className="group flex items-center gap-3">
                  <Checkbox
                    //@ts-ignore
                    ref={(el) => (inputRefs.current[ques.id] = el)}
                    id={`q${ques.id}-${index}`}
                    checked={selectedValues[ques.id]?.includes(opt) || false}
                    onCheckedChange={(checked) => {
                      const currentSelections = selectedValues[ques.id] || [];
                      let newSelections;
                      if (checked) {
                        newSelections = [...currentSelections, opt];
                      } else {
                        newSelections = currentSelections.filter(
                          (item: string) => item !== opt,
                        );
                      }
                      handleInputChange(newSelections, ques.id);
                    }}
                    className="form-checkbox h-5 w-5 text-main-100"
                  />
                  <Label
                    htmlFor={`q${ques.id}-${index}`}
                    className="text-sm text-[#101828]"
                  >
                    {opt}
                  </Label>
                </div>
              ),
            )}
          </div>
        );

      case "number":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="number"
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );

      case "range":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="range"
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-range w-full rounded-lg"
              min={ques.attributes?.min}
              max={ques.attributes?.max}
              step={ques.attributes?.step}
            />
          </div>
        );

      case "select":
        return (
          <div className="col-span-2">
            <select
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              id={ques.name}
              value={selectedValues[ques.id] || ""}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-select w-full rounded-lg border-[#D9DCE0]"
            >
              {ques.options?.map(
                (opt: any, index: React.Key | null | undefined) => (
                  <option key={index} value={opt}>
                    {opt}
                  </option>
                ),
              )}
            </select>
          </div>
        );

      case "file":
        return (
          // <div className="col-span-2">
          //   <input
          //     type="file"
          //     accept={"*/*"}
          //     id={ques.name}
          //     onChange={(e) => {
          //       const file = e.target.files?.[0];
          //       if (file) {
          //         handleInputChange(file, ques.id);
          //       }
          //     }}
          //     className="form-input w-full rounded-lg border-[#D9DCE0]"
          //   />
          // </div>

          <div className="col-span-2">
            <input
              type="file"
              accept="image/*"
              id={ques.name}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleInputChange(file, ques.id, "file");
                }
              }}
              className="hidden"
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
            />
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => inputRefs.current[ques.id]?.click()}
                className="w-fit rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Choose File
              </button>
              {filePreviews[ques.id] && (
                <div className="relative h-32 w-32">
                  <Image
                    src={filePreviews[ques.id]}
                    alt="Preview"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedValues((prev) => ({
                        ...prev,
                        [ques.id]: null,
                      }));
                      setFilePreviews((prev) => ({
                        ...prev,
                        [ques.id]: "",
                      }));
                    }}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case "date":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="date"
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );

      // Additional Input Types
      case "url":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="url"
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              placeholder={ques.placeholder || "Enter URL"}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );

      case "tel":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="tel"
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              placeholder={ques.placeholder || "Enter phone number"}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );

      case "time":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="time"
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  console.log(selectedValues, "gjgjfgkgf");

  return (
    <div className="space-y-5">
      <>
        {isUngrouped ? (
          <h2 className="mb-6 text-xl font-semibold text-neutral-900">
            Additional Questions
          </h2>
        ) : (
          <h3 className="mb-6 text-xl font-semibold text-neutral-900">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block font-medium text-neutral-600">
              <span className="text-main-100">{step}</span>/{questionsLength}
            </span>
            <div className="flex gap-1">
              {Array.from(
                { length: questionsLength },
                (_: any, index: number) => (
                  <span
                    key={index}
                    className={cn(
                      "inline-block h-1 w-3 rounded-full bg-neutral-200",
                      step >= index + 1 && "bg-main-100",
                      step === index + 1 && "w-5",
                    )}
                  ></span>
                ),
              )}
            </div>
          </div>

          <span className="text-sm text-neutral-500">
            <span className="font-semibold text-neutral-900">
              {totalQuestions}
            </span>{" "}
            Questions
          </span>
        </div>
      </>

      {questions.map((ques: any) => (
        <div key={ques.id} className="grid grid-cols-[24px_1fr] gap-3">
          <Label
            htmlFor={ques.name}
            className="w-60 truncate text-base leading-7 tracking-[3%] text-[#333333]"
          >
            {ques.label}
          </Label>
          {renderQuestion(ques)}
        </div>
      ))}
      <StepperControl
        isLastStep={isLastStep}
        next={handleNext}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DynamicQuestion;
