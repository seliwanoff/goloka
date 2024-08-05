"use client";

import Language from "@/components/contributor/Language";
import MoreInfo from "@/components/contributor/MoreInfo";
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
    <div className="px-4 md:mx-auto md:w-[70%] lg:w-[80%]">
      <>{displayStep(step)}</>
    </div>
  );
};

export default ContributorOnboard;
