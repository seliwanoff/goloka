type Question = {
  id: string | number;
  type:
    | "text"
    | "textarea"
    | "radio"
    | "checkbox"
    | "dropdown"
    | "date"
    | "file"
    | "photo"
    | "video"
    | "audio"
    | "password"
    | "email"
    | "tel"
    | "number";
};

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ImagePlus, FileVideo2 } from "lucide-react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStepper } from "@/context/TaskStepperContext.tsx";
import StepperControl from "./StepperControl";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { createContributorAnswers } from "@/services/contributor";
import Image from "next/image";
import LocationDropdown from "./inputs/customLocation";
import LocationSelector from "./inputs/customLineLocation";
import AudioRecorder from "./customAudioRecorder";
import FileUpload from "./fileUpload";
import CustomAreaInput from "./inputs/customAreaInput";
import SuccessModal from "./customSuccess";
import { useSuccessModalStore } from "@/stores/misc";
import { uploadQuestionFile } from "@/services/misc";

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
  const searchParams = useSearchParams();
  const responseId = searchParams.get("responseID");
  const { openModal } = useSuccessModalStore();
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

  const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  console.log(responseId, "responseID");

  // useEffect(() => {
  //   if (responseID?.includes("/")) {
  //     //@ts-ignore
  //     setFinalResponseID(responseID.split("/")[0]);
  //   } else {
  //     setFinalResponseID(responseID as string);
  //   }
  // }, [responseID]);

  // useEffect(() => {
  //   const initialAnswers: Record<string | number, any> = {};
  //   questions.forEach((ques) => {
  //     initialAnswers[ques.id] =
  //       answers[ques.id] || (ques.type === "checkbox" ? [] : "");
  //   });
  //   setSelectedValues(initialAnswers);
  // }, [questions, answers]);
  useEffect(() => {
    const initialAnswers: Record<string | number, any> = {};
    questions.forEach((ques) => {
      // Prioritize existing answers from the stepper context
      initialAnswers[ques.id] =
        answers[ques.id] || (ques.type === "checkbox" ? [] : "");
    });
    setSelectedValues(initialAnswers);
  }, [questions, answers]);

  // const handleInputChange = (
  //   value: string | boolean | File | string[],
  //   quesId: string | number,
  //   type?: string,
  // ) => {
  //   if (type === "file" && value instanceof File) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFilePreviews((prev) => ({
  //         ...prev,
  //         [quesId]: reader.result as string,
  //       }));
  //     };
  //     reader.readAsDataURL(value);
  //   }

  //   if (type === "location" || "line") {
  //     setSelectedValues((prev) => ({
  //       ...prev,
  //       [quesId]: value,
  //     }));
  //     return;
  //   }

  //   setSelectedValues((prev) => ({
  //     ...prev,
  //     [quesId]: value,
  //   }));
  // };

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

    if (type === "location" || "line" || "area") {
      setSelectedValues((prev) => ({
        ...prev,
        [quesId]: value,
      }));
      return;
    }

    setSelectedValues((prev) => ({
      ...prev,
      [quesId]: value,
    }));
  };

  console.log(selectedValues, "selectedValues");
  console.log(answers, "answers");

  // const handleNext = async () => {
  //   const allAnswered = questions.every(({ id, type }) => {
  //     const value = selectedValues[id];

  //     switch (type) {
  //       case "text":
  //       case "textarea":
  //       case "email":
  //       case "tel":
  //       case "password":
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
  //       case "file":
  //         return value instanceof File;
  //       default:
  //         return true;
  //     }
  //   });

  //   if (!allAnswered) {
  //     toast.error("Please answer all questions before proceeding");
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     // Format the answers to be submitted
  //     const formattedAnswers = {
  //       answers: Object.keys(selectedValues).map((key) => {
  //         const value = selectedValues[key];
  //         return {
  //           question_id: Number(key),
  //           value: Array.isArray(value) ? value : value,
  //           //  value: Array.isArray(value) ? value : [value],
  //         };
  //       }),
  //     };

  //     // Submit the formatted answers
  //     await createContributorAnswers(id as string, formattedAnswers);
  //     nextStep();
  //   } catch (err) {
  //     console.log("Error submitting answers:", err);
  //     toast.error("Failed to save answers. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleNext = async () => {
    const allAnswered = questions.every(({ id, type }) => {
      const value = selectedValues[id];

      switch (type) {
        case "text":
        case "textarea":
        case "email":
        case "tel":
        case "password":
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
        case "file":
        case "photo":
        case "video":
        case "audio":
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
      // Filter and prepare answers for non-file types
      const formattedAnswers = {
        answers: Object.keys(selectedValues)
          .filter((key) => {
            const type = questions.find((q) => q.id === Number(key))?.type;
            return !["file", "photo", "video", "audio"].includes(type ?? "");
          })
          .map((key) => {
            const value = selectedValues[key];
            return {
              question_id: Number(key),
              value: Array.isArray(value) ? value : value,
            };
          }),
      };

      // Extract file-related questions
      const fileQuestions = questions.filter((q) =>
        ["file", "photo", "video", "audio"].includes(q.type),
      );
      console.log(fileQuestions, "fileQuestions");
      console.log(formattedAnswers, "formattedAnswers");
      // Prepare FormData for file uploads
      const formData = new FormData();
      fileQuestions.forEach((currentQuestion) => {
        const value = selectedValues[currentQuestion.id];
        if (value) {
          const file = value as File;
          const ext = file.name.split(".").pop(); 
          formData.append(
            `${currentQuestion.type}s[${currentQuestion.id}]`,
            new File([file], `${currentQuestion.id}.${ext}`, {
              type: file.type,
            }),
          );
        }
      });

      // Submit non-file answers
      const answerResponse = await createContributorAnswers(
        responseId as string,
        formattedAnswers,
      );

      // Submit file-related questions
      if (fileQuestions.length > 0) {
        await uploadQuestionFile(responseId as string, formData);
      }

      // Update answers in the stepper context
      questions.forEach((ques) => {
        updateAnswer(ques.id, selectedValues[ques.id]);
      });

      // Success feedback
      //@ts-ignore
      toast.success(answerResponse?.message);

      if (isLastStep) {
        openModal();
      }

      // Move to the next step
      nextStep();
    } catch (err) {
      console.error(err);
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
                      value={opt?.value!}
                      id={`q${ques.id}-${index}`}
                      className="hidden"
                    />
                    <Label
                      htmlFor={`q${ques.id}-${index}`}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border border-[#D9DCE0] p-2.5 pr-3 transition-colors duration-200 ease-in-out",
                        selectedValues[ques.id] === opt?.value &&
                          "border-main-100",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F8] text-[#828282]",
                          selectedValues[ques.id] === opt?.value &&
                            "bg-main-100 text-white",
                        )}
                      >
                        {index}
                      </span>
                      <p
                        className={cn(
                          "text-sm text-[#101828]",
                          selectedValues[ques.id] === opt?.value &&
                            "text-main-100",
                        )}
                      >
                        {opt?.label}
                      </p>
                    </Label>
                  </div>
                ),
              )}
            </RadioGroup>
          </div>
        );

      case "video":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="file"
              accept="video/*" // Specifies that only video files are accepted
              id={ques.name}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleInputChange(file, ques.id, "file");
                }
              }}
              className="hidden"
            />
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => inputRefs.current[ques.id]?.click()}
                className="relative flex h-40 items-center justify-center rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="flex w-fit cursor-pointer flex-col rounded-lg px-4 py-2 text-sm font-medium text-[#3365E3]">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center self-center rounded-full border border-dashed border-slate-300 bg-slate-200">
                      <FileVideo2 />
                    </div>
                    <span>Upload Video</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    JPEG size should not be more than 1MB
                  </span>
                </div>
              </button>
              {filePreviews[ques.id] && (
                <div className="relative h-32 w-32">
                  <video
                    controls
                    src={filePreviews[ques.id]}
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
                          (item: string) => item !== opt?.value,
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
                    {opt?.label}
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
      case "location":
        return (
          <div className="col-span-2">
            <LocationDropdown
              questionId={ques.id}
              onLocationSelect={(location) =>
                handleInputChange(location, ques.id)
              }
            />
          </div>
        );
      case "line":
        return (
          <div className="col-span-2">
            <LocationSelector
              apiKey={KEY as string}
              questionId={ques.id}
              onLocationSelect={(locations) =>
                //@ts-ignore
                handleInputChange(locations, ques.id, "location")
              }
            />
          </div>
        );
      case "area":
        return (
          <div className="col-span-2">
            <CustomAreaInput
              apiKey={KEY as string}
              questionId={ques.id}
              onLocationSelect={(locations) =>
                //@ts-ignore
                handleInputChange(locations, ques.id, "location")
              }
            />
          </div>
        );
      case "email":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="email"
              value={selectedValues[ques.id] || ""}
              id={ques.name}
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
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );
      case "password":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="password"
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
              <option value="">Select an option</option>
              {ques.options?.map(
                (opt: any, index: React.Key | null | undefined) => (
                  <option key={index} value={opt?.value}>
                    {opt?.label}
                  </option>
                ),
              )}
            </select>
          </div>
        );
      case "photo":
        return (
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
              // @ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
            />
            <div className="flex flex-col gap-4">
              {/* image container */}
              <div
                onClick={() => inputRefs.current[ques.id]?.click()}
                className="relative flex h-40 items-center justify-center rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] text-center"
              >
                {filePreviews[ques.id] ? (
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <Image
                      src={filePreviews[ques.id]}
                      alt="Preview"
                      className="w-full"
                      layout="fill"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex w-fit cursor-pointer flex-col rounded-lg px-4 py-2 text-sm font-medium text-[#3365E3]">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center self-center rounded-full border border-dashed border-slate-300 bg-slate-200">
                        <ImagePlus />
                      </div>
                      <span>Upload Photo</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      JPEG size should not be more than 1MB
                    </span>
                  </div>
                )}
              </div>

              {filePreviews[ques.id] && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                  <Image
                    src={filePreviews[ques.id]}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    layout="fill"
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
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
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
      case "audio":
        return (
          <div className="col-span-2">
            <AudioRecorder />
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
      case "file":
        return (
          <div className="col-span-2">
            <FileUpload />
          </div>
        );

      default:
        return null;
    }
  };

  console.log(questions, "questionsquestions");

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

      {questions?.map((ques: any) => (
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
