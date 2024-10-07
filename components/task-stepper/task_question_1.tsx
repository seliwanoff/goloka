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

// const DynamicQuestion = ({ questions }: any) => {
//   const { answers, nextStep, updateAnswer } = useStepper();
//   const [selectedValues, setSelectedValues] = useState({});

//   // Initialize selected values from answers
//   useEffect(() => {
//     const initialAnswers = {};
//     questions.forEach((ques: { id: string | number }) => {
//       //@ts-ignore
//       initialAnswers[ques.id] = answers[ques.id] || "";
//     });
//     setSelectedValues(initialAnswers);
//   }, [questions, answers]);

//   // Handle answer changes
//   const handleInputChange = (
//     value: string | boolean | File,
//     quesId: string,
//   ) => {
//     setSelectedValues((prev) => ({
//       ...prev,
//       [quesId]: value,
//     }));
//     //@ts-ignore
//     updateAnswer(quesId, value);
//   };

//   // const handleNext = () => {
//   //   const allAnswered = questions.every(
//   //     (ques: { id: string | number }) => selectedValues[ques.id]?.length > 0,
//   //   );

//   //   if (allAnswered) {
//   //     nextStep();
//   //   } else {
//   //     toast.error("Please provide all answers");
//   //   }
//   // };

//   const handleChange = (value: string, quesId: string) => {
//     setSelectedValues(value);
//     updateAnswer(quesId, value);
//   };

//   const handleCheckboxChange = (
//     checked: boolean,
//     quesId: number,
//     option: string,
//   ) => {
//     setSelectedValues((prevValues) => {
//       //@ts-ignore
//       const currentSelections = prevValues[quesId] || [];
//       if (checked) {
//         // Add the option if it was checked
//         return {
//           ...prevValues,
//           [quesId]: [...currentSelections, option],
//         };
//       } else {
//         // Remove the option if it was unchecked
//         return {
//           ...prevValues,
//           [quesId]: currentSelections.filter((opt: string) => opt !== option),
//         };
//       }
//     });
//   };

//   const handleNext = (
//     questions: Question[],
//     selectedValues: SelectedValues,
//     nextStep: () => void,
//     toast: { error: (msg: string) => void },
//   ) => {
//     const allAnswered = questions.every(({ id, type }) => {
//       const value = selectedValues?.[id];

//       switch (type) {
//         case "text":
//         case "textarea":
//           return typeof value === "string" && value.trim().length > 0; // Ensure non-empty string
//         case "radio":
//         case "dropdown":
//           return value !== null && value !== ""; // Ensure a non-null, non-empty value
//         case "checkbox":
//           return Array.isArray(value) && value.length > 0; // Ensure it's an array with at least one item
//         case "date":
//           return typeof value === "string" && !isNaN(new Date(value).getTime()); // Ensure valid date
//         case "number":
//           return typeof value === "number" && !isNaN(value); // Ensure valid number
//         default:
//           return true; // Return true for any unknown types
//       }
//     });

//     if (allAnswered) {
//       nextStep();
//     } else {
//       toast.error("Please provide all answers");
//     }
//   };

//   return (
//     <div className="space-y-5">
//       {/* {questions.map((ques) => (
//         <div key={ques.id} className="grid grid-cols-[24px_1fr] gap-3">
//           <Label
//             htmlFor={ques.name}
//             className="text-base leading-7 tracking-[3%] text-[#333333] truncate w-60"
//           >
//             {ques.label}
//           </Label>

//           {ques.type === "text" && (
//             <textarea
//               value={selectedValues[ques.id]}
//               id={ques.name}
//               placeholder={ques.placeholder || "Input your answer here"}
//               onChange={(e) => handleInputChange(e.target.value, ques.id)}
//               className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
//             />
//           )}

//           {ques.type === "radio" && (
//             <RadioGroup
//               value={selectedValues[ques.id]}
//               onValueChange={(val) => handleInputChange(val, ques.id)}
//               className="grid grid-cols-2 gap-5"
//             >
//               {ques.options?.map((opt, index) => (
//                 <div className="group w-full" key={index}>
//                   <RadioGroupItem value={opt.value} id={`q${opt.id}`} />
//                   <Label
//                     htmlFor={`q${opt.id}`}
//                     className="flex items-center gap-3"
//                   >
//                     <span>{opt.label}</span>
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           )}

//           {ques.type === "date" && (
//             <input
//               type="date"
//               value={selectedValues[ques.id]}
//               id={ques.name}
//               onChange={(e) => handleInputChange(e.target.value, ques.id)}
//               className="form-input w-full"
//             />
//           )}

//           {ques.type === "image" && (
//             <input
//               type="file"
//               accept={ques.attributes?.accept}
//               id={ques.name}
//               onChange={(e) => handleInputChange(e.target.files[0], ques.id)}
//               className="form-input w-full"
//             />
//           )}
//         </div>
//       ))} */}

//       {questions.map(
//         (ques: {
//           id: React.Key | null | undefined;
//           name: string | undefined;
//           label:
//             | string
//             | number
//             | bigint
//             | boolean
//             | React.ReactElement<any, string | React.JSXElementConstructor<any>>
//             | Iterable<React.ReactNode>
//             | React.ReactPortal
//             | Promise<React.AwaitedReactNode>
//             | null
//             | undefined;
//           type: string;
//           placeholder: any;
//           options: any[];
//           attributes: {
//             accept: any;
//             min: string | number | undefined;
//             max: string | number | undefined;
//             step: string | number | undefined;
//           };
//         }) => (
//           <div key={ques.id} className="grid grid-cols-[24px_1fr] gap-3">
//             <Label
//               htmlFor={ques.name}
//               className="w-60 truncate text-base leading-7 tracking-[3%] text-[#333333]"
//             >
//               {ques.label}
//             </Label>

//             {/* Textarea Input */}
//             {ques.type === "textarea" && (
//               <div className="col-span-2">
//                 <textarea
//                   //@ts-ignore
//                   value={selectedValues[ques.id]}
//                   id={ques.name}
//                   placeholder={ques.placeholder || "Input your answer here"}
//                   //@ts-ignore
//                   onChange={(e) => handleInputChange(e.target.value, ques.id)}
//                   className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
//                 />
//               </div>
//             )}
//             {/* Textarea Input */}
//             {ques.type === "text" && (
//               <div className="col-span-2">
//                 <input
//                   //@ts-ignore
//                   value={selectedValues[ques.id]}
//                   id={ques.name}
//                   placeholder={ques.placeholder || "Input your answer here"}
//                   type="text"
//                   //@ts-ignore
//                   onChange={(e) => handleInputChange(e.target.value, ques.id)}
//                   className="form-textarea w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
//                 />
//               </div>
//             )}

//             {/* Radio Input */}
//             {/* {ques.type === "radio" && (
//             // <RadioGroup
//             //   value={selectedValues[ques.id]}
//             //   onValueChange={(val) => handleInputChange(val, ques.id)}
//             //   className="grid grid-cols-2 gap-5"
//             // >
//             //   {ques.options?.map((opt, index) => (
//             //     <div className="group w-full" key={index}>
//             //       <RadioGroupItem value={opt.value} id={`q${opt.id}`} />
//             //       <Label
//             //         htmlFor={`q${opt.id}`}
//             //         className="flex items-center gap-3"
//             //       >
//             //         <span>{opt.label}</span>
//             //       </Label>
//             //     </div>
//             //   ))}
//             // </RadioGroup>

//             <div className="col-span-2">
//               <RadioGroup
//                 value={selectedValues}
//                 onValueChange={(val) => handleChange(val, ques?.id)}
//                 className="grid grid-cols-2 gap-5"
//               >
//                 {ques?.options?.map((opt: any, indexOpt: number) => (
//                   <div className="group w-full" key={indexOpt}>
//                     <RadioGroupItem
//                       value={opt?.value}
//                       id={`q${indexOpt}`}
//                       className="hidden"
//                     />
//                     <Label
//                       htmlFor={`q${indexOpt}`}
//                       className={cn(
//                         "flex items-center gap-3 rounded-lg border border-[#D9DCE0] p-2.5 pr-3",
//                         selectedValues === opt?.value && "border-main-100",
//                       )}
//                     >
//                       <span
//                         className={cn(
//                           "flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F8] text-[#828282]",
//                           selectedValues === opt?.value &&
//                             "bg-main-100 text-white",
//                         )}
//                       >
//                         {options(indexOpt)}
//                       </span>
//                       <p
//                         className={cn(
//                           "text-sm text-[#101828]",
//                           selectedValues === opt?.value && "text-main-100",
//                         )}
//                       >
//                         {opt?.label}
//                       </p>
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>
//           )} */}
//             {ques.type === "radio" && (
//               <div className="col-span-2">
//                 <RadioGroup
//                   //@ts-ignore
//                   value={selectedValues[ques.id]} // Ensure each question has its own state
//                   //@ts-ignore
//                   onValueChange={(val) => handleChange(val, ques.id)}
//                   className="grid grid-cols-2 gap-5"
//                 >
//                   {ques.options?.map((opt: string, indexOpt: number) => (
//                     <div className="group w-full" key={indexOpt}>
//                       <RadioGroupItem
//                         value={opt} // Assuming options are strings; use opt directly
//                         id={`q${ques.id}-${indexOpt}`}
//                         className="hidden"
//                       />
//                       <Label
//                         htmlFor={`q${ques.id}-${indexOpt}`}
//                         className={cn(
//                           "flex items-center gap-3 rounded-lg border border-[#D9DCE0] p-2.5 pr-3 transition-colors duration-200 ease-in-out",
//                           //@ts-ignore
//                           selectedValues[ques.id] === opt && "border-main-100",
//                         )}
//                       >
//                         <span
//                           className={cn(
//                             "flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F8] text-[#828282] transition-colors duration-200 ease-in-out",
//                             //@ts-ignore
//                             selectedValues[ques.id] === opt &&
//                               "bg-main-100 text-white",
//                           )}
//                         >
//                           {indexOpt + 1} {/* Using index for numbering */}
//                         </span>
//                         <p
//                           className={cn(
//                             "text-sm text-[#101828] transition-colors duration-200 ease-in-out",
//                             //@ts-ignore
//                             selectedValues[ques.id] === opt && "text-main-100",
//                           )}
//                         >
//                           {opt}
//                         </p>
//                       </Label>
//                     </div>
//                   ))}
//                 </RadioGroup>
//               </div>
//             )}

//             {/* Date Input */}
//             {ques.type === "date" && (
//               <div className="col-span-2">
//                 <input
//                   type="date"
//                   //@ts-ignore
//                   value={selectedValues[ques.id]}
//                   id={ques.name}
//                   //@ts-ignore
//                   onChange={(e) => handleInputChange(e.target.value, ques.id)}
//                   className="form-input w-full rounded-lg border-[#D9DCE0]"
//                 />
//               </div>
//             )}

//             {/* Image Upload */}
//             {ques.type === "file" && (
//               <div className="col-span-2">
//                 <input
//                   type="file"
//                   accept={ques.attributes?.accept || "image/*"}
//                   id={ques.name}
//                   onChange={(e) =>
//                     //@ts-ignore
//                     handleInputChange(e.target.files[0], ques.id)
//                   }
//                   className="form-input w-full rounded-lg border-[#D9DCE0]"
//                 />
//               </div>
//             )}

//             {/* Checkbox Input */}
//             {/* {ques.type === "checkbox" && (
//               <div className="col-span-2">
//                 <Checkbox
//                   id={ques.name}
//                   checked={selectedValues[ques.id]}
//                   onCheckedChange={(checked) =>
//                     handleInputChange(checked, ques.id)
//                   }
//                   className="form-checkbox"
//                 />
//               </div>
//             )} */}
//             {ques.type === "checkbox" && (
//               <div className="col-span-2 grid grid-cols-2 gap-5">
//                 {ques.options?.map((opt: string, indexOpt: number) => (
//                   <div key={indexOpt} className="group flex items-center gap-3">
//                     <Checkbox
//                       id={`q${ques.id}-${indexOpt}`}
//                       //@ts-ignore
//                       checked={selectedValues[ques.id]?.includes(opt) || false}
//                       onCheckedChange={(checked) =>
//                         //@ts-ignore
//                         handleCheckboxChange(checked, ques.id, opt)
//                       }
//                       className="form-checkbox h-5 w-5 text-main-100"
//                     />
//                     <Label
//                       htmlFor={`q${ques.id}-${indexOpt}`}
//                       className="text-sm text-[#101828]"
//                     >
//                       {opt}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Select Input */}
//             {ques.type === "select" && (
//               <div className="col-span-2">
//                 <select
//                   id={ques.name}
//                   //@ts-ignore
//                   value={selectedValues[ques.id]}
//                   //@ts-ignore
//                   onChange={(e) => handleInputChange(e.target.value, ques.id)}
//                   className="form-select w-full rounded-lg border-[#D9DCE0]"
//                 >
//                   {ques.options?.map(
//                     (opt: any, index: React.Key | null | undefined) => (
//                       <option key={index} value={opt}>
//                         {opt}
//                       </option>
//                     ),
//                   )}
//                 </select>
//               </div>
//             )}

//             {/* Number Input */}
//             {ques.type === "number" && (
//               <input
//                 type="number"
//                 //@ts-ignore
//                 value={selectedValues[ques.id]}
//                 id={ques.name}
//                 //@ts-ignore
//                 onChange={(e) => handleInputChange(e.target.value, ques.id)}
//                 className="form-input w-full rounded-lg border-[#D9DCE0]"
//               />
//             )}

//             {/* Range Slider */}
//             {ques.type === "range" && (
//               <input
//                 type="range"
//                 //@ts-ignore
//                 value={selectedValues[ques.id]}
//                 id={ques.name}
//                 //@ts-ignore
//                 onChange={(e) => handleInputChange(e.target.value, ques.id)}
//                 className="form-range w-full rounded-lg"
//                 min={ques.attributes?.min}
//                 max={ques.attributes?.max}
//                 step={ques.attributes?.step}
//               />
//             )}
//           </div>
//         ),
//       )}
//       {/* @ts-ignore */}
//       <StepperControl next={handleNext} />
//     </div>
//   );
// };
const DynamicQuestion = ({
  questions,
  isUngrouped = false,
  isLastStep,
}: {
  questions: Question[];
  isUngrouped?: boolean;
  isLastStep?: boolean;
}) => {
  const { answers, nextStep, updateAnswer } = useStepper();
  const [selectedValues, setSelectedValues] = useState<
    Record<string | number, any>
  >({});

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
  ) => {
    setSelectedValues((prev) => ({
      ...prev,
      [quesId]: value,
    }));
    updateAnswer(quesId, value);
  };

  const handleNext = () => {
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
        default:
          return true;
      }
    });

    if (allAnswered) {
      nextStep();
    } else {
      toast.error("Please answer all questions before proceeding");
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
                value={selectedValues[ques.id] || ""}
                id={ques.name}
                placeholder={ques.placeholder || "Enter your answer"}
                onChange={(e) => handleInputChange(e.target.value, ques.id)}
                className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
              />
            ) : (
              <input
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
          <div className="col-span-2">
            <input
              type="file"
              accept={ques.attributes?.accept || "image/*"}
              id={ques.name}
              onChange={(e) => handleInputChange(e.target.files[0], ques.id)}
              className="form-input w-full rounded-lg border-[#D9DCE0]"
            />
          </div>
        );

      case "date":
        return (
          <div className="col-span-2">
            <input
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

  return (
    <div className="space-y-5">
      {isUngrouped && (
        <h2 className="mb-4 text-xl font-semibold">Additional Questions</h2>
      )}
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
      <StepperControl next={handleNext} />
    </div>
  );
};

export default DynamicQuestion;
