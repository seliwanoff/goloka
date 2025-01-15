// SignUp.tsx
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Verify from "@/components/auth-comps/Verify";
import PrimaryGoal from "@/components/auth-comps/PrimaryGoal";
import SignUpForm from "@/components/auth-comps/SignUpForm";
import UpdateLocationModal from "@/components/contributor/UpdateLocationModal";
import { useShowOverlay } from "@/stores/overlay";

const SignUpContent: React.FC = () => {
  const [step, setStep] = useState(1);
  const { open, setOpen } = useShowOverlay();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStepChange = (newStep: number, email?: string) => {
    switch (newStep) {
      case 2:
        if (email) {
          // Preserve other query parameters if needed
          const params = new URLSearchParams(searchParams.toString());
          params.set("step", "2");
          params.set("email", email);
          router.push(`/signup?${params.toString()}`);
        }
        break;
      case 3:
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", "3");
        params.set("verify-complete", "true");
        router.push(`/signup?${params.toString()}`);
        break;
      default:
        setStep(newStep);
    }
  };

  // Sync URL state with component state
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const newStep = parseInt(stepParam, 10);
      if (newStep >= 1 && newStep <= 3) {
        // Validate step range
        setStep(newStep);
      }
    }
  }, [searchParams]);

  // Prevent unauthorized access to later steps
  useEffect(() => {
    const verifyComplete = searchParams.get("verify-complete");
    const email = searchParams.get("email");

    if (step === 2 && !email) {
      router.replace("/signup?step=1");
    } else if (step === 3 && !verifyComplete) {
      router.replace("/signup?step=1");
    }
  }, [step, searchParams, router]);

  return (
    <>
      <div className="md:mx-auto md:w-[70%] lg:w-[80%]">
        {step === 1 && <SignUpForm setStep={handleStepChange} />}
        {step === 2 && <Verify setStep={handleStepChange} />}
        {step === 3 && <PrimaryGoal setStep={handleStepChange} />}
      </div>
      {!open && <UpdateLocationModal />}
    </>
  );
};

const SignUp: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;
