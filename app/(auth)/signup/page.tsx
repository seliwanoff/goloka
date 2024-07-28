"use client";
import React, { useState } from "react";
import BgPattern from "@/public/assets/images/auth-bg-pattern.svg";
import Verify from "@/components/auth-comps/Verify";
import PrimaryGoal from "@/components/auth-comps/PrimaryGoal";
import Image from "next/image";
import SignUpForm from "@/components/auth-comps/SignUpForm";
import { cn } from "@/lib/utils";
import ContributorOnboard from "@/components/auth-comps/contributor-onboarding/ContributorOnboard";
import UpdateLocationModal from "@/components/auth-comps/contributor-onboarding/UpdateLocationModal";

type PageProps = {};

const SignUp: React.FC<PageProps> = ({}) => {
  const [step, setStep] = useState(0);

  const displayStep = (step: number) => {
    switch (step) {
      case 0:
        return <SignUpForm setStep={setStep} />;
      case 1:
        return <Verify setStep={setStep} />;
      case 2:
        return <PrimaryGoal setStep={setStep} />;
      case 3:
        return <ContributorOnboard />;
      default:
        break;
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden px-4 md:mx-auto md:w-[70%] lg:h-full lg:w-[80%] xl:w-[70%]",
          step === 2 && "lg:w-full xl:w-[85%]",
        )}
      >
        {/* BG PATTERN */}
        <div className="absolute -top-10 z-0 hidden h-full w-full lg:block">
          <Image src={BgPattern} alt="auth-bg-pattern" className="scale-105" />
        </div>

        {/* SIGN UP ONBAORDING */}
        {displayStep(step)}
      </div>
      <UpdateLocationModal />
    </>
  );
};

export default SignUp;
