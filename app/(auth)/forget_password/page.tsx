"use client";
import React, { useState, Suspense, useCallback } from "react";
import BgPattern from "@/public/assets/images/auth-bg-pattern.svg";
import Image from "next/image";


const ForgetPasswordEmail = React.lazy(
  () => import("@/components/auth-comps/ForgetPasswordEmail"),
);
const ForgetPasswordOtp = React.lazy(
  () => import("@/components/auth-comps/ForgetPasswordOtp"),
);
const ResetPasswordForm = React.lazy(
  () => import("@/components/auth-comps/NewPWSetup"),
);
const ForgetPasswordSuccess = React.lazy(
  () => import("@/components/auth-comps/ForgetPasswordSuccess"),
);

type PageProps = {};

const ForgetPassword: React.FC<PageProps> = ({}) => {
  const [step, setStep] = useState(0);


  const displayStep = useCallback((step: number) => {
    switch (step) {
      case 0:
        return <ForgetPasswordEmail setStep={setStep} />;
      case 1:
        return <ForgetPasswordOtp setStep={setStep} />;
      case 2:
        return <ResetPasswordForm setStep={setStep} />;
      case 3:
        return <ForgetPasswordSuccess />;
      default:
        return null;
    }
  }, []);

  return (
    <>
      {/* <div className="absolute top-0 z-0 hidden h-full w-full lg:block left-0">
        <Image
          src={BgPattern}
          alt="auth-bg-pattern"
          className="scale-105"
          priority={true}
        />
      </div> */}

      <Suspense fallback={<div>Loading...</div>}>
        <div className="">
          {displayStep(step)}
        </div>
      </Suspense>
    </>
  );
};

export default ForgetPassword;
