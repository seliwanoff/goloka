"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { InputOTPBox } from "./Otp";

type PageProps = { setStep: any };

const Verify: React.FC<PageProps> = ({ setStep }) => {
  const [sec, setSec] = useState(60);
  const [otpValues, setOtpValues] = useState<string[]>(Array(5).fill(""));
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(""); // Clear error on change
  };

  const handleOtpSubmit = (value: string) => {
    if (value.length !== 6) {
      setError("Please enter all digits.");
    } else {
      console.log("OTP Submitted:", value);
      // Add your submission logic here
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSec((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col gap-8 md:w-[70%]">
      <div>
        <h2 className="mb-1 text-2xl font-semibold text-[#333333]">
          Verify your account
        </h2>
        <p className="text-[#828282]">
          Enter verification code sent to <br />
          <span className="font-medium text-[#4F4F4F]">
            jimohjamiu2000@gmail.com
          </span>
        </p>
      </div>

      <div className=" ">
        <OtpInput
          length={5}
          onChange={handleOtpChange}
          onSubmit={handleOtpSubmit}
          errorMessage={error}
        />
      </div>

      <div className="text-center">
        Didn’t get the code?{" "}
        <span
          className={cn(
            "cursor-pointer font-semibold text-main-100",
            sec < 1
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-40",
          )}
        >
          Resend
        </span>{" "}
        <br />
        <span className="mt-4 inline-block text-main-100">{sec}secs</span>
      </div>

      <Button
        onClick={() => setStep(2)}
        disabled={otpValues?.length < 5}
        className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
      >
        Verify Account
      </Button>
    </div>
  );
};

export default Verify;

interface OtpInputProps {
  length: number;
  onChange: (otp: string) => void;
  onSubmit: (otp: string) => void;
  errorMessage?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  onChange,
  onSubmit,
  errorMessage,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    onChange(otp.join(""));
  }, [otp, onChange]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (value !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (otp.every((val) => val !== "")) {
      onSubmit(otp.join(""));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            //@ts-ignore
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`h-[55px] w-[53px] rounded-md border text-center ${
              isSubmitted && otp[index] === "border-[#C0CFF6]"
                ? "border-[#E7E7E7]"
                : ""
            } ${errorMessage ? "border-red-500" : ""}`}
            style={{
              backgroundColor: otp[index] ? "#F5F8FF" : "#F9F9F9",
              borderColor: otp[index] ? "#C0CFF6" : "#E7E7E7",
            }}
          />
        ))}
      </div>
      {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
    </div>
  );
};
