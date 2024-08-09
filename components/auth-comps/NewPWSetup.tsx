import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FiEye, FiEyeOff } from "react-icons/fi";

type PageProps = {
  setStep: any;
};

const NewPWSetup: React.FC<PageProps> = ({ setStep }) => {
  const onsubmit = (e: any) => {
    e.preventDefault();

    setStep((prev: number) => prev + 1);
  };

  return (
    <div className="relative z-[1] py-24 lg:translate-y-[60%] lg:py-0">
      <h2 className="mb-2 text-2xl font-semibold lg:text-[32px]">
        Setup new password 🔐
      </h2>
      <p className="text-[#828282]">
        Kindly create a new password for your account.
      </p>

      <form id="forget-pass" className="mt-12" onSubmit={(e) => onsubmit(e)}>
        <div>
          <Label
            htmlFor="password"
            className="mb-2 inline-block text-base font-normal text-[#4F4F4F]"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              name="password"
              id="password"
              // onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter password"
              className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500">
              {true ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </span>
          </div>
        </div>
        <div className="mb-16 mt-4">
          <Label
            htmlFor="password2"
            className="mb-2 inline-block text-base font-normal text-[#4F4F4F]"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              name="password2"
              id="password2"
              // onChange={(e) => setEmail(e.target.value)}
              placeholder="Re-enter password"
              className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500">
              {true ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          // disabled={!email?.includes("@") && !email?.includes(".")}
          className="block h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
        >
          Change Password
        </Button>
      </form>
    </div>
  );
};

export default NewPWSetup;
