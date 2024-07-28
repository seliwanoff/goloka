"use client";
import Language from "@/components/auth-comps/contributor-onboarding/Language";
import MoreInfo from "@/components/auth-comps/contributor-onboarding/MoreInfo";
import React, { useState } from "react";


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
