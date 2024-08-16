"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { resetPassword } from "@/services/auth";


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
    otp: params.get("otp") || "",
  };
};
type PageProps = {
  setStep: any;
};


const ResetPasswordForm: React.FC<PageProps> = ({ setStep }) => {
  const { email, otp } = getUrlParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (data.password !== data.password_confirmation) {
      console.error("Passwords do not match");
      return;
    }

    const resetData = {
      email: email, // Ensure `email` is defined and holds the user's email
      otp: otp, // Ensure `otp` is defined and holds the OTP
      password: data.password,
      password_confirmation: data.password_confirmation,
    };

    try {
      const response = await resetPassword(resetData);

      console.log("Response:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="">
      <h2 className="mb-2 text-2xl font-semibold">Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label
            htmlFor="password"
            className="mb-2 text-base font-normal text-[#4F4F4F]"
          >
            New Password
          </Label>
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
            type="password"
            id="password"
            placeholder="Enter new password"
            className={cn(
              "h-12 rounded-md border bg-transparent duration-300 placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100",
              errors.password && "border-red-500",
            )}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <Label
            htmlFor="password_confirmation"
            className="mb-2 text-base font-normal text-[#4F4F4F]"
          >
            Confirm Password
          </Label>
          <Input
            {...register("password_confirmation", {
              required: "Please confirm your password",
            })}
            type="password"
            id="password_confirmation"
            placeholder="Confirm new password"
            className={cn(
              "h-12 rounded-md border bg-transparent duration-300 placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100",
              errors.password_confirmation && "border-red-500",
            )}
          />
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
          Reset Password
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
