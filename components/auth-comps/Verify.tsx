"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import axios from "axios"; // Import axios or any HTTP client you prefer
import { OTP } from "@/services/user";

type PageProps = { setStep: any };

const Verify: React.FC<PageProps> = ({ setStep }) => {
  const [sec, setSec] = useState(60);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOtpChange = (value: string) => {
    if (/^[0-9a-zA-Z]*$/.test(value) && value.length <= 6) {
      const otpArray = value.split("").concat(Array(6 - value.length).fill(""));
      setOtpValues(otpArray);
      setError(""); // Clear error on change
    }
  };

  const handleOtpSubmit = async () => {
    const otpValue = otpValues.join("");
    if (otpValue.length !== 6) {
      setError("Please enter all digits.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Replace with your backend OTP verification endpoint
      const { data } = await OTP(otpValue);
      // On success, move to the next step or show success message
      setStep(2);
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      // Replace with your backend resend OTP endpoint
      await axios.post("/api/resend-otp");
      // Reset the timer
      setSec(60);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
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

  useEffect(() => {
    if (otpValues.every((val) => val !== "")) {
      handleOtpSubmit();
    }
  }, [otpValues]);

  return (
    <div className="flex w-full flex-col gap-8">
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

      <div>
        <OtpInput
          length={6}
          otp={otpValues}
          onChange={handleOtpChange}
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
          onClick={handleResendOtp}
        >
          Resend
        </span>{" "}
        <br />
        <span className="mt-4 inline-block text-main-100">{sec} secs</span>
      </div>

      <Button
        onClick={handleOtpSubmit}
        disabled={otpValues.join("").length < 6 || isSubmitting}
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
  otp: string[];
  onChange: (otp: string) => void;
  errorMessage?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  otp,
  onChange,
  errorMessage,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text");
    if (/^[0-9a-zA-Z]+$/.test(pasteData) && pasteData.length <= length) {
      const otpArray = pasteData
        .split("")
        .concat(Array(length - pasteData.length).fill(""));
      onChange(otpArray.join(""));
      inputRefs.current[Math.min(pasteData.length, length) - 1]?.focus();
    }
  };

  const handleChange = (value: string, index: number) => {
    if (/^[0-9a-zA-Z]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      onChange(newOtp.join(""));

      // Move focus to the next input box if typing, or previous box if deleting
      if (value !== "" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else if (value === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
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

  const handleFocus = (index: number) => {
    if (index > 0 && otp[index - 1] === "") {
      inputRefs.current[index - 1]?.focus();
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
            onFocus={() => handleFocus(index)}
            onPaste={handlePaste}
            className={`h-[55px] w-[53px] rounded-md border text-center ${
              otp[index] !== "" ? "border-[#C0CFF6]" : "border-[#E7E7E7]"
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
