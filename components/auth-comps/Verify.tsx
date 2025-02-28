"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { verifyOTP } from "@/services/user";
import { useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { getCountry, getOTP } from "@/services/misc";

type PageProps = {
  setStep: (step: number, email?: string) => void;
};

const Verify: React.FC<PageProps> = ({ setStep }) => {
  const [sec, setSec] = useState(60);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const searchParams = useSearchParams();

  const handleOtpChange = useCallback((otpArray: string[]) => {
    setOtpValues(otpArray);
    setError("");
    setHasSubmitted(false);
  }, []);

  const handleOtpSubmit = useCallback(async () => {
    if (isSubmitting || otpValues.join("").length !== 6) {
      setError("Please enter all digits.");
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      // @ts-ignore
      const response = await verifyOTP({ otp: otpValues.join("") });
      // @ts-ignore
      if (!response?.message) {
        toast.error("Invalid OTP code. Please try again.");
        return;
      }
      // @ts-ignore
      toast.success(response.message);
      setStep(3);
    } catch (error) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [otpValues, isSubmitting, setStep]);

  const handleResendOtp = async () => {
    if (isResending || sec > 0) return;

    setIsResending(true);
    try {
      const res = await getOTP({});
      if (res) {
        console.log(res, "response");
        toast("OTP resent successfully");
        setSec(60);
        setTimerKey((prev) => prev + 1);
        setOtpValues(Array(6).fill(""));
        setHasSubmitted(false);
      }
    } catch (error) {
      toast("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

const handleNotMyEmail = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("email");
  window.history.replaceState({}, "", url);
  setStep(1);
  toast.info("Returning to sign-in page");
};

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      setStep(1);
    } else {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams, setStep]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sec > 0) {
      interval = setInterval(() => {
        setSec((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerKey]);

  useEffect(() => {
    const isComplete = otpValues.every((val) => val !== "");
    if (isComplete && !isSubmitting && !hasSubmitted) {
      handleOtpSubmit();
    }
  }, [otpValues, handleOtpSubmit, isSubmitting, hasSubmitted]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-center justify-center mb-2">
        <h2 className="mb-1 text-2xl font-semibold text-[#333333]">
          Verify your account
        </h2>
        <p className="text-[#828282] text-center">
          Enter verification code sent to <br />
          <span className="font-medium text-[#4F4F4F] text-center">{email}</span>
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
        Didn&apos;t get the code?{" "}
        <span
          className={cn(
            "cursor-pointer font-semibold text-main-100",
            sec < 1 && !isResending
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-40",
          )}
          onClick={handleResendOtp}
        >
          {isResending ? "Sending..." : "Resend"}
        </span>{" "}
        <br />
        <span className="mt-4 inline-block text-main-100">
          {isResending ? "Sending new code..." : `${sec} secs`}
        </span>
      </div>

      <Button
        onClick={handleOtpSubmit}
        disabled={otpValues.join("").length < 6 || isSubmitting}
        className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
      >
        {isSubmitting ? (
          <FaSpinner className="animate-spin" />
        ) : (
          "Verify Account"
        )}
      </Button>
      <div className="flex items-center justify-center">
      <button
        onClick={handleNotMyEmail}
        className="mt-2 flex items-center text-sm font-medium text-main-100 transition-colors duration-200 hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Not my email?
      </button>

      </div>
    </div>
  );
};

export default Verify;

interface OtpInputProps {
  length: number;
  otp: string[];
  onChange: (otp: string[]) => void;
  errorMessage?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  otp,
  onChange,
  errorMessage,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, currentIndex: number) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("Text").trim();

      if (/^[0-9a-zA-Z]+$/.test(pasteData)) {
        const otpArray = [...otp];

        [...pasteData]
          .slice(0, length - currentIndex)
          .forEach((char, index) => {
            otpArray[currentIndex + index] = char;
          });

        onChange(otpArray);

        const nextEmptyIndex = otpArray.findIndex(
          (val, idx) => idx >= currentIndex && val === "",
        );

        const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
        inputRefs.current[focusIndex]?.focus();
      }
    },
    [length, onChange, otp],
  );

  const handleChange = useCallback(
    (value: string, index: number) => {
      if (/^[0-9a-zA-Z]$/.test(value) || value === "") {
        const newOtp = [...otp];
        newOtp[index] = value;
        onChange(newOtp);

        if (value !== "" && index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    },
    [length, onChange, otp],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newOtp = [...otp];
        if (otp[index] !== "") {
          newOtp[index] = "";
          onChange(newOtp);
        } else if (index > 0) {
          newOtp[index - 1] = "";
          onChange(newOtp);
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      } else if (e.key === "Delete") {
        e.preventDefault();
        const newOtp = [...otp];
        newOtp[index] = "";
        onChange(newOtp);
      }
    },
    [length, onChange, otp],
  );

  const handleClick = useCallback((index: number) => {
    inputRefs.current[index]?.focus();

    inputRefs.current[index]?.select();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => handleClick(index)}
            onPaste={(e) => handlePaste(e, index)}
            className={`h-[55px] w-[53px] rounded-md border text-center outline-none focus:border-[#C0CFF6] focus:bg-[#F5F8FF] ${
              otp[index]
                ? "border-[#C0CFF6] bg-[#F5F8FF]"
                : "border-[#E7E7E7] bg-[#F9F9F9]"
            } ${errorMessage ? "border-red-500" : ""}`}
          />
        ))}
      </div>
      {errorMessage && (
        <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};
