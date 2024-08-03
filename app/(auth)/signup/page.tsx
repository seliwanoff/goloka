"use client";
import React, { useState } from "react";
import Verify from "@/components/auth-comps/Verify";
import PrimaryGoal from "@/components/auth-comps/PrimaryGoal";
import SignUpForm from "@/components/auth-comps/SignUpForm";
import UpdateLocationModal from "@/components/auth-comps/contributor-onboarding/UpdateLocationModal";

type PageProps = {};

const SignUp: React.FC<PageProps> = ({}) => {
  const [step, setStep] = useState(1);

  return (
    <>
      <div className="px-4 md:mx-auto md:w-[70%] lg:w-[80%]">
        {step === 1 && <SignUpForm setStep={setStep} />}
        {step === 2 && <Verify setStep={setStep} />}
        {step === 3 && <PrimaryGoal setStep={setStep} />}
      </div>
      <UpdateLocationModal />
    </>
  );
};

export default SignUp;
