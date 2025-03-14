"use client";

import Language from "@/components/contributor/Language";
import MoreInfo from "@/components/contributor/MoreInfo";
import UpdateLocationModal from "@/components/contributor/UpdateLocationModal";
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
    <>
      <div className="w-full max-w-[320px]">
        <>{displayStep(step)}</>
      </div>

      <UpdateLocationModal />
    </>
  );
};

export default ContributorOnboard;
