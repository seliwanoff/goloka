import React, { useState } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function InputOTPBox() {
  const [otpValues, setOtpValues] = useState<string[]>(Array(5).fill(""));

  const handleChange = (index: number, value: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.toUpperCase();
    setOtpValues(newOtpValues);
    console.log(newOtpValues);
  };

  return (
    <InputOTP maxLength={5} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
      <InputOTPGroup className="gap-4 flex">
        {otpValues.map((value, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            value={value}
            className="w-16.25 h-15.75 relative rounded-md border border-gray-300  text-center text-2xl uppercase caret-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(index, e.target.value)
            }
            // onFocus={(e) => e.target.select()}
            style={{
              color: value ? "blue" : undefined,
              backgroundColor: value ? "#C0CFF6" : undefined,
            }}
          >
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
