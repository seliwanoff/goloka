"use client";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { InputOTPBox } from "./Otp";

type PageProps = { setStep: any };

const Verify: React.FC<PageProps> = ({ setStep }) => {
  const [otp, setOtp] = useState("");
  const [sec, setSec] = useState(60);

  console.log(otp);

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
    <div className=" flex flex-col gap-8 w-[80%]">
      <div>
        <h2 className="mb-1 text-2xl font-semibold text-[#333333]">
          {/* Verify your account */}
        </h2>
        <p className="text-[#828282]">
          Enter verification code sent to <br />
          <span className="font-medium text-[#4F4F4F]">
            jimohjamiu2000@gmail.com
          </span>
        </p>
      </div>

      <div className=" ">


        <InputOTPBox/>
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
        // disabled={otp?.length < 5}
        className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
      >
        Verify Account
      </Button>
    </div>
  );
};

export default Verify;
