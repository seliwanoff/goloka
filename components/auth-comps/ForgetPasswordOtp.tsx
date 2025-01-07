"use client";
import React, { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

type PageProps = { setStep: any };

const ForgetPasswordOtp: React.FC<PageProps> = ({ setStep }) => {
  const [otp, setOtp] = useState("");
  const [sec, setSec] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (sec > 0) {
      const timer = setTimeout(() => setSec(sec - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [sec]);

  const handleProceed = () => {
    if (otp?.length === 6) {
      // Update the URL with the OTP and step
      router.push(
        `/forget_password?email=${email}&tk=${otp}&step=2`
      );
      console.log("OTP Submitted:", otp);
      setStep(2);
    }
  };

  const handleResendOtp = async () => {
    if (sec < 1) {
      try {
        console.log("OTP Resent");
        setSec(60);
      } catch (error) {
        console.error("Failed to resend OTP. Please try again.", error);
      }
    }
  };

  return (
    <div className="">
      <div>
        <h2 className="mb-1 text-2xl font-semibold text-[#333333]">
          Forgot Password
        </h2>
        <p className="text-[#828282]">
          Enter the verification code sent to <br />
          <span className="font-medium text-[#4F4F4F]">{email}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div className="mx-auto my-10 flex justify-center md:max-w-96">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          // isInputNum
          shouldAutoFocus
          inputStyle={cn(
            "w-[100%_!important] rounded border border-[#E7E7E7] caret-main-100 h-[55px] bg-[#F9F9F9] outline-0 focus:border focus:border-[#C0CFF6] focus:border-opacity-55 focus:bg-[#F5F8FF]",
          )}
          containerStyle={{
            width: "100%",
            display: "grid",
            columnGap: "10px",
            gridTemplateColumns: "repeat(6, 1fr)",
          }}
          renderInput={(props) => <input {...props} />}
        />
      </div>

      {/* Resend Timer */}
      <div className="text-center">
        Didn’t get the code?{" "}
        <span
          className={cn(
            "cursor-pointer font-semibold text-main-100",
            sec < 1
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-40",
          )}
          onClick={handleResendOtp}
        >
          Resend
        </span>
        <br />
        <span className="mt-4 inline-block text-main-100">{sec} secs</span>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleProceed}
        disabled={otp?.length < 6} // Ensure 6-digit OTP
        className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
      >
        {isLoading ? <FaSpinner className="animate-spin" /> : " Verify Account"}
      </Button>
    </div>
  );
};

export default ForgetPasswordOtp;
