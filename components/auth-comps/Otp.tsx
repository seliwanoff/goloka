import React from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface InputOTPBoxProps {
  otpValues: string[];
  onOtpChange: (otpString: string) => void;
}

export function InputOTPBox({ otpValues, onOtpChange }: InputOTPBoxProps) {

  const handleChange = (index: number, value: string) => {

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.toUpperCase();

    onOtpChange(newOtpValues.join(""));
  };

  return (
    <InputOTP maxLength={5} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
      <InputOTPGroup className="flex gap-4">
        {otpValues.map((value, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className={`w-16.25 h-15.75 relative rounded-md border text-center text-2xl uppercase caret-transparent transition-colors ${
              value
                ? "border-blue-500 bg-blue-100 text-blue-500"
                : "border-gray-300"
            } focus:border-blue-500 focus:ring-2 focus:ring-blue-500`}
            style={{
              color: value ? "blue" : undefined,
              backgroundColor: value ? "#C0CFF6" : undefined,
            }}
          >
            <input
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="h-full w-full bg-transparent text-center outline-none"
            />
            {value && (
              <span
                className="absolute bottom-0 left-0 h-full w-full animate-caret-blink"
                style={{
                  backgroundColor: "#C0CFF6",
                  height: "2px",
                  bottom: "0",
                }}
              ></span>
            )}
          </InputOTPSlot>
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
