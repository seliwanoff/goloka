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
    | "number"
    | "location"
    | "area"
    | "line";
  attributes: null | Record<string, any>;
  label: string;
  name: string;
  options: null | Array<{ value: string; label: string }>;
  order: number;
  placeholder: string;
  required: boolean | 0 | 1;
};

interface Answer {
  id: number;
  value: string;
  question: Question;
}

interface IData {
  id: number;
  status: string;
  campaign_id: number;
  campaign_title: string;
  payment_rate_for_response: string;
  organization: string;
  created_at: string;
  unread_messages_count: number;
  answers: Answer[];
}

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ImagePlus, FileVideo2, Camera } from "lucide-react";
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
// import AudioRecorder from "./customAudioRecorder";
import FileUpload from "./fileUpload";
import CustomAreaInput from "./inputs/customAreaInput";
import SuccessModal from "./customSuccess";
import { useSuccessModalStore } from "@/stores/misc";
import { uploadQuestionFile } from "@/lib/api";
import { submitResponseEndpoint } from "@/services/response";

import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import VideoRecorder from "./inputs/videoRecorder";

const AudioRecorder = dynamic(() => import("./customAudioRecorder"), {
  ssr: false,
  loading: () => <div>Loading audio recorder...</div>,
});

const DynamicQuestion = ({
  questions,
  isUngrouped = false,
  isLastStep,
  title,
  questionsLength,
  totalQuestions,
  response,
}: {
  questions: Question[];
  isUngrouped?: boolean;
  isLastStep?: boolean;
  title?: string;
  questionsLength: number;
  totalQuestions: number;
  response: IData;
}) => {
  const searchParams = useSearchParams();
  const responseId = searchParams.get("responseID");
  const { openModal, setLastStepLoading } = useSuccessModalStore();
  const { answers, nextStep, updateAnswer, step } = useStepper();
  const [selectedValues, setSelectedValues] = useState<
    Record<string | number, any>
  >({});

  const [qId, setQid] = useState("");

  const [filePreviews, setFilePreviews] = useState<
    Record<string | number, string>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<
    Record<
      string | number,
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLButtonElement
      | HTMLSelectElement
      | null
    >
  >({});

  const queryClient = useQueryClient();

  //console.log(questions, "checking questions");
  const startingQuestionNumber = 1;
  const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  //console.log(response?.answers, "responseresponse");
  // Prefill logic for initial values
  useEffect(() => {
    const initialAnswers: Record<string | number, any> = questions.reduce(
      (acc, ques) => {
        const matchingAnswer = response?.answers?.find(
          (ans) => ans.question.id === ques.id,
        );

        acc[ques.id] =
          answers[ques.id] || (matchingAnswer ? matchingAnswer.value : "");

        return acc;
      },
      {} as Record<string | number, any>,
    );

    // Directly update the state with initialAnswers
    setSelectedValues(initialAnswers);
  }, [questions, answers, response?.answers]);

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
  //   if (type === "location" || type === "line" || type === "area") {
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
    value: string | boolean | File | string[] | Location[] | null,
    quesId: string | number,
    type?: string,
    areaNumber?: string,
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
      //  onInputedAnswerMonitoring(quesId);
    }

    // Special handling for area type
    if (type === "area") {
      setSelectedValues((prev) => {
        // If the new value is an array of locations, merge or replace existing locations
        if (Array.isArray(value)) {
          const existingLocations = prev[quesId] || [];

          // Merge new locations, removing duplicates based on id
          const mergedLocations = [
            ...existingLocations.filter(
              (existingLoc: { id: any }) =>
                //@ts-ignore
                !value.some((newLoc) => newLoc.id === existingLoc.id),
            ),
            ...value,
          ];

          return {
            ...prev,
            [quesId]: mergedLocations,
          };
        }

        // Fallback for non-array values
        return {
          ...prev,
          [quesId]: value,
        };
      });

      console.log(value);
      //@ts-ignore

      if (value.length === 4) {
        //@ts-ignore
        setQid(quesId);
      }
      //setQid(quesId)
      return;
    }

    // Keep existing behavior for location, line, and other types
    if (type === "location" || type === "line") {
      setSelectedValues((prev) => ({
        ...prev,
        [quesId]: value,
      }));
      //@ts-ignore

      if (value.length === 2 && type === "line") {
        //@ts-ignore

        setQid(quesId);
      }

      //   console.log(type);
      //@ts-ignore
      if (type === "location") {
        //@ts-ignore

        setQid(quesId);
      }
      return;
    }

    // Default behavior for other types
    setSelectedValues((prev) => ({
      ...prev,
      [quesId]: value,
    }));
  };
  useEffect(() => {
    if (selectedValues[qId] !== undefined) {
      onInputedAnswerMonitoring(qId);
    }
  }, [selectedValues[qId]]);

  // Use useEffect to monitor changes in filePreviews and call onInputedAnswerMonitoring
  useEffect(() => {
    if (filePreviews[qId] !== undefined) {
      onInputedAnswerMonitoring(qId);
    }
  }, [filePreviews[qId]]);
  const nextStepNext = async () => {
    const requiredQuestions = questions.filter((q) => q.required === 1);
    const missingRequiredQuestions = requiredQuestions.filter((q) => {
      const value = selectedValues[q.id];
      if (value === undefined || value === null || value === "") return true;
      if (Array.isArray(value) && value.length === 0) return true;
      if (["file", "photo", "video", "audio"].includes(q.type)) {
        return !(
          value &&
          ((typeof value === "object" &&
            "file" in value &&
            value.file instanceof File) ||
            value instanceof File ||
            (typeof value === "string" && value.trim() !== ""))
        );
      }
      return false;
    });

    //   console.log(missingRequiredQuestions, "missing required");

    if (missingRequiredQuestions.length > 0) {
      toast.warning(
        `Please fill in all required questions: ${missingRequiredQuestions
          .map((q) => q.label)
          .join(", ")}`,
      );
      // ... focus handling logic
    } else {
      nextStep();
    }
  };

  const handleNext = async () => {
    // Check for unchanged answers

    /***
    const allQuestionsUnchanged = questions.every((ques) => {
      const defaultValue = response?.answers?.find(
        (ans) => ans.question.id === ques.id,
      )?.value;
      const currentValue = selectedValues[ques.id];
      return JSON.stringify(currentValue) === JSON.stringify(defaultValue);
    });

    if (allQuestionsUnchanged) {
      nextStep();
      return;
    }
      **/

    // Validation for required questions
    const requiredQuestions = questions.filter((q) => q.required === 1);
    const missingRequiredQuestions = requiredQuestions.filter((q) => {
      const value = selectedValues[q.id];
      if (value === undefined || value === null || value === "") return true;
      if (Array.isArray(value) && value.length === 0) return true;
      if (["file", "photo", "video", "audio"].includes(q.type)) {
        return !(
          value &&
          ((typeof value === "object" &&
            "file" in value &&
            value.file instanceof File) ||
            value instanceof File ||
            (typeof value === "string" && value.trim() !== ""))
        );
      }
      return false;
    });

    if (missingRequiredQuestions.length > 0) {
      toast.warning(
        `Please fill in all required questions: ${missingRequiredQuestions
          .map((q) => q.label)
          .join(", ")}`,
      );
      // ... focus handling logic
      return;
    }
    /***

    questions.forEach((question) =>
      updateAnswer(question.id, selectedValues[question.id]),
    );

    setIsLoading(true);
    setLastStepLoading(true);

    try {
      // Prepare answers submission
      const formattedAnswers = {
        answers: Object.entries(selectedValues)
          .filter(([key, value]) => {
            const question = questions.find((q) => q.id === Number(key));
            const isRequired = question?.required === 1;
            const hasValue =
              value !== undefined && value !== null && value !== "";
            const isFileType = ["file", "photo", "video", "audio"].includes(
              question?.type ?? "",
            );
            return !isFileType && (isRequired || hasValue);
          })
          .map(([key, value]) => ({
            question_id: Number(key),
            value: Array.isArray(value)
              ? value.map((item) => item?.value || item)
              : value,
          })),
      };

      const promises: Promise<any>[] = [];

      // Only submit answers if there are non-file answers
      if (formattedAnswers.answers.length > 0) {
        promises.push(
          createContributorAnswers(responseId as string, formattedAnswers),
        );
      }

      // Prepare file upload
      const formData = new FormData();
      let hasFileToUpload = false;

      // Process file uploads synchronously
      for (const question of questions.filter((q) =>
        ["file", "photo", "video", "audio"].includes(q.type),
      )) {
        const value = selectedValues[question.id];
        let fileToUpload: File | undefined;

        try {
          if (value instanceof File) {
            fileToUpload = value;
          } else if (value?.file instanceof File) {
            fileToUpload = value.file;
          } else if (typeof value === "string" && value.startsWith("blob:")) {
            const response = await fetch(value);
            const blob = await response.blob();
            fileToUpload = new File([blob], "captured-media", {
              type: blob.type,
            });
          }

          if (fileToUpload) {
            const allowedTypes = {
              audio: ["audio/mpeg", "audio/wav", "audio/m4a", "audio/x-m4a"],
              video: [
                "video/mp4",
                "video/mpeg",
                "video/quicktime",
                "video/webm",
              ],
              photo: ["image/jpeg", "image/png", "image/gif"],
              file: [],
            };

            const typeAllowList =
              allowedTypes[question.type as keyof typeof allowedTypes] || [];
            const isValidType =
              typeAllowList.length === 0 ||
              //@ts-ignore
              typeAllowList.includes(fileToUpload.type);

            if (isValidType) {
              const timestamp = Date.now();
              const uniqueFileName = `${timestamp}_${question.id}_${fileToUpload.name}`;
              formData.append(
                `${question.type}s[${question.id}]`,
                fileToUpload,
                uniqueFileName,
              );
              hasFileToUpload = true;
            } else {
              toast.error(
                `Invalid file type for ${question.label}. Allowed types: ${typeAllowList.join(", ")}`,
              );
            }
          }
        } catch (error) {
          console.error("File processing error:", error);
          toast.error(`Failed to process file for ${question.label}`);
        }
      }

      if (hasFileToUpload) {
        promises.push(uploadQuestionFile(responseId as string, formData));
      }

      const anySubmissions = promises.length > 0;


      const [answerResponse, fileResponse] = anySubmissions
        ? await Promise.all(promises)
        : [undefined, undefined];

      // Handle file upload errors
      if (hasFileToUpload && (!fileResponse || !fileResponse.success)) {
        throw new Error(fileResponse?.message || "File upload failed");
      }
        */

    // Final submission handling
    try {
      if (isLastStep) {
        const submitResponse = await submitResponseEndpoint(
          responseId as string,
        );
        if (!submitResponse.data) {
          //@ts-ignore
          throw new Error(
            //@ts-ignore
            submitResponse.message || "Response submission failed",
          );
        }
        openModal();
        toast.success("Response submitted successfully");
      }
    } catch (error) {
      console.error("Submission error:", error);
      //@ts-ignore
      toast.error(
        //@ts-ignore
        error?.response.data.message
          ? //@ts-ignore
            error?.response.data.message
          : "Some required question(s) are missing answers",
      );
    } finally {
      setIsLoading(false);
      setLastStepLoading(false);
    }
  };
  const onInputedAnswerMonitoring = async (myid: any) => {
    // Get the specific question by ID

    // console.log(myid);
    setIsLoading(true);
    const question = questions.find((q) => q.id === myid);
    if (!question) return;

    const defaultValue = response?.answers?.find(
      (ans) => ans.question.id === myid,
    )?.value;
    const currentValue = selectedValues[myid];

    /***
    if (JSON.stringify(currentValue) === JSON.stringify(defaultValue)) {
      nextStep();
      return;
    }
      */

    // Validate required question

    // console.log(selectedValues, "currentValuecurrentValue");
    const isMissing =
      currentValue === undefined ||
      currentValue === null ||
      currentValue === "" ||
      (Array.isArray(currentValue) && currentValue.length === 0) ||
      (["file", "photo", "video", "audio"].includes(question.type) &&
        !(
          currentValue &&
          ((typeof currentValue === "object" &&
            "file" in currentValue &&
            currentValue.file instanceof File) ||
            currentValue instanceof File ||
            (typeof currentValue === "string" && currentValue.trim() !== ""))
        ));
    /**
    if (isMissing) {
      toast.warning(`Please fill in the required question: ${question.label}`);
      return;
    }
      */

    updateAnswer(myid, currentValue);

    // setIsLoading(true);
    // setLastStepLoading(true);

    try {
      // Prepare answer submission
      const formattedAnswer = {
        answers: [
          {
            question_id: myid,
            value: Array.isArray(currentValue)
              ? currentValue.map((item) => item?.value || item)
              : currentValue,
          },
        ],
      };

      const promises: Promise<any>[] = [];

      // Handle file uploads
      let hasFileToUpload = false;
      if (["file", "photo", "video", "audio"].includes(question.type)) {
        const value = selectedValues[myid];
        let fileToUpload: File | undefined;

        try {
          if (value instanceof File) {
            fileToUpload = value;
          } else if (value?.file instanceof File) {
            fileToUpload = value.file;
          } else if (typeof value === "string" && value.startsWith("blob:")) {
            const response = await fetch(value);
            const blob = await response.blob();
            fileToUpload = new File([blob], "captured-media", {
              type: blob.type,
            });
          }

          if (fileToUpload) {
            const allowedTypes: Record<string, string[]> = {
              audio: ["audio/mpeg", "audio/wav", "audio/m4a", "audio/x-m4a"],
              video: [
                "video/mp4",
                "video/mpeg",
                "video/quicktime",
                "video/webm",
              ],
              photo: ["image/jpeg", "image/png", "image/gif"],
              file: [
                "application/pdf",
                "application/msword", // .doc
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                "application/vnd.ms-excel", // .xls
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                "application/vnd.ms-powerpoint", // .ppt
                "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
                "text/plain", // .txt
                "application/zip",
                "application/x-rar-compressed",
                "application/x-7z-compressed",
              ],
            };

            const isValidType =
              allowedTypes[question.type]?.includes(fileToUpload.type) ?? true;

            if (isValidType) {
              const formData = new FormData();
              const uniqueFileName = `${Date.now()}_${myid}_${fileToUpload.name}`;
              formData.append(
                `${question.type}s[${myid}]`,
                fileToUpload,
                uniqueFileName,
              );
              hasFileToUpload = true;
              promises.push(uploadQuestionFile(responseId as string, formData));
              //@ts-ignore
              //queryClient.invalidateQueries(["campaign questions"]);
            } else {
              toast.error(`Invalid file type for ${question.label}.`);
            }
          }
        } catch (error) {
          //  console.error("File processing error:", error);
          toast.error(`Failed to process file for ${question.label}`);
        }
      } else {
        if (formattedAnswer.answers.length > 0) {
          promises.push(
            createContributorAnswers(responseId as string, formattedAnswer),
          );
        }
      }

      // Execute only if there's something to submit
      const [answerResponse, fileResponse] =
        promises.length > 0
          ? await Promise.all(promises)
          : [undefined, undefined];
      /***
      if (hasFileToUpload && (!fileResponse || !fileResponse.success)) {
        throw new Error(fileResponse?.message || "File upload failed");
      }

      */

      // Final submission handling

      /***
      if (isLastStep) {
        const submitResponse = await submitResponseEndpoint(
          responseId as string,
        );
        if (!submitResponse.data) {
          throw new Error(
            //@ts-ignore
            submitResponse.message || "Response submission failed",
          );
        }
        openModal();
        toast.success("Response submitted successfully");
      } else {
        //@ts-ignore
          toast.success(
         answerResponse?.message || "Answer submitted successfully",
        );

        // nextStep();
      }
         */
    } catch (error) {
      console.error("Submission error:", error);
      // toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      //@ts-ignore
      // queryClient.invalidateQueries(["campaign questions"]);
      setIsLoading(false);

      // setIsLoading(false);
      //  setLastStepLoading(false);
    }
  };

  const renderQuestionInput = (ques: any) => {
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
                onBlur={() => onInputedAnswerMonitoring(ques.id)}
                id={ques.name}
                placeholder={ques.placeholder || "Enter your answer"}
                onChange={(e) => {
                  handleInputChange(e.target.value, ques.id);
                }}
                className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
              />
            ) : (
              <input
                //@ts-ignore
                ref={(el) => (inputRefs.current[ques.id] = el)}
                type="text"
                onBlur={() => onInputedAnswerMonitoring(ques.id)}
                value={selectedValues[ques.id] || ""}
                id={ques.name}
                placeholder={ques.placeholder || "Enter your answer"}
                onChange={(e) => {
                  handleInputChange(e.target.value, ques.id);
                }}
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
              onValueChange={(val: string | boolean | string[] | File) => {
                // If the selected value is the same as the current value, uncheck it
                const newValue = selectedValues[ques.id] === val ? "" : val;
                setQid(ques.id);
                // Update state and trigger monitoring
                handleInputChange(newValue, ques.id);
                // onInputedAnswerMonitoring(ques.id);
              }}
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
                        {index as number}
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
          /***
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
                  const fileURL = URL.createObjectURL(file);

                  setFilePreviews((prev) => ({
                    ...prev,
                    [ques.id]: fileURL,
                  }));

                  setQid(ques.id);
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
              {filePreviews[ques.id] || selectedValues[ques.id] ? (
                <div className="relative h-32 w-32">
                  <video
                    controls
                    src={filePreviews[ques.id] || selectedValues[ques.id]} // Use prefilled value if no uploaded file
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
              ) : null}
            </div>
          </div>
          */

          /***
          <VideoRecorder
            ques={ques}
            handleInputChange={handleInputChange}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            setQid={setQid}
          />
           */

          <div className="col-span-2">
            <div className="flex flex-col gap-4">
              <div
                onClick={async () => {
                  try {
                    // Explicitly request camera access
                    const stream = await navigator.mediaDevices.getUserMedia({
                      video: {
                        facingMode: "environment", // Prefer back/environment camera
                        width: { ideal: 1920 }, // Ideal width
                        height: { ideal: 1080 }, // Ideal height
                      },
                      audio: true, // Include audio if needed
                    });

                    // Create a modal or overlay to show camera preview
                    const cameraOverlay = document.createElement("div");
                    cameraOverlay.style.position = "fixed";
                    cameraOverlay.style.top = "0";
                    cameraOverlay.style.left = "0";
                    cameraOverlay.style.width = "100%";
                    cameraOverlay.style.height = "100%";
                    cameraOverlay.style.backgroundColor = "black";
                    cameraOverlay.style.zIndex = "1000";
                    cameraOverlay.style.display = "flex";
                    cameraOverlay.style.flexDirection = "column";
                    cameraOverlay.style.alignItems = "center";
                    cameraOverlay.style.justifyContent = "center";

                    // Create video element for camera preview
                    const video = document.createElement("video");
                    video.style.maxWidth = "100%";
                    video.style.maxHeight = "80%";
                    video.style.objectFit = "contain";
                    video.srcObject = stream;
                    video.autoplay = true;

                    // Create start recording button
                    const startButton = document.createElement("button");
                    startButton.textContent = "Start Recording";
                    startButton.style.marginTop = "20px";
                    startButton.style.padding = "10px 20px";
                    startButton.style.backgroundColor = "white";
                    startButton.style.color = "black";
                    startButton.style.border = "none";
                    startButton.style.borderRadius = "5px";

                    // Create stop recording button
                    const stopButton = document.createElement("button");
                    stopButton.textContent = "Stop Recording";
                    stopButton.style.marginTop = "10px";
                    stopButton.style.padding = "10px 20px";
                    stopButton.style.backgroundColor = "red";
                    stopButton.style.color = "white";
                    stopButton.style.border = "none";
                    stopButton.style.borderRadius = "5px";
                    stopButton.disabled = true; // Disabled until recording starts

                    // Create cancel button
                    const cancelButton = document.createElement("button");
                    cancelButton.textContent = "Cancel";
                    cancelButton.style.marginTop = "10px";
                    cancelButton.style.padding = "10px 20px";
                    cancelButton.style.backgroundColor = "gray";
                    cancelButton.style.color = "white";
                    cancelButton.style.border = "none";
                    cancelButton.style.borderRadius = "5px";

                    // Create recording indicator
                    const recordingIndicator = document.createElement("div");
                    recordingIndicator.textContent = "Recording...";
                    recordingIndicator.style.color = "red";
                    recordingIndicator.style.fontWeight = "bold";
                    recordingIndicator.style.marginTop = "10px";
                    recordingIndicator.style.display = "none"; // Hidden by default

                    // Append elements to overlay
                    cameraOverlay.appendChild(video);
                    cameraOverlay.appendChild(startButton);
                    cameraOverlay.appendChild(stopButton);
                    cameraOverlay.appendChild(cancelButton);
                    cameraOverlay.appendChild(recordingIndicator);
                    document.body.appendChild(cameraOverlay);

                    // Wait for video to be ready
                    await new Promise<void>((resolve) => {
                      video.onloadedmetadata = () => {
                        video.play();
                        resolve();
                      };
                    });

                    // Initialize MediaRecorder and recorded chunks
                    let mediaRecorder: MediaRecorder | null = null;
                    let recordedChunks: Blob[] = [];

                    // Start recording
                    startButton.onclick = () => {
                      recordedChunks = [];
                      mediaRecorder = new MediaRecorder(stream, {
                        mimeType: "video/webm",
                      });

                      // Handle data availability
                      mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                          recordedChunks.push(event.data);
                        }
                      };

                      // Handle recording stop
                      mediaRecorder.onstop = () => {
                        const recordedBlob = new Blob(recordedChunks, {
                          type: "video/webm",
                        });

                        // Stop camera tracks
                        stream.getTracks().forEach((track) => track.stop());

                        // Remove overlay
                        document.body.removeChild(cameraOverlay);

                        // Convert to file
                        const file = new File(
                          [recordedBlob],
                          "captured-video.webm",
                          {
                            type: "video/webm",
                          },
                        );

                        // Check file size (10MB limit)
                        if (file.size <= 10 * 1024 * 1024) {
                          // Create URL for preview
                          const previewUrl = URL.createObjectURL(file);

                          // Update state
                          setSelectedValues((prev) => ({
                            ...prev,
                            [ques.id]: file,
                          }));
                          setFilePreviews((prev) => ({
                            ...prev,
                            [ques.id]: previewUrl,
                          }));

                          setQid(ques.id);
                        } else {
                          alert("Video size exceeds 10MB limit");
                        }
                      };

                      mediaRecorder.start();
                      startButton.disabled = true;
                      stopButton.disabled = false;
                      recordingIndicator.style.display = "block"; // Show recording indicator
                    };

                    // Stop recording
                    stopButton.onclick = () => {
                      if (mediaRecorder) {
                        mediaRecorder.stop();
                        startButton.disabled = false;
                        stopButton.disabled = true;
                        recordingIndicator.style.display = "none"; // Hide recording indicator
                      }
                    };

                    // Cancel button functionality
                    cancelButton.onclick = () => {
                      // Stop camera tracks
                      stream.getTracks().forEach((track) => track.stop());

                      // Remove overlay
                      document.body.removeChild(cameraOverlay);
                    };
                  } catch (error) {
                    console.error("Error accessing camera:", error);
                    alert("Could not access camera. Please check permissions.");
                  }
                }}
                className="relative flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="flex w-fit flex-col rounded-lg px-4 py-2 text-sm font-medium text-[#3365E3]">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center self-center rounded-full border border-dashed border-slate-300 bg-slate-200">
                      <Camera />
                    </div>
                    <span>Record Video</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Use device camera (max 10MB)
                  </span>
                  {(filePreviews[ques.id] || selectedValues[ques.id]) && (
                    <span className="mt-2 rounded-lg border bg-amber-100 p-1 text-xs text-orange-400">
                      Video already added
                    </span>
                  )}
                </div>
              </div>

              {/* Prefill the default value */}
              {(filePreviews[ques.id] || selectedValues[ques.id]) && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                  <video
                    src={
                      filePreviews[ques.id] || // If a new file is selected
                      (typeof selectedValues[ques.id] === "string" &&
                        selectedValues[ques.id]) // If the default S3 URL is provided
                    }
                    controls
                    className="h-full w-full object-cover"
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

      case "checkbox":
        return (
          <div className="col-span-2 grid grid-cols-2 gap-5">
            {ques.options?.map(
              (opt: { label: string; value: string }, index: number) => (
                <div
                  key={`${ques.id}-${index}`}
                  className="group flex items-center gap-3"
                >
                  <Checkbox
                    ref={(el) => {
                      if (el) {
                        if (!inputRefs.current) inputRefs.current = {};
                        inputRefs.current[ques.id] = el;
                      }
                    }}
                    id={`q${ques.id}-${index}`}
                    // Defensive check for selectedValues
                    checked={
                      Array.isArray(selectedValues[ques.id])
                        ? selectedValues[ques.id].some(
                            (item: any) =>
                              (typeof item === "string"
                                ? item
                                : item?.value) === opt.value,
                          )
                        : false
                    }
                    onCheckedChange={(checked: boolean) => {
                      // Ensure currentSelections is always an array
                      const currentSelections = Array.isArray(
                        selectedValues[ques.id],
                      )
                        ? selectedValues[ques.id]
                        : [];

                      let newSelections;
                      if (checked) {
                        // Add the option if it's not already present
                        if (
                          !currentSelections.some(
                            (item: any) =>
                              (typeof item === "string"
                                ? item
                                : item?.value) === opt.value,
                          )
                        ) {
                          newSelections = [...currentSelections, opt];
                        } else {
                          newSelections = currentSelections;
                        }
                      } else {
                        // Remove the option
                        newSelections = currentSelections.filter(
                          (item: any) =>
                            (typeof item === "string" ? item : item?.value) !==
                            opt.value,
                        );
                      }

                      // Log for debugging
                      //console.log("New Selections:", newSelections);

                      handleInputChange(newSelections, ques.id);
                      setQid(ques.id);
                    }}
                    className="form-checkbox h-5 w-5 text-main-100"
                  />
                  <Label
                    htmlFor={`q${ques.id}-${index}`}
                    className="text-sm text-[#101828]"
                  >
                    {opt.label}
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
              onBlur={() => onInputedAnswerMonitoring(ques.id)}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );
      case "location":
        return (
          <div className="col-span-2">
            <LocationSelector
              apiKey={KEY as string}
              questionId={ques.id}
              onLocationSelect={(locations) => {
                //@ts-ignore
                handleInputChange(locations, ques.id, "location");
                //setQid(ques.id);
              }}
              defaultLocations={selectedValues[ques.id] || []}
            />

            {/***
            <LocationDropdown
              questionId={ques.id}
              onLocationSelect={(location) => {
                //@ts-ignore
                handleInputChange(location, ques.id, "location");
                //  onInputedAnswerMonitoring(ques.id);
              }}
              defaultLatitude={selectedValues[ques.id]?.latitude}
              defaultLongitude={selectedValues[ques.id]?.longitude}
            />
            */}
          </div>
        );
      case "line":
        return (
          <div className="col-span-2">
            <CustomAreaInput
              apiKey={KEY as string}
              questionId={ques.id}
              onLocationSelect={(locations) => {
                //@ts-ignore
                handleInputChange(locations, ques.id, "line");
                //setQid(ques.id);
              }}
              defaultLocations={selectedValues[ques.id]}
              maxLocations={2}
            />
            {/***
            <LocationSelector
              apiKey={KEY as string}
              questionId={ques.id}
              onLocationSelect={(locations) => {
                //@ts-ignore
                handleInputChange(locations, ques.id, "location");
                setQid(ques.id);
              }}
              defaultLocations={selectedValues[ques.id] || []}
            />
            */}
          </div>
        );
      case "area":
        return (
          <div className="col-span-2">
            <CustomAreaInput
              apiKey={KEY as string}
              questionId={ques.id}
              onLocationSelect={(locations) => {
                //@ts-ignore
                handleInputChange(locations, ques.id, "area");
                // setQid(ques.id);
              }}
              defaultLocations={selectedValues[ques.id]}
              maxLocations={4}
            />
          </div>
        );
      case "email":
        return (
          <div className="col-span-2">
            <input
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              type="email" // Ensures the browser treats this as an email input
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              placeholder="Enter email address"
              onBlur={() => onInputedAnswerMonitoring(ques.id)}
              onChange={(e) => {
                const email = e.target.value;
                handleInputChange(email, ques.id);
              }}
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
              onBlur={() => onInputedAnswerMonitoring(ques.id)}
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
              onBlur={() => onInputedAnswerMonitoring(ques.id)}
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
              ref={(el) => (inputRefs.current[ques.id] = el)} // Reference the select element
              id={ques.name}
              value={selectedValues[ques.id] || ques.defaultValue || ""}
              onChange={(e) => {
                handleInputChange(e.target.value, ques.id);
                setQid(ques.id);
              }}
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
            <div className="flex flex-col gap-4">
              <div
                onClick={async () => {
                  try {
                    // Explicitly request camera access
                    const stream = await navigator.mediaDevices.getUserMedia({
                      video: {
                        facingMode: "environment", // Prefer back/environment camera
                        width: { ideal: 1920 }, // Ideal width
                        height: { ideal: 1080 }, // Ideal height
                      },
                    });

                    // Create a modal or overlay to show camera preview
                    const cameraOverlay = document.createElement("div");
                    cameraOverlay.style.position = "fixed";
                    cameraOverlay.style.top = "0";
                    cameraOverlay.style.left = "0";
                    cameraOverlay.style.width = "100%";
                    cameraOverlay.style.height = "100%";
                    cameraOverlay.style.backgroundColor = "black";
                    cameraOverlay.style.zIndex = "1000";
                    cameraOverlay.style.display = "flex";
                    cameraOverlay.style.flexDirection = "column";
                    cameraOverlay.style.alignItems = "center";
                    cameraOverlay.style.justifyContent = "center";

                    // Create video element for camera preview
                    const video = document.createElement("video");
                    video.style.maxWidth = "100%";
                    video.style.maxHeight = "80%";
                    video.style.objectFit = "contain";
                    video.srcObject = stream;
                    video.autoplay = true;

                    // Create capture button
                    const captureButton = document.createElement("button");
                    captureButton.textContent = "Capture Photo";
                    captureButton.style.marginTop = "20px";
                    captureButton.style.padding = "10px 20px";
                    captureButton.style.backgroundColor = "white";
                    captureButton.style.color = "black";
                    captureButton.style.border = "none";
                    captureButton.style.borderRadius = "5px";

                    // Create cancel button
                    const cancelButton = document.createElement("button");
                    cancelButton.textContent = "Cancel";
                    cancelButton.style.marginTop = "10px";
                    cancelButton.style.padding = "10px 20px";
                    cancelButton.style.backgroundColor = "red";
                    cancelButton.style.color = "white";
                    cancelButton.style.border = "none";
                    cancelButton.style.borderRadius = "5px";

                    // Append elements to overlay
                    cameraOverlay.appendChild(video);
                    cameraOverlay.appendChild(captureButton);
                    cameraOverlay.appendChild(cancelButton);
                    document.body.appendChild(cameraOverlay);

                    // Wait for video to be ready
                    await new Promise<void>((resolve) => {
                      video.onloadedmetadata = () => {
                        video.play();
                        resolve();
                      };
                    });

                    // Capture photo when button is clicked
                    captureButton.onclick = () => {
                      // Create canvas to capture image
                      const canvas = document.createElement("canvas");
                      canvas.width = video.videoWidth;
                      canvas.height = video.videoHeight;
                      const ctx = canvas.getContext("2d");
                      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

                      // Stop camera tracks
                      stream.getTracks().forEach((track) => track.stop());

                      // Remove overlay
                      document.body.removeChild(cameraOverlay);

                      // Convert to file
                      canvas.toBlob(
                        (blob) => {
                          if (blob) {
                            const file = new File(
                              [blob],
                              "captured-image.jpg",
                              {
                                type: "image/jpeg",
                              },
                            );

                            // Check file size (1MB limit)
                            if (file.size <= 1 * 1024 * 1024) {
                              // Create URL for preview
                              const previewUrl = URL.createObjectURL(file);

                              // Update state
                              setSelectedValues((prev) => ({
                                ...prev,
                                [ques.id]: file,
                              }));
                              setFilePreviews((prev) => ({
                                ...prev,
                                [ques.id]: previewUrl,
                              }));

                              setQid(ques.id);
                            } else {
                              alert("Image size exceeds 1MB limit");
                            }
                          }
                        },
                        "image/jpeg",
                        0.7,
                      );
                    };

                    // Cancel button functionality
                    cancelButton.onclick = () => {
                      // Stop camera tracks
                      stream.getTracks().forEach((track) => track.stop());

                      // Remove overlay
                      document.body.removeChild(cameraOverlay);
                    };
                  } catch (error) {
                    console.error("Error accessing camera:", error);
                    alert("Could not access camera. Please check permissions.");
                  }
                }}
                className="relative flex h-40 cursor-pointer items-center justify-center rounded-lg border-2 border-[#3365E31F] bg-[#3365E31F] text-center"
              >
                <div className="flex flex-col items-center">
                  <div className="flex w-fit flex-col rounded-lg px-4 py-2 text-sm font-medium text-[#3365E3]">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center self-center rounded-full border border-dashed border-slate-300 bg-slate-200">
                      <Camera />
                    </div>
                    <span>Take Photo</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Use device camera (max 1MB)
                  </span>
                  {(filePreviews[ques.id] || selectedValues[ques.id]) && (
                    <span className="mt-2 rounded-lg border bg-amber-100 p-1 text-xs text-orange-400">
                      Image already added
                    </span>
                  )}
                </div>
              </div>

              {/* Prefill the default value */}
              {(filePreviews[ques.id] || selectedValues[ques.id]) && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                  <Image
                    src={
                      filePreviews[ques.id] || // If a new file is selected
                      (typeof selectedValues[ques.id] === "string" &&
                        selectedValues[ques.id]) // If the default S3 URL is provided
                    }
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
              onBlur={() => onInputedAnswerMonitoring(ques.id)}
              onChange={(e) => {
                handleInputChange(e.target.value, ques.id);
              }}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );
      case "url":
        return (
          <div className="col-span-2">
            <div className="relative">
              <input
                //@ts-ignore
                ref={(el) => (inputRefs.current[ques.id] = el)}
                type="text"
                value={selectedValues[ques.id] || ""}
                id={ques.name}
                onBlur={() => onInputedAnswerMonitoring(ques.id)}
                placeholder={ques.placeholder || "Enter URL or text"}
                onChange={(e) => {
                  const input = e.target.value;
                  handleInputChange(input, ques.id);
                }}
                className="form-input w-full rounded-lg border-[#D9DCE0] pr-10"
              />
              {selectedValues[ques.id] && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  {selectedValues[ques.id].startsWith("http://") ||
                  selectedValues[ques.id].startsWith("https://") ||
                  selectedValues[ques.id].startsWith("www.") ? (
                    <span className="text-green-500">✓ Valid URL</span>
                  ) : (
                    <span className="text-orange-500">ℹ️ Invalid Input</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="col-span-2">
            <AudioRecorder
              // audioType="mp3"
              quesId={ques.id}
              handleInputChange={handleInputChange}
              defaultAudio={selectedValues[ques.id]} // Pass the default audio
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
              onBlur={() => onInputedAnswerMonitoring(ques.id)}
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
              onBlur={() => onInputedAnswerMonitoring(ques.id)}
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              onChange={(e) => {
                handleInputChange(e.target.value, ques.id);

                // onInputedAnswerMonitoring(ques.id);
              }}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );
      case "file":
        return (
          <div className="col-span-2">
            <FileUpload
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              value={selectedValues[ques.id] || ""}
              onFileUpload={(file, base64) => {
                //@ts-ignore
                handleInputChange({ file, base64 }, ques.id, "file");
                setQid(ques.id);
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // console.log(questions, "questionsquestions");

  // const renderQuestion = (ques: Question, index: number) => {
  //   return (
  //     <div key={ques.id} className="grid gap-2">
  //       <Label
  //         htmlFor={ques.name}
  //         className="text-base leading-7 tracking-wider text-[#333333]"
  //       >
  //         {/* Add question numbering */}
  //         <span className="mr-2 font-bold text-main-100">{index + 1}.</span>
  //         {ques.label}
  //         {ques.required === 1 && <span className="ml-1 text-red-500">*</span>}
  //       </Label>
  //       {renderQuestionInput(ques)}
  //     </div>
  //   );
  // };

  const renderQuestion = (ques: Question, stepQuestionIndex: number) => {
    // Calculate the overall question number by combining the starting number and current step's question index
    const overallQuestionNumber = startingQuestionNumber + stepQuestionIndex;

    return (
      <div key={ques.id} className="grid gap-2">
        <Label
          htmlFor={ques.name}
          className="text-base leading-7 tracking-wider text-[#333333]"
        >
          {/* Use the overall question number */}
          <span className="mr-2 font-bold text-main-100">
            {overallQuestionNumber}.
          </span>
          {ques.label}
          {ques.required === 1 && <span className="ml-1 text-red-500">*</span>}
        </Label>
        {renderQuestionInput(ques)}
      </div>
    );
  };

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
      <div className="space-y-10">
        {questions?.map((ques: Question, index: number) =>
          renderQuestion(ques, index),
        )}
      </div>
      <StepperControl
        isLastStep={isLastStep}
        next={isLastStep ? handleNext : nextStepNext}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DynamicQuestion;
