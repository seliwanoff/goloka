"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { passwordOTP, ResetUserPassword, verifyOTP } from "@/services/user";
import { useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useShowPasswordOtp } from "@/stores/misc";
import OTPInput from "react-otp-input";
import { usePasswordFormStore } from "@/stores/passwordResetStore";
import { useUserStore } from "@/stores/currentUserStore";

type PageProps = {};

const FGPOTP: React.FC<PageProps> = () => {
  const open = useShowPasswordOtp((state) => state.showOTP);
  const setOpen = useShowPasswordOtp((state) => state.setShowOTP);
  const [isLoading, setIsLoading] = useState(false);
  const [sec, setSec] = useState(60);
  const [otpValues, setOtpValues] = useState("");
  const [error, setError] = useState("");
  // const [email, setEmail] = useState<string | null>(null);
  const { user: currentUser } = useUserStore();
  const { formValues, setFormData, setErrors, validatePasswords } =
    usePasswordFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   const searchParams = useSearchParams();
  const handleOtpChange = (otpArray: string) => {
    setOtpValues(otpArray);
    setError("");
  };
  const email = currentUser?.email;
  const onResend = async () => {
    setIsLoading(true);
    try {
      const res = await passwordOTP({ email });
      //@ts-ignore
      if (res?.message) {
        console.log(res, "response");
        //@ts-ignore
        toast.success(`${res.message} to ${email}`);
      }
    } catch (error) {
      console.error(error);
      //@ts-ignore
      toast.error("An error occurred while changing the password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otpValues.length !== 6) {
      setError("Please enter all digits.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a new payload excluding oldPassword
      const { oldPassword, ...payload } = formValues;

      // Add the otp to the payload
      const payloadWithOtp = {
        ...payload,
        otp: otpValues,
        email,
      };

      const response = await ResetUserPassword(payloadWithOtp);
      // const { data, status } = response;

      console.log(payloadWithOtp, "response data");
      console.log(response, "response data");
      setIsSubmitting(false);
    } catch (error) {
      toast("Failed to verify OTP. Please try again.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      onResend();
      setSec(60);
      // handleOtpSubmit();
    } catch (error) {
      toast("Failed to resend OTP. Please try again.");
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
    if (otpValues.length === 6) {
      handleOtpSubmit();
    }
  }, [otpValues]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg focus-visible:outline-none sm:w-full",
        )}
      >
        <DialogHeader
          className={cn(
            "absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left",
          )}
        >
          <DialogTitle
            className={cn("text-center text-lg font-medium text-[#333]")}
          >
            Verify your account
          </DialogTitle>
          <DialogDescription className="sr-only text-white">
            Enter verification code sent to <br />
            <span className="font-medium text-[#4F4F4F]">{email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-16 flex w-full flex-col gap-8">
          <div className="text-center text-[#000]">
            Enter verification code sent to <br />
            <span className="font-medium text-[#4F4F4F]">{email}</span>
          </div>
          <div className="mx-auto my-10 flex justify-center md:max-w-96">
            <OTPInput
              value={otpValues}
              onChange={handleOtpChange}
              numInputs={6}
              shouldAutoFocus
              inputStyle={cn(
                "w-[100%_!important] rounded border border-[#E7E7E7] caret-main-100 h-[55px] bg-[#F9F9F9] outline-0 focus:border focus:border-[#C0CFF6] focus:border-opacity-55 focus:bg-[#F5F8FF]",
              )}
              containerStyle={{
                width: "90%",
                display: "grid",
                columnGap: "5px",
                gridTemplateColumns: "repeat(6, 1fr)",
              }}
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <div className="text-center">
            Didn&apos;t get the code?{" "}
            <span
              className={cn(
                "cursor-pointer font-semibold text-main-100",
                sec < 1
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-40",
              )}
              onClick={handleResendOtp}
            >
              {isLoading ? "Resending..." : "Resend"}
            </span>{" "}
            <br />
            <span className="mt-4 inline-block text-main-100">{sec} secs</span>
          </div>
          <Button
            onClick={handleOtpSubmit}
            disabled={otpValues?.length < 6 || isSubmitting}
            className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Verify Account"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FGPOTP;

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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("Text");
    if (/^[0-9a-zA-Z]+$/.test(pasteData) && pasteData.length <= length) {
      const otpArray = pasteData
        .split("")
        .concat(Array(length - pasteData.length).fill(""));
      onChange(otpArray.slice(0, length));
      inputRefs.current[Math.min(pasteData.length, length) - 1]?.focus();
    }
  };

  const handleChange = (value: string, index: number) => {
    if (/^[0-9a-zA-Z]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      onChange(newOtp);

      // Move focus to the next input box if typing
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

  const handleFocus = (index: number) => {
    if (index > 0 && otp[index - 1] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            //@ts-ignore
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={otp[index] || ""}
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
      {errorMessage && (
        <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};
