"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Verify from "@/components/auth-comps/Verify";
import PrimaryGoal from "@/components/auth-comps/PrimaryGoal";
import SignUpForm from "@/components/auth-comps/SignUpForm";
import UpdateLocationModal from "@/components/contributor/UpdateLocationModal";
import { useShowOverlay } from "@/stores/overlay";
import { toast } from "sonner";
import { googleSignUp } from "@/services/misc";

type PageProps = {};

const SignUpContent: React.FC<PageProps> = ({}) => {
  const [step, setStep] = useState(1);
  const { open, setOpen } = useShowOverlay();
  const router = useRouter();
  const searchParams = useSearchParams();

    const handleGoogleSignUp = async (credentialResponse: any) => {
      try {
        // Call your backend Google sign-up endpoint
        const response = await googleSignUp(credentialResponse.credential);

        if (!response) {
          throw new Error("Google sign-up failed");
        }

        // Store tokens

        //@ts-ignore
        const { access_token, token_type, refresh_token } = response.tokens;
        localStorage.setItem("access_token", JSON.stringify(access_token));
        localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
        localStorage.setItem("token_type", JSON.stringify(token_type));

        toast.success("Sign up successful");

        // Determine next steps based on user registration status
        //@ts-ignore
        if (response.isNewUser) {
          // If new user, guide through additional setup steps
          router.push("/signup?step=2");
          setStep(2);
        } else {
          // If existing user, redirect to dashboard
          router.replace("/dashboard/root");
        }
      } catch (error: any) {
        console.error("Google sign-up error:", error);
        toast.error(
          error?.response?.data?.message || "Google sign-up failed. Try again.",
        );
      }
    };

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
      <div className="md:mx-auto md:w-[70%] lg:w-[80%]">
        {step === 1 && <SignUpForm setStep={handleStepChange} />}
        {step === 2 && <Verify setStep={handleStepChange} />}
        {step === 3 && <PrimaryGoal setStep={handleStepChange} />}
      </div>
      {!open && <UpdateLocationModal />}
    </>
  );
};

const SignUp: React.FC<PageProps> = ({}) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
};

export default SignUp;
