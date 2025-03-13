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
import { getCurrentOrganization, userSignIn } from "@/services/auth";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { getContributorsProfile } from "@/services/contributor";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";
import { useAuth } from "@/services/auth/hooks";
import { getOTP } from "@/services/misc";
import { getUseServices } from "@/services/organization";
import { set } from "date-fns";

type PageProps = {};

type FormValues = {
  email: string;
  password: string;
};

const SignIn: React.FC<PageProps> = ({}) => {
  const [eye1, setEye1] = useState(false);
  const { googleLogin, isNavigating } = useAuth();
  const [isUserDataCaptured, setIsUserDataCaptured] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleToggle1 = () => {
    setEye1((prev: boolean) => !prev);
  };
  const [isLoading, setIsLoading] = useState(false);
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );

  const handleGoogleSuccess = (credentialResponse: any) => {
    // console.log(credentialResponse);
    if (credentialResponse.credential) {
      googleLogin(credentialResponse.credential);
    }
  };
  const handleGoogleError = () => {
    toast.error("Google sign-in was unsuccessful. Please try again.");
  };

  // const onSubmit: SubmitHandler<FormValues> = async (data) => {
  //   setIsLoading(true);

  //   try {
  //     const { email, password } = data;
  //     // console.log(data);

  //     const response = await userSignIn(email, password);

  //     if (!response) {
  //       throw new Error(
  //         "Failed to sign in. Please check your credentials and try again.",
  //       );
  //     }
  //     //@ts-ignore
  //     // setUser(remoteUser.data);

  //     //@ts-ignore
  //     const { access_token, token_type, refresh_token } = response.tokens;

  //     //const {}

  //     const storeTokens = () => {
  //       localStorage.setItem("access_token", JSON.stringify(access_token));
  //       localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
  //       localStorage.setItem("token_type", JSON.stringify(token_type));
  //     };

  //     // Redirect to the dashboard
  //     storeTokens();
  //     //  console.log(response);
  //     toast.success("Sign in successful");
  //     //@ts-ignore
  //     if (response.user.current_role === "campaigner") {
  //       router.replace("/organization/dashboard/root");
  //     } else {
  //       router.replace("/dashboard/root");
  //     }
  //   } catch (error: any) {
  //     console.error("Sign-in error:", error);
  //     toast.error(
  //       error?.response?.data?.message ||
  //         "Failed to sign in. Please try again.",
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    getCurrentOrganization(null);

    try {
      const { email, password } = data;

      toast.loading("Signing you in...");

      const response = await userSignIn(email, password);

      if (!response) {
        throw new Error(
          "Failed to sign in. Please check your credentials and try again.",
        );
      }

      //@ts-ignore
      const { access_token, token_type, refresh_token } = response.tokens;

      // Store tokens immediately
      localStorage.setItem("access_token", JSON.stringify(access_token));
      localStorage.setItem("refresh_token", JSON.stringify(refresh_token));
      localStorage.setItem("token_type", JSON.stringify(token_type));

      //@ts-ignore

      if (response?.user?.email_verified_at === null) {
        toast.dismiss();
        toast.success("Sign in successful, verification needed");

        // in parallel with navigation preparation to prevent any bulls***T
        const otpPromise = getOTP({});

        //@ts-ignore
        const redirectUrl = `/signup?step=2&email=${encodeURIComponent(response?.user?.email)}`;
        router.prefetch(redirectUrl);

        const otpResponse = await otpPromise;
        if (otpResponse) {
          router.push(redirectUrl);
        }
        return;
      }
      //@ts-ignore
      console.log(`lenght:${response?.services.length}`);
      //@ts-ignore

      /***

      const responses = await getUseServices();
      //@ts-ignore
      if (responses?.services?.length === 0) {
        router.push("/signup?step=3&verify-complete=true");
        return;
      }

      */

      //  parallel
      toast.dismiss();

      toast.success("Sign in successful");
      //@ts-ignore
      if (response?.services.length === 0) {
        //   console.log("inside");
        router.push(`/signup?step=3&verify-complete=true`);
        return;
      }
      const redirectPath =
        //@ts-ignore
        response.user.current_role === "campaigner"
          ? "/organization/dashboard/root"
          : "/dashboard/root";

      router.prefetch(redirectPath);

      router.replace(redirectPath);
    } catch (error: any) {
      toast.dismiss();
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
    <div className="w-full max-w-2xl">
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
            Sign in to keep contributing and earning with Goloka
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
              {isLoading ? <FaSpinner className="animate-spin" /> : "Sign In"}
            </Button>
            {isNavigating && <LoadingOverlay />}
            <div className="mt-4 flex w-full justify-center">
              <div className="h-12 w-full">
                {" "}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  type="standard"
                  theme="outline"
                  size="large"
                  shape="pill"
                  width="100%" // Dynamically adjust width
                  text="signin_with"
                  logo_alignment="center"
                />
              </div>
            </div>
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
const LoadingOverlay = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-main-100 border-t-transparent" />
        <p className="text-sm font-medium text-gray-700">
          Preparing your dashboard...
        </p>
      </div>
    </div>
  </div>
);
