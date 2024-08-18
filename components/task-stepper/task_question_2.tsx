import React, { useEffect, useState } from "react";
import { useStepper } from "@/context/TaskStepperContext.tsx";
import Numbering from "./Numbering";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import StepperControl from "./StepperControl";
import { toast } from "sonner";
import { questions2 } from "@/utils";

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

const QuestionTwo: React.FC = () => {
  const { answers, nextStep, updateAnswer } = useStepper();
  const [answer, setAnswer] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const handleNext = () => {
    if (answer?.length > 1 && selectedValue?.length > 1) {
      nextStep();
      console.log(answers, "questions");
    } else {
      toast.error("Please provide all answers");
    }
  };

  const handleChange = (value: string, quesId: string) => {
    setSelectedValue(value);
    updateAnswer(quesId, value);
  };

  const handleAnsInput = (value: string, quesId: string) => {
    setAnswer(value);
    updateAnswer(quesId, value);
  };

  useEffect(() => {
    setAnswer(answers.Q3);
    setSelectedValue(answers.Q4);
  }, []);

  return (
    <div className="space-y-5">
      {questions2.map((ques: any, index: number) => {
        return (
          <>
            <div className="grid grid-cols-[24px_1fr] gap-3" key={index}>
              <Numbering questionNumber={ques?.id?.slice(1)} />{" "}
              <Label
                htmlFor={ques?.value}
                className="text-base leading-7 tracking-[3%] text-[#333333]"
              >
                {ques?.question}
              </Label>
              {ques?.type === "text" ? (
                // QUESTION ANSWER INPUT
                <div className="col-span-2">
                  <textarea
                    value={answer}
                    id={ques?.value}
                    name={ques?.value}
                    placeholder="Input your answer here"
                    onChange={(e) => handleAnsInput(e.target.value, ques?.id)}
                    className="form-textarea h-32 w-full resize-none rounded-lg border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
                  />
                </div>
              ) : (
                // QUESTION OPTIONS
                <div className="col-span-2">
                  <RadioGroup
                    value={selectedValue}
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
                            selectedValue === opt?.value && "border-main-100",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-md bg-[#F8F8F8] text-[#828282]",
                              selectedValue === opt?.value &&
                                "bg-main-100 text-white",
                            )}
                          >
                            {options(indexOpt)}
                          </span>
                          <p
                            className={cn(
                              "text-sm text-[#101828]",
                              selectedValue === opt?.value && "text-main-100",
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
            </div>
          </>
        );
      })}
      <div className="">
        <StepperControl next={handleNext} />
      </div>
    </div>
  );
};

export default QuestionTwo;
