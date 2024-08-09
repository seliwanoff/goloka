"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Verify from "@/components/auth-comps/Verify";
import PrimaryGoal from "@/components/auth-comps/PrimaryGoal";
import SignUpForm from "@/components/auth-comps/SignUpForm";
import UpdateLocationModal from "@/components/contributor/UpdateLocationModal";
import useShowOverlay from "@/stores/overlay";

type PageProps = {};

const SignUp: React.FC<PageProps> = ({}) => {
  const [step, setStep] = useState(1);
  const { open, setOpen } = useShowOverlay();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStepChange = (newStep: number, email?: string) => {
    if (newStep === 2 && email) {
      router.push(`/signup?step=2&email=${encodeURIComponent(email)}`);
    } else if (newStep === 3) {
      router.push(`/signup?step=3&verify-complete=true`);
    } else {
      setStep(newStep);
    }
  };

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      setStep(parseInt(stepParam, 10));
    }
  }, [searchParams]);

  return (
    <>
      <div className="px-4 md:mx-auto md:w-[70%] lg:w-[80%]">
        {step === 1 && <SignUpForm setStep={handleStepChange} />}
        {step === 2 && <Verify setStep={handleStepChange} />}
        {step === 3 && <PrimaryGoal setStep={handleStepChange} />}
      </div>
      {!open && <UpdateLocationModal />}
    </>
  );
};

export default SignUp;
