"use client";

import React, { useState } from "react";
import BgPattern from "@/public/assets/images/auth-bg-pattern.svg";
import Logo from "@/public/assets/images/thumb.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useAuth } from "@/services/auth/hooks";


type FormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [eye1, setEye1] = useState(false);
  const { login, googleLogin, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      googleLogin(credentialResponse.credential);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was unsuccessful. Please try again.");
  };

  const googleLoginHook = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  const onSubmit = (data: FormValues) => {
    login(data);
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 sm:px-6 lg:px-8">
      <div className="w-full rounded-lg bg-white p-8">
        {/* HEADING */}
        <div className="mb-8 text-center">
          <Image src={Logo} alt="goloka logo" className="mx-auto mb-4" />
          <h1 className="mb-2 text-2xl font-bold">
            Welcome&nbsp;
            <span className="bg-gradient-to-b from-main-100 from-[55%] to-main-200 bg-clip-text text-transparent">
              Back!
            </span>
          </h1>
          <p className="mx-auto max-w-xs text-sm text-gray-500">
            Log in to keep contributing and earning with Goloka
          </p>
        </div>

        {/* SIGNUP FORM */}
        <form
          id="sign-in"
          className="space-y-6 [&>label]:block"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label htmlFor="email">
            <span className="inline-block text-base font-extralight text-[#4F4F4F]">
              Email address
            </span>
            <Input
              type="email"
              id="email"
              placeholder="Input email address"
              className="my-2 h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="mt-2 text-red-600">{errors.email.message}</span>
            )}
          </Label>

          <Label htmlFor="password">
            <span className="inline-block text-base font-extralight text-[#4F4F4F]">
              Password
            </span>
            <div className="relative">
              <Input
                type={eye1 ? "text" : "password"}
                id="password"
                placeholder="Input password"
                className="my-2 h-12 rounded-md border placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                {...register("password", { required: "Password is required" })}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#828282]"
                onClick={() => setEye1(!eye1)}
              >
                {!eye1 ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>
            {errors.password && (
              <span className="mt-2 text-red-600">
                {errors.password.message}
              </span>
            )}
          </Label>

          <Link
            href="/forget_password"
            className="mt-6 inline-block text-sm capitalize text-main-100"
          >
            forgot password?
          </Link>

          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : "Login"}
            </Button>
            <Button
              type="button"
              onClick={() => googleLoginHook()}
              className="h-12 w-full gap-2 rounded-full border border-main-100 bg-main-100 bg-opacity-15 text-base font-light text-white hover:bg-current"
            >
              <FcGoogle size={20} />
              <span className="text-neutral-600">Login with Google</span>
            </Button>
          </div>

          <p className="my-8 text-center">
            Don&apos;t have an account? &nbsp;
            <Link href="/signup" className="text-main-100">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
