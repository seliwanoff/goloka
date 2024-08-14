import React, { createContext, useContext, useState, ReactNode } from "react";

interface StepperContextProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  updateAnswer: (question: string, answer: string) => void;
  answers: Record<string, string>;
}

const StepperContext = createContext<StepperContextProps | undefined>(
  undefined,
);

interface StepperProviderProps {
  children: ReactNode;
}

export const StepperProvider: React.FC<StepperProviderProps> = ({
  children,
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);
  const updateAnswer = (question: string, answer: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: answer }));
  };

  return (
    <StepperContext.Provider
      value={{ step, nextStep, prevStep, updateAnswer, answers }}
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
