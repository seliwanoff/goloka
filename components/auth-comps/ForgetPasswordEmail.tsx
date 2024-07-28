import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type PageProps = {
  setStep: any;
};

const ForgetPasswordEmail: React.FC<PageProps> = ({ setStep }) => {
  const [email, setEmail] = useState("");

  const onsubmit = (e: any) => {
    e.preventDefault();

    setStep((prev: number) => prev + 1);
  };
  return (
    <div className="relative z-[1] py-24 lg:translate-y-[60%] lg:py-0">
      <h2 className="mb-2 text-2xl font-semibold text-[#333333]">
        Forgot Password
      </h2>
      <p className="text-[#828282]">
        Enter the email address you registered with
      </p>

      <form id="forget-pass" className="mt-12" onSubmit={(e) => onsubmit(e)}>
        <div>
          <Label
            htmlFor="email"
            className="mb-2 inline-block text-base font-normal text-[#4F4F4F]"
          >
            Email address
          </Label>
          <Input
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Input email address"
            className={cn(
              "h-12 rounded-md border bg-transparent duration-300 placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
              email && "bg-main-100 bg-opacity-5",
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={!email?.includes("@") && !email?.includes(".")}
          className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
        >
          Proceed
        </Button>
      </form>
    </div>
  );
};

export default ForgetPasswordEmail;
