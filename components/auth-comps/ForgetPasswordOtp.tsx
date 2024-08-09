"use client";
import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type PageProps = { setStep: any };

const ForgetPasswordOtp: React.FC<PageProps> = ({ setStep }) => {
  const [otp, setOtp] = useState("");

  console.log(otp);

  const handleProceed = () => {
    setStep((prev: number) => prev + 1);
  };

  return (
    <div className="relative z-[1] py-24 lg:translate-y-[60%] lg:py-0">
      <div>
        <h2 className="mb-1 text-2xl font-semibold text-[#333333]">
          Forgot Password
        </h2>
        <p className="text-[#828282]">
          Enter verification code sent to <br />
          <span className="font-medium text-[#4F4F4F]">
            jimohjamiu2000@gmail.com
          </span>
        </p>
      </div>

      <div className="mx-auto my-10 flex justify-center md:max-w-80">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={5}
          inputStyle={cn(
            "w-[100%_!important] rounded border border-[#E7E7E7] caret-main-100  h-[50px] bg-[#F9F9F9] outline-0 focus:border focus:border-main-100 focus:border-opacity-55 focus:bg-main-100 focus:bg-opacity-20",
            // "valid:bg-main-100 valid:bg-opacity-20",
            {
              // width: "100%",
              // height: "50px",
              // outline: "0",
              // border: "1px solid #E7E7E7",
              // background: "#F9F9F9",
              // borderRadius: "5px",
            },
          )}
          containerStyle={{
            width: "100%",
            display: "grid",
            columnGap: "20px",
            gridTemplateColumns: "repeat(5, 1fr)",
          }}
          renderInput={(props) => <input {...props} />}
        />
      </div>

      <div className="text-center">
        Didn’t get the code?{" "}
        <span className="cursor-pointer font-semibold text-main-100">
          Resend
        </span>{" "}
        <br />
        <span className="mt-4 inline-block text-main-100">34secs</span>
      </div>

      <Button
        onClick={handleProceed}
        disabled={otp?.length < 5}
        className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
      >
        Verify Account
      </Button>
    </div>
  );
};

export default ForgetPasswordOtp;
