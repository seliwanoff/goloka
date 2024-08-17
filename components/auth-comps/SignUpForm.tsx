import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Logo from "@/public/assets/images/thumb.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { createUser } from "@/services/user";

import { FaSpinner } from "react-icons/fa";
import { getCountry, getOTP } from "@/services/misc";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type PageProps = {
  setStep: (step: number, email?: string) => void;
};
type FormValues = {
  fullname: string;
  email: string;
  country: string;
  password: string;
  password2: string;
};

const SignUpForm: React.FC<PageProps> = ({ setStep }) => {
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryLabel, setSelectedCountryLabel] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const { data: country } = useQuery({
    queryKey: ["Get Country list"],
    queryFn: getCountry,
  });
  const countryData = country && country.data;

  const handleToggle1 = () => {
    setEye1((prev: boolean) => !prev);
  };

  const handleToggle2 = () => {
    setEye2((prev: boolean) => !prev);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    console.log(data);
    const userData = {
      name: data.fullname,
      email: data.email,
      country_id: 1,
      password: data.password,
      password_confirmation: data.password2,
      platform: "web",
    };
    const response = await createUser(userData);
    console.log(response, "response");
    if (response) {
      //@ts-ignore
      toast.success(response?.message)
      //@ts-ignore
      const token = response?.tokens;
      localStorage.setItem("my_id", JSON.stringify(token));
      const res = await getOTP({});
      if (res) {
        console.log(res, "response")
        setIsLoading(false);
        setStep(2, data.email);
      }
    } else {
      setIsLoading(false);
      alert("Error creating user");
    }
    setIsLoading(false);
  };

  return (
    <div className="lg:w-[80%] relative z-10 md:w-[70%]">
      {/* HEADING */}
      <div className="mb-8 flex flex-col items-center gap-2 pt-24 lg:pt-12">
        <Image src={Logo} alt="goloka_logo" />
        <h1 className="text-center text-2xl font-bold">
          Welcome to{" "}
          <span className="bg-gradient-to-b from-main-100 from-[55%] to-main-200 bg-clip-text text-transparent">
            Goloka
          </span>
        </h1>
        <p className="text-center text-sm font-thin text-[#828282] lg:text-balance">
          Lorem ipsum dolor sit amet consectetur. Sapien ipsum lorem volutpat
          magna tortor.
        </p>
      </div>

      {/* SIGNUP FORM */}
      <form
        id="sign-up"
        className="space-y-3 [&>label]:block"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Label htmlFor="fullname">
          <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
            Full name
          </span>
          <Input
            {...register("fullname", { required: "Full name is required" })}
            name="fullname"
            id="fullname"
            placeholder="Input your name"
            className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
          {errors.fullname && (
            <p className="text-xs text-red-500">{errors.fullname.message}</p>
          )}
        </Label>

        <Label htmlFor="email">
          <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
            Email address
          </span>
          <Input
            {...register("email", {
              required: "Email address is required",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            name="email"
            id="email"
            placeholder="Input email address"
            className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </Label>

        <Label htmlFor="country">
          <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
            Select your country
          </span>
          <Controller
            name="country"
            control={control}
            defaultValue=""
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select
                value={selectedCountryLabel}
                onValueChange={(value) => {
                  const selectedCountry = countryData.find(
                    (country: any) => country.id === value,
                  );
                  setSelectedCountryLabel(selectedCountry.label);
                  field.onChange(value); // Pass the country id to useForm
                }}
              >
                <SelectTrigger className="neutral-400 h-12 w-full rounded-md border bg-transparent focus:ring-1 focus:ring-offset-0 focus-visible:ring-main-100 [&>span]:font-light [&>span]:text-neutral-400">
                  <SelectValue
                    placeholder="Select a country"
                    className="text-sm font-light text-neutral-400"
                  >
                    {selectedCountryLabel || "Select a country"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-w-full">
                  <SelectGroup>
                    <SelectLabel>Country</SelectLabel>
                    {countryData?.map((country: any) => (
                      <SelectItem key={country?.id} value={country.id}>
                        {country?.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && (
            <p className="text-xs text-red-500">{errors.country.message}</p>
          )}
        </Label>

        <div className="flex w-full items-center gap-3">
          <Label htmlFor="password" className="flex-1">
            <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
              Password
            </span>
            <div className="relative flex-1">
              <Input
                type={eye1 ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  // minLength: {
                  //   value: 8,
                  //   message: "Password must be at least 8 characters long",
                  // },
                })}
                name="password"
                id="password"
                placeholder="Input password"
                className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
              <span
                onClick={handleToggle1}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500"
              >
                {!eye1 ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </Label>

          <Label htmlFor="password2" className="flex-1">
            <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
              Confirm password
            </span>
            <div className="relative w-full">
              <Input
                type={eye2 ? "text" : "password"}
                {...register("password2", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                name="password2"
                id="password2"
                placeholder="Input password confirm"
                className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
              <span
                onClick={handleToggle2}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500"
              >
                {!eye2 ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>
            {errors.password2 && (
              <p className="text-xs text-red-500">{errors.password2.message}</p>
            )}
          </Label>
        </div>

        <div className="mt-3 space-y-4">
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : "Sign up"}
          </Button>
          <Button className="h-12 w-full gap-2 rounded-full border border-main-100 bg-main-100 bg-opacity-15 text-base font-light text-white hover:bg-current">
            <FcGoogle size={20} />{" "}
            <span className="text-neutral-600">Sign up with Google</span>
          </Button>
        </div>

        <p className="my-3 text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-main-100">
            Log in
          </Link>
        </p>
        <p className="text-center">
          By Signing In, you agree to our{" "}
          <Link href="/" className="text-main-100">
            terms of services
          </Link>{" "}
          and that you have read our{" "}
          <Link href="/" className="text-main-100">
            privacy policy
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
