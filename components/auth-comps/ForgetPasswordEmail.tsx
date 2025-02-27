"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { forgetPassword } from "@/services/misc";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

type PageProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ForgetPasswordEmail: React.FC<PageProps> = ({ setStep }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ email: string }>({
    mode: "onChange",
  });

  const email = watch("email");

  const onSubmit = async (data: { email: string }) => {
    console.log("Form Data:", data);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);

    try {
      const res = await forgetPassword(formData);
      if (res) {
        // Update the URL to include the email and move to the next step
        router.push(`/forget_password?email=${data.email}&step=1`);
        setIsLoading(false);

        // Proceed to the next step
        setStep(1);
      }
    } catch (error) {
      setIsLoading(false);
      //@ts-ignore
      toast(error?.response?.data?.message);
    }
  };

  return (
    <div className="bg-white">
      <h2 className="mb-2 text-2xl font-semibold text-[#333333]">
        Forgot Password
      </h2>
      <p className="text-[#828282]">
        Enter the email address you registered with
      </p>

      <form
        id="forget-pass"
        className="mt-12"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Label
            htmlFor="email"
            className="mb-2 inline-block text-base font-normal text-[#4F4F4F]"
          >
            Email address
          </Label>
          <Input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Please enter a valid email address",
              },
            })}
            id="email"
            placeholder="Input email address"
            className={cn(
              "h-12 rounded-md border bg-transparent duration-300 placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
              errors.email && "border-red-500",
            )}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {String(errors.email.message)}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!email || !!errors.email}
          className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-opacity-50"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : "Proceed"}
        </Button>
      </form>
    </div>
  );
};

export default ForgetPasswordEmail;
