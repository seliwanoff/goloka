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
import { useForm, SubmitHandler } from "react-hook-form";
import { userSignIn } from "@/services/auth";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { getContributorsProfile } from "@/services/contributor";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";

type PageProps = {};

type FormValues = {
  email: string;
  password: string;
};

const SignIn: React.FC<PageProps> = ({}) => {
  const [eye1, setEye1] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log(credentialResponse, " hthhthththt");
    try {
      const res = await fetch(
        "https://staging.goloka.io/api/login/google/auth",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: new URLSearchParams({
            id_token: credentialResponse.credential,
            platform: "web",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google sign-in failed");
      }

      // Store tokens
      localStorage.setItem(
        "access_token",
        JSON.stringify(data.tokens.access_token),
      );
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data.tokens.refresh_token),
      );
      localStorage.setItem(
        "token_type",
        JSON.stringify(data.tokens.token_type),
      );

      toast.success("Google sign in successful");
      router.replace("/dashboard/root");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Failed to sign in with Google");
    }
  };
  const handleGoogleError = () => {
    toast.error("Google sign-in was unsuccessful. Please try again.");
  };
  const handleToggle1 = () => {
    setEye1((prev: boolean) => !prev);
  };
  const [isLoading, setIsLoading] = useState(false);
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );
  console.log(currentOrganization);

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    flow: "auth-code",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);

    try {
      const { email, password } = data;
      // console.log(data);

      const response = await userSignIn(email, password);

      if (!response) {
        throw new Error(
          "Failed to sign in. Please check your credentials and try again.",
        );
      }
      //@ts-ignore
      // setUser(remoteUser.data);

      //@ts-ignore
      const { access_token, token_type, refresh_token } = response.tokens;

      //const {}

      const storeTokens = () => {
        localStorage.setItem("access_token", JSON.stringify(access_token));
        localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
        localStorage.setItem("token_type", JSON.stringify(token_type));
      };

      // Redirect to the dashboard
      storeTokens();
      //  console.log(response);
      toast.success("Sign in successful");
      //@ts-ignore
      if (response.user.current_role === "campaigner") {
        router.replace("/organization/dashboard/root");
      } else {
        router.replace("/dashboard/root");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to sign in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
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
                onClick={handleToggle1}
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
              className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : "Login"}
            </Button>
            <Button
              type="button"
              onClick={() => login()}
              className="h-12 w-full gap-2 rounded-full border border-main-100 bg-main-100 bg-opacity-15 text-base font-light text-white hover:bg-current"
            >
              <FcGoogle size={20} />
              <span className="text-neutral-600">Login with Google</span>
            </Button>

            {/* <div className="flex justify-center w-full">
  <div className="w-full">
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
      type="standard"
      theme="outline"
      size="large"
      shape="pill"
      width="100%"
      text="continue_with"
      custom_style={{
        height: '48px',
        backgroundColor: 'rgba(var(--main-100), 0.15)',
        border: '1px solid var(--main-100)',
        borderRadius: '9999px',
      }}
    />
  </div>
</div> */}
          </div>

          <p className="my-8 text-center">
            Don’t have an account? &nbsp;
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
