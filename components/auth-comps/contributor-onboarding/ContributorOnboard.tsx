"use client";
import React, { useState } from "react";
import MoreInfo from "./MoreInfo";
import Language from "./Language";

type PageProps = {};

const ContributorOnboard: React.FC<PageProps> = ({}) => {
  const [step, setStep] = useState(1);

  const displayStep = (step: number) => {
    switch (step) {
      case 1:
        return <MoreInfo setStep={setStep} step={step} />;
      case 2:
        return <Language setStep={setStep} step={step} />;
      default:
        break;
    }
  };
  return (
    <div>
      <>{displayStep(step)}</>
    </div>
  );
};

export default ContributorOnboard;
