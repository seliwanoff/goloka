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
import AudioRecorder from "./customAudioRecorder";
import FileUpload from "./fileUpload";
import CustomAreaInput from "./inputs/customAreaInput";
import SuccessModal from "./customSuccess";
import { useSuccessModalStore } from "@/stores/misc";
import { uploadQuestionFile } from "@/lib/api";
import { submitResponseEndpoint } from "@/services/response";

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

  const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log(response?.answers, "responseresponse");
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
    if (type === "location" || type === "line" || type === "area") {
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

  useEffect(() => {
    console.log("Current selectedValues:", selectedValues);
    console.log("Current answers from stepper:", answers);
  }, [selectedValues, answers]);

  console.log(selectedValues, "selectedValues");
  console.log(answers, "answers");

  const handleNext = async () => {
    const allQuestionsHaveDefaultValues = questions.every((ques) => {
      const defaultValue = response?.answers?.find(
        (ans) => ans.question.id === ques.id,
      )?.value;

      const currentValue = selectedValues[ques.id];

      // If no default value exists, this check will be skipped
      if (!defaultValue) return false;

      // Compare current value with default value
      return currentValue === defaultValue;
    });
    // If all questions have default values and haven't been edited, just move to next step
    if (allQuestionsHaveDefaultValues) {
      // Optional: Update answers context with default values
      questions.forEach((question) => {
        const defaultValue = response?.answers?.find(
          (ans) => ans.question.id === question.id,
        )?.value;

        if (defaultValue) {
          updateAnswer(question.id, defaultValue);
        }
      });

      nextStep();
      return;
    }

    // Validate required questions before proceeding
    const requiredQuestions = questions.filter((q) => q.required === 1);
    const missingRequiredQuestions = requiredQuestions.filter((q) => {
      const value = selectedValues[q.id];

      // Check different types of inputs for emptiness
      if (value === undefined || value === null || value === "") return true;

      // Special handling for array-based inputs (checkbox, multi-select)
      if (Array.isArray(value) && value.length === 0) return true;

      // Special handling for file uploads
      if (
        q.type === "file" ||
        q.type === "photo" ||
        q.type === "video" ||
        q.type === "audio"
      ) {
        return !value || (value.file === undefined && value === null);
      }

      return false;
    });

    // If there are missing required questions, show error and prevent proceeding
    if (missingRequiredQuestions.length > 0) {
      toast.warning(
        `Please fill in all required questions: ${missingRequiredQuestions.map((q) => q.label).join(", ")}`,
      );

      // Optionally, focus on the first missing required question
      if (missingRequiredQuestions[0]) {
        const firstMissingQuestionRef =
          inputRefs.current[missingRequiredQuestions[0].id];
        if (firstMissingQuestionRef && firstMissingQuestionRef.focus) {
          firstMissingQuestionRef.focus();
        }
      }

      return; // Stop proceeding if required questions are not filled
    }

    setIsLoading(true);

    // Filter and format only the answers for required questions or questions with values
    const formattedAnswers = {
      answers: Object.entries(selectedValues)
        .filter(([key, value]) => {
          const question = questions.find((q) => q.id === Number(key));

          // Only include answers for:
          // 1. Required questions
          // 2. Non-required questions that have a value
          const isRequired = question?.required === 1;
          const hasValue =
            value !== undefined && value !== null && value !== "";

          // Exclude file/media type questions from this formatting
          const isFileType = ["file", "photo", "video", "audio"].includes(
            question?.type ?? "",
          );

          return !isFileType && (isRequired || hasValue);
        })
        .map(([key, value]) => ({
          question_id: Number(key),
          value: Array.isArray(value)
            ? value.map((item) => item?.value || item) // Handle objects/values
            : value,
        })),
    };

    setLastStepLoading(true);

    let answerResponse = null;
    let fileResponse = null;

    try {
      // Existing API call for answers
      const answerPromise = createContributorAnswers(
        responseId as string,
        formattedAnswers,
      );

      // Prepare FormData for file uploads (only for required or filled file questions)
      const formData = new FormData();
      const fileQuestions = questions.filter((q) =>
        ["file", "photo", "video", "audio"].includes(q.type),
      );

      fileQuestions.forEach((question) => {
        const value = selectedValues[question.id];
        let fileToUpload: File | undefined;

        // Only upload file if the question is required or has a value
        const isRequired = question.required === 1;
        const hasValue = value !== undefined && value !== null;

        // Determine the file to upload
        if (isRequired || hasValue) {
          // if (value instanceof File) {
          //   fileToUpload = value;
          // } else if (value && "file" in value && value.file instanceof File) {
          //   fileToUpload = value.file;
          // }
          if (
            value &&
            typeof value === "object" && // Ensure value is an object
            "file" in value &&
            value.file instanceof File
          ) {
            fileToUpload = value.file;
          }
        }

        // If we have a file to upload, add it to FormData
        if (fileToUpload) {
          const timestamp = Date.now();
          const uniqueFileName = `${timestamp}_${question.id}_${fileToUpload.name}`;
          const formKey = `${question.type}s[${question.id}]`;
          formData.append(formKey, fileToUpload, uniqueFileName);
        }
      });

      // Existing promise and response handling
      const filePromise =
        fileQuestions.length > 0 && Array.from(formData.keys()).length > 0
          ? uploadQuestionFile(responseId as string, formData)
          : null;

      [answerResponse, fileResponse] = await Promise.all([
        answerPromise,
        filePromise,
      ]);

      // Verify file upload success if files were uploaded
      if (filePromise && (!fileResponse || !fileResponse.success)) {
        throw new Error(fileResponse?.message || "File upload failed");
      }

      // For the last step, submit the entire response
      if (isLastStep) {
        const submitResponse = await submitResponseEndpoint(
          responseId as string,
        );
        console.log(submitResponse, "submitResponse");
        // Check if submit response was successful
        //@ts-ignore
        if (!submitResponse.data) {
          throw new Error(
            //@ts-ignore
            submitResponse.message || "Response submission failed",
          );
        }

        // Open success modal or navigate to success page
        openModal();
        toast.success("Response submitted successfully");
      } else {
        // For intermediate steps, just show success for current step
        toast.success(
          //@ts-ignore
          answerResponse?.message || "Answers submitted successfully",
        );
      }

      // Update answers context
      questions.forEach((question) =>
        updateAnswer(question.id, selectedValues[question.id]),
      );

      if (!isLastStep) nextStep(); // Proceed to next step
    } catch (error) {
      console.log(error, "errror");
      // Error handling
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      // Ensure loading states are reset
      setIsLoading(false);
      setLastStepLoading(false);
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
              onValueChange={(val: string | boolean | string[] | File) => {
                // If the selected value is the same as the current value, set it to undefined (uncheck)
                const newValue = selectedValues[ques.id] === val ? "" : val;
                handleInputChange(newValue, ques.id);
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
              {/* Display the video preview or prefilled video */}
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
                      console.log("New Selections:", newSelections);

                      handleInputChange(newSelections, ques.id);
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
              // Pass default latitude and longitude if available in selectedValues
              defaultLatitude={selectedValues[ques.id]?.latitude}
              defaultLongitude={selectedValues[ques.id]?.longitude}
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
              defaultLocations={
                selectedValues[ques.id]
                  ? selectedValues[ques.id].map((loc: any, index: number) => ({
                      id: index + 1,
                      latitude: loc.latitude,
                      longitude: loc.longitude,
                      address: ".address",
                    }))
                  : undefined
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
              type="email" // Ensures the browser treats this as an email input
              value={selectedValues[ques.id] || ""}
              id={ques.name}
              placeholder="Enter email address"
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
              ref={(el) => (inputRefs.current[ques.id] = el)} // Reference the select element
              id={ques.name}
              value={selectedValues[ques.id] || ques.defaultValue || ""}
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
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
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
      // case "audio":
      //   return (
      //     <div className="col-span-2">
      //       <AudioRecorder
      //         quesId={ques.id}
      //         handleInputChange={handleInputChange}
      //         defaultAudio={selectedValues[ques.id]} // Pass the default audio
      //       />
      //     </div>
      //   );
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
            <FileUpload
              //@ts-ignore
              ref={(el) => (inputRefs.current[ques.id] = el)}
              value={selectedValues[ques.id] || ""}
              onFileUpload={(file, base64) =>
                //@ts-ignore
                handleInputChange({ file, base64 }, ques.id, "file")
              }
            />
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
      <div className="space-y-10">
        {questions?.map((ques: any) => (
          <div key={ques.id} className="grid gap-2">
            <Label
              htmlFor={ques.name}
              className="text-base leading-7 tracking-wider text-[#333333]"
            >
              {ques.label}
              {ques.required === 1 && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </Label>
            {renderQuestion(ques)}
          </div>
        ))}
      </div>
      <StepperControl
        isLastStep={isLastStep}
        next={handleNext}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DynamicQuestion;
