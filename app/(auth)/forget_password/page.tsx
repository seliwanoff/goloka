"use client";
import React, { useState } from "react";
import BgPattern from "@/public/assets/images/auth-bg-pattern.svg";
import Image from "next/image";
import ForgetPasswordEmail from "@/components/auth-comps/ForgetPasswordEmail";
import ForgetPasswordOtp from "@/components/auth-comps/ForgetPasswordOtp";
import NewPWSetup from "@/components/auth-comps/NewPWSetup";
import ForgetPasswordSuccess from "@/components/auth-comps/ForgetPasswordSuccess";

type PageProps = {};

const ForgetPassword: React.FC<PageProps> = ({}) => {
  const [step, setStep] = useState(0);

  const displayStep = (step: number) => {
    switch (step) {
      case 0:
        return <ForgetPasswordEmail setStep={setStep} />;
      case 1:
        return <ForgetPasswordOtp setStep={setStep} />;
      case 2:
        return <NewPWSetup setStep={setStep} />;
      case 3:
        return <ForgetPasswordSuccess />;
      default:
        break;
    }
  };

  return (
    <>
      <div className="relative overflow-hidden px-4 md:mx-auto md:w-[70%] lg:h-full lg:w-[70%]">
        {/* BG PATTERN */}
        <div className="absolute -top-10 z-0 hidden h-full w-full lg:block">
          <Image src={BgPattern} alt="auth-bg-pattern" className="scale-105" />
        </div>

        {/* SIGN UP ONBAORDING */}
        <>{displayStep(step)}</>
      </div>
    </>
  );
};

export default ForgetPassword;
