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
  const [timerKey, setTimerKey] = useState(0); // Add this to force timer reset
  const searchParams = useSearchParams();

  const handleOtpChange = useCallback((otpArray: string[]) => {
    setOtpValues(otpArray);
    setError("");
    setHasSubmitted(false); // Reset submission state when OTP changes
  }, []);



  // const handleOtpSubmit = useCallback(async () => {
  //   // Prevent multiple submissions
  //   if (isSubmitting) return;

  //   // Validate OTP length
  //   const otpValue = otpValues.join("");
  //   if (otpValue.length !== 6) {
  //     setError("Please enter all digits.");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setHasSubmitted(true);

  //   try {
  //     const response = await verifyOTP({ otp: otpValue });

  //     console.log(response);
  //     const { data } = response;

  //     // @ts-ignore
  //     if (!response?.message) {
  //       toast("Invalid OTP code. Please try again.");
  //       return;
  //     }

  //     // @ts-ignore
  //     toast.success(response?.message);
  //     setStep(3);
  //   } catch (error) {
  //     toast("Failed to verify OTP. Please try again.");
  //     // Don't proceed to next step on error
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }, [otpValues, isSubmitting, setStep]);

  const handleOtpSubmit = useCallback(async () => {
    if (isSubmitting || otpValues.join("").length !== 6) {
      setError("Please enter all digits.");
      return;
    }

    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      const response = await verifyOTP({ otp: otpValues.join("") });
      // @ts-ignore
      if (!response?.message) {
        toast.error("Invalid OTP code. Please try again.");
        return;
      }
      // @ts-ignore
      toast.success(response.message);
      setStep(3); // This will trigger navigation with verify-complete flag
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
        setTimerKey((prev) => prev + 1); // Increment timer key to force reset
        // Clear previous OTP
        setOtpValues(Array(6).fill(""));
        setHasSubmitted(false);
      }
    } catch (error) {
      toast("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // useEffect(() => {
  //   const emailParam = searchParams.get("email");
  //   if (emailParam) {
  //     setEmail(decodeURIComponent(emailParam));
  //   }
  // }, [searchParams]);

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

  // Only trigger submit once when OTP is complete
  useEffect(() => {
    const isComplete = otpValues.every((val) => val !== "");
    if (isComplete && !isSubmitting && !hasSubmitted) {
      handleOtpSubmit();
    }
  }, [otpValues, handleOtpSubmit, isSubmitting, hasSubmitted]);

  return (
    <div className="flex w-full flex-col gap-8">
      <div>
        <h2 className="mb-1 text-2xl font-semibold text-[#333333]">
          Verify your account
        </h2>
        <p className="text-[#828282]">
          Enter verification code sent to <br />
          <span className="font-medium text-[#4F4F4F]">{email}</span>
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

// const OtpInput: React.FC<OtpInputProps> = ({
//   length,
//   otp,
//   onChange,
//   errorMessage,
// }) => {
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   const handlePaste = useCallback(
//     (e: React.ClipboardEvent<HTMLInputElement>) => {
//       e.preventDefault();
//       const pasteData = e.clipboardData.getData("Text").trim();
//       if (/^[0-9a-zA-Z]+$/.test(pasteData)) {
//         const otpArray = Array(length).fill("");
//         [...pasteData].slice(0, length).forEach((char, index) => {
//           otpArray[index] = char;
//         });
//         onChange(otpArray);
//         // Focus the next empty input or the last input
//         const nextEmptyIndex =
//           otpArray.findIndex((val) => val === "") ?? length - 1;
//         inputRefs.current[nextEmptyIndex]?.focus();
//       }
//     },
//     [length, onChange],
//   );

//   const handleChange = useCallback(
//     (value: string, index: number) => {
//       if (/^[0-9a-zA-Z]$/.test(value) || value === "") {
//         const newOtp = [...otp];
//         newOtp[index] = value;
//         onChange(newOtp);

//         // Automatically move focus to next input when typing
//         if (value !== "" && index < length - 1) {
//           inputRefs.current[index + 1]?.focus();
//         }
//       }
//     },
//     [length, onChange, otp],
//   );

//   const handleKeyDown = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//       if (e.key === "Backspace") {
//         if (otp[index] === "") {
//           // If current input is empty, move to previous input and clear it
//           if (index > 0) {
//             const newOtp = [...otp];
//             newOtp[index - 1] = "";
//             onChange(newOtp);
//             inputRefs.current[index - 1]?.focus();
//           }
//         } else {
//           // Clear current input
//           const newOtp = [...otp];
//           newOtp[index] = "";
//           onChange(newOtp);
//         }
//       } else if (e.key === "ArrowLeft" && index > 0) {
//         inputRefs.current[index - 1]?.focus();
//       } else if (e.key === "ArrowRight" && index < length - 1) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     },
//     [length, onChange, otp],
//   );

//   const handleClick = useCallback(
//     (index: number) => {
//       // When clicking an input, if previous inputs are empty, focus the first empty input
//       for (let i = 0; i < index; i++) {
//         if (!otp[i]) {
//           inputRefs.current[i]?.focus();
//           return;
//         }
//       }
//     },
//     [otp],
//   );

//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex space-x-2">
//         {Array.from({ length }).map((_, index) => (
//           <input
//             key={index}
//             ref={(el) => (inputRefs.current[index] = el)}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={otp[index] || ""}
//             onChange={(e) => handleChange(e.target.value, index)}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             onClick={() => handleClick(index)}
//             onPaste={handlePaste}
//             className={`h-[55px] w-[53px] rounded-md border text-center outline-none focus:border-[#C0CFF6] focus:bg-[#F5F8FF] ${
//               otp[index]
//                 ? "border-[#C0CFF6] bg-[#F5F8FF]"
//                 : "border-[#E7E7E7] bg-[#F9F9F9]"
//             } ${errorMessage ? "border-red-500" : ""}`}
//           />
//         ))}
//       </div>
//       {errorMessage && (
//         <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
//       )}
//     </div>
//   );
// };

// export default OtpInput;
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
        const otpArray = [...otp]; // Preserve existing values

        // Start pasting from the current input position
        [...pasteData]
          .slice(0, length - currentIndex)
          .forEach((char, index) => {
            otpArray[currentIndex + index] = char;
          });

        onChange(otpArray);

        // Focus the next empty input or the last input
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
        newOtp[index] = value; // Replace existing value
        onChange(newOtp);

        // Automatically move focus to next input when typing
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
        e.preventDefault(); // Prevent default backspace behavior

        const newOtp = [...otp];
        if (otp[index] !== "") {
          // If current input has value, clear it
          newOtp[index] = "";
          onChange(newOtp);
        } else if (index > 0) {
          // If current input is empty, move to previous input and clear it
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
    // Allow clicking any input directly
    inputRefs.current[index]?.focus();

    // Optional: Select the content of the clicked input
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