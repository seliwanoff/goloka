"use client";
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/services/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";

// Type definitions
type FormValues = {
  password: string;
  password_confirmation: string;
};

// Function to get URL parameters
const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    email: params.get("email") || "",
    otp: params.get("tk") || "",
  };
};
type PageProps = {
  setStep: any;
};

const ResetPasswordForm: React.FC<PageProps> = ({ setStep }) => {
  const { email, otp } = getUrlParams();
  const [isLoading, setIsLoading] = useState(false);
  const [eyeState, setEyeState] = useState({ eye1: false, eye2: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const handleToggle = useCallback((eyeKey: "eye1" | "eye2") => {
    setEyeState((prev) => ({ ...prev, [eyeKey]: !prev[eyeKey] }));
  }, []);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsLoading(true);
      if (data.password !== data.password_confirmation) {
        toast("Passwords do not match");
        setIsLoading(false);
        return;
      }
      const resetData = {
        email,
        otp,
        password: data.password,
        password_confirmation: data.password_confirmation,
      };

      try {
        const response = await resetPassword(resetData);
        //@ts-ignore
        toast(response?.message);
        setIsLoading(false);
        setStep(3);
      } catch (error) {
        console.error("Error submitting form:", error);
             setIsLoading(false);
      }
    },
    [email, otp],
  );

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold">Setup new password 🔐</h2>
      <p className="text-[#828282]">
        Kindly create a new password for your account.
      </p>
      <form className="mt-12" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="password">
            <span className="mb-2 text-base font-normal text-[#4F4F4F]">
              New Password
            </span>
            <div className="relative">
              <Input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must include an uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must include a lowercase letter",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Password must include a number",
                    hasSymbol: (value) =>
                      /[!@#$%^&*()_+{}\[\]:;"'<>,.?~`]/.test(value) ||
                      "Password must include a symbol",
                  },
                })}
                type={eyeState.eye1 ? "text" : "password"}
                id="password"
                placeholder="Enter new password"
                className={cn(
                  "h-12 rounded-md border bg-transparent duration-300 placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.password && "border-red-500",
                )}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#828282]"
                onClick={() => handleToggle("eye1")}
              >
                {eyeState.eye1 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </Label>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <Label htmlFor="password_confirmation">
            <span className="inline-block text-base font-extralight text-[#4F4F4F]">
              Confirm Password
            </span>
            <div className="relative">
              <Input
                {...register("password_confirmation", {
                  required: "Please confirm your password",
                })}
                type={eyeState.eye2 ? "text" : "password"}
                id="password_confirmation"
                placeholder="Confirm new password"
                className={cn(
                  "h-12 rounded-md border bg-transparent duration-300 placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.password_confirmation && "border-red-500",
                )}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#828282]"
                onClick={() => handleToggle("eye2")}
              >
                {eyeState.eye2 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </Label>
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="mt-7 h-auto w-full rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default React.memo(ResetPasswordForm);
