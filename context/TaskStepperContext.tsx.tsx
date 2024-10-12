

// StepperContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type AnswerValue = string | string[] | number | boolean | null;

interface StepperContextProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string | number, AnswerValue>>>;
  updateAnswer: (questionId: string | number, answer: AnswerValue) => void;
  answers: Record<string | number, AnswerValue>;
  totalSteps: number;
}

const StepperContext = createContext<StepperContextProps | undefined>(undefined);

interface StepperProviderProps {
  children: ReactNode;
  totalSteps: number;
}

export const StepperProvider: React.FC<StepperProviderProps> = ({
  children,
  totalSteps,
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string | number, AnswerValue>>({});

  const nextStep = () => setStep((prevStep) =>
    prevStep === totalSteps ? prevStep : prevStep + 1
  );

  const prevStep = () => setStep((prevStep) =>
    prevStep > 1 ? prevStep - 1 : prevStep
  );

  const updateAnswer = (questionId: string | number, answer: AnswerValue) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [questionId]: answer }));
  };

  return (
    <StepperContext.Provider
      value={{
        step,
        nextStep,
        prevStep,
        updateAnswer,
        answers,
        setAnswers,
        setStep,
        totalSteps,
      }}
    >
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = (): StepperContextProps => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }
  return context;
};