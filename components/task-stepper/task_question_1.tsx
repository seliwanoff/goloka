// import React, { useEffect, useState } from "react";
// import { useStepper } from "@/context/TaskStepperContext.tsx";
// import Numbering from "./Numbering";
// import { Label } from "../ui/label";
// import { Checkbox } from "../ui/checkbox";
// import { cn } from "@/lib/utils";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import StepperControl from "./StepperControl";
// import { toast } from "sonner";
// import { questions1 } from "@/utils";

// const options = (index: number) => {
//   switch (index) {
//     case 0:
//       return "A";
//     case 1:
//       return "B";
//     case 2:
//       return "C";
//     case 3:
//       return "D";
//   }
// };

// const QuestionOne: React.FC = () => {
//   const { answers, nextStep, updateAnswer } = useStepper();
//   const [answer, setAnswer] = useState("");
//   const [selectedValue, setSelectedValue] = useState("");

//   const handleNext = () => {
//     if (answer?.length > 1 && selectedValue?.length > 1) {
//       nextStep();
//       console.log(answers, "questions");
//     } else {
//       toast.error("Please provide all answers");
//     }
//   };

//   const handleChange = (value: string, quesId: string) => {
//     setSelectedValue(value);
//     updateAnswer(quesId, value);
//   };

//   const handleAnsInput = (value: string, quesId: string) => {
//     setAnswer(value);
//     updateAnswer(quesId, value);
//   };

//   useEffect(() => {
//     setAnswer(answers.Q1);
//     setSelectedValue(answers.Q2);
//   }, []);

//   return (
//     <div className="space-y-5">
//       {questions1.map((ques: any, index: number) => {
//         return (
//           <>
//             <div className="grid grid-cols-[24px_1fr] gap-3">
//               <Numbering questionNumber={index + 1} />{" "}
//               <Label
//                 htmlFor={ques?.value}
//                 className="text-base leading-7 tracking-[3%] text-[#333333]"
//               >
//                 {ques?.question}
//               </Label>
//               {ques?.type === "text" ? (
//                 // QUESTION ANSWER INPUT
//                 <div className="col-span-2">
//                   <textarea
//                     value={answer}
//                     id={ques?.value}
//                     name={ques?.value}
//                     placeholder="Input your answer here"
//                     onChange={(e) => handleAnsInput(e.target.value, ques?.id)}
//                     className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
//                   />
//                 </div>
//               ) : (
//                 // QUESTION OPTIONS
//                 <div className="col-span-2">
//                   <RadioGroup
//                     value={selectedValue}
//                     onValueChange={(val) => handleChange(val, ques?.id)}
//                     className="grid grid-cols-2 gap-5"
//                   >
//                     {ques?.options?.map((opt: any, indexOpt: number) => (
//                       <div className="group w-full" key={indexOpt}>
//                         <RadioGroupItem
//                           value={opt?.value}
//                           id={`q${indexOpt}`}
//                           className="hidden"
//                         />
//                         <Label
//                           htmlFor={`q${indexOpt}`}
//                           className={cn(
//                             "flex items-center gap-3 rounded-lg border border-[#D9DCE0] p-2.5 pr-3",
//                             selectedValue === opt?.value && "border-main-100",
//                           )}
//                         >
//                           <span
//                             className={cn(
//                               "flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F8] text-[#828282]",
//                               selectedValue === opt?.value &&
//                                 "bg-main-100 text-white",
//                             )}
//                           >
//                             {options(indexOpt)}
//                           </span>
//                           <p
//                             className={cn(
//                               "text-sm text-[#101828]",
//                               selectedValue === opt?.value && "text-main-100",
//                             )}
//                           >
//                             {opt?.label}
//                           </p>
//                         </Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//               )}
//             </div>
//           </>
//         );
//       })}

//       <div className="">
//         <StepperControl next={handleNext} />
//       </div>
//     </div>
//   );
// };

// export default QuestionOne;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStepper } from "@/context/TaskStepperContext.tsx";
import StepperControl from "./StepperControl";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";


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

const DynamicQuestion = ({ questions }: any) => {
  const { answers, nextStep, updateAnswer } = useStepper();
  const [selectedValues, setSelectedValues] = useState({});

  // Initialize selected values from answers
  useEffect(() => {
    const initialAnswers = {};
    questions.forEach((ques: { id: string | number; }) => {
      initialAnswers[ques.id] = answers[ques.id] || "";
    });
    setSelectedValues(initialAnswers);
  }, [questions, answers]);

  // Handle answer changes
  const handleInputChange = (value: string | boolean | File, quesId: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [quesId]: value,
    }));
    updateAnswer(quesId, value);
  };

  const handleNext = () => {
    const allAnswered = questions.every(
      (ques: { id: string | number; }) => selectedValues[ques.id]?.length > 0,
    );

    if (allAnswered) {
      nextStep();
    } else {
      toast.error("Please provide all answers");
    }
  };

    const handleChange = (value: string, quesId: string) => {
      setSelectedValues(value);
      updateAnswer(quesId, value);
    };

  return (
    <div className="space-y-5">
      {/* {questions.map((ques) => (
        <div key={ques.id} className="grid grid-cols-[24px_1fr] gap-3">
          <Label
            htmlFor={ques.name}
            className="text-base leading-7 tracking-[3%] text-[#333333] truncate w-60"
          >
            {ques.label}
          </Label>

          {ques.type === "text" && (
            <textarea
              value={selectedValues[ques.id]}
              id={ques.name}
              placeholder={ques.placeholder || "Input your answer here"}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
            />
          )}

          {ques.type === "radio" && (
            <RadioGroup
              value={selectedValues[ques.id]}
              onValueChange={(val) => handleInputChange(val, ques.id)}
              className="grid grid-cols-2 gap-5"
            >
              {ques.options?.map((opt, index) => (
                <div className="group w-full" key={index}>
                  <RadioGroupItem value={opt.value} id={`q${opt.id}`} />
                  <Label
                    htmlFor={`q${opt.id}`}
                    className="flex items-center gap-3"
                  >
                    <span>{opt.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {ques.type === "date" && (
            <input
              type="date"
              value={selectedValues[ques.id]}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full"
            />
          )}

          {ques.type === "image" && (
            <input
              type="file"
              accept={ques.attributes?.accept}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.files[0], ques.id)}
              className="form-input w-full"
            />
          )}
        </div>
      ))} */}

      {questions.map((ques: { id: React.Key | null | undefined; name: string | undefined; label: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; type: string; placeholder: any; options: any[]; attributes: { accept: any; min: string | number | undefined; max: string | number | undefined; step: string | number | undefined; }; }) => (
        <div key={ques.id} className="grid grid-cols-[24px_1fr] gap-3">
          <Label
            htmlFor={ques.name}
            className="w-60 truncate text-base leading-7 tracking-[3%] text-[#333333]"
          >
            {ques.label}
          </Label>

          {/* Textarea Input */}
          {ques.type === "text" && (
            <div className="col-span-2">
              <textarea
                value={selectedValues[ques.id]}
                id={ques.name}
                placeholder={ques.placeholder || "Input your answer here"}
                onChange={(e) => handleInputChange(e.target.value, ques.id)}
                className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
              />
            </div>
          )}

          {/* Radio Input */}
          {ques.type === "radio" && (
            // <RadioGroup
            //   value={selectedValues[ques.id]}
            //   onValueChange={(val) => handleInputChange(val, ques.id)}
            //   className="grid grid-cols-2 gap-5"
            // >
            //   {ques.options?.map((opt, index) => (
            //     <div className="group w-full" key={index}>
            //       <RadioGroupItem value={opt.value} id={`q${opt.id}`} />
            //       <Label
            //         htmlFor={`q${opt.id}`}
            //         className="flex items-center gap-3"
            //       >
            //         <span>{opt.label}</span>
            //       </Label>
            //     </div>
            //   ))}
            // </RadioGroup>

            <div className="col-span-2">
              <RadioGroup
                value={selectedValues}
                onValueChange={(val) => handleChange(val, ques?.id)}
                className="grid grid-cols-2 gap-5"
              >
                {ques?.options?.map((opt: any, indexOpt: number) => (
                  <div className="group w-full" key={indexOpt}>
                    <RadioGroupItem
                      value={opt?.value}
                      id={`q${indexOpt}`}
                      className="hidden"
                    />
                    <Label
                      htmlFor={`q${indexOpt}`}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border border-[#D9DCE0] p-2.5 pr-3",
                        selectedValues === opt?.value && "border-main-100",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F8] text-[#828282]",
                          selectedValues === opt?.value &&
                            "bg-main-100 text-white",
                        )}
                      >
                        {options(indexOpt)}
                      </span>
                      <p
                        className={cn(
                          "text-sm text-[#101828]",
                          selectedValues === opt?.value && "text-main-100",
                        )}
                      >
                        {opt?.label}
                      </p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Date Input */}
          {ques.type === "date" && (
            <div className="col-span-2">
              <input
                type="date"
                value={selectedValues[ques.id]}
                id={ques.name}
                onChange={(e) => handleInputChange(e.target.value, ques.id)}
                className="form-input w-full rounded-lg border-[#D9DCE0]"
              />
            </div>
          )}

          {/* Image Upload */}
          {ques.type === "image" && (
            <div className="col-span-2">
              <input
                type="file"
                accept={ques.attributes?.accept || "image/*"}
                id={ques.name}
                onChange={(e) => handleInputChange(e.target.files[0], ques.id)}
                className="form-input w-full rounded-lg border-[#D9DCE0]"
              />
            </div>
          )}

          {/* Checkbox Input */}
          {ques.type === "checkbox" && (
            <div className="col-span-2">
              <Checkbox
                id={ques.name}
                checked={selectedValues[ques.id]}
                onCheckedChange={(checked) =>
                  handleInputChange(checked, ques.id)
                }
                className="form-checkbox"
              />
            </div>
          )}

          {/* Select Input */}
          {ques.type === "select" && (
            <div className="col-span-2">
              <select
                id={ques.name}
                value={selectedValues[ques.id]}
                onChange={(e) => handleInputChange(e.target.value, ques.id)}
                className="form-select w-full rounded-lg border-[#D9DCE0]"
              >
                {ques.options?.map((opt: { value: string | number | readonly string[] | undefined; label: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }, index: React.Key | null | undefined) => (
                  <option key={index} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Number Input */}
          {ques.type === "number" && (
            <input
              type="number"
              value={selectedValues[ques.id]}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          )}

          {/* Range Slider */}
          {ques.type === "range" && (
            <input
              type="range"
              value={selectedValues[ques.id]}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.value, ques.id)}
              className="form-range w-full rounded-lg"
              min={ques.attributes?.min}
              max={ques.attributes?.max}
              step={ques.attributes?.step}
            />
          )}
        </div>
      ))}

      <StepperControl next={handleNext} />
    </div>
  );
};

export default DynamicQuestion;
