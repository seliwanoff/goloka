import React, { useState } from "react";
import Logo from "@/public/assets/images/goloka-logo.svg";
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

type PageProps = {
  setStep: any;
};

const SignUpForm: React.FC<PageProps> = ({ setStep }) => {
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);

  const handleToggle1 = () => {
    setEye1((prev: boolean) => !prev);
  };

  const handleToggle2 = () => {
    setEye2((prev: boolean) => !prev);
  };
  return (
    <>
      <div className="relative z-10">
        {/* HEADING */}
        <div className="mb-8 flex flex-col items-center gap-2 pt-24 lg:pt-12">
          <Image src={Logo} alt="goloka logo" />
          <h1 className="text-center text-2xl font-bold">
            Welcome to{" "}
            <span className="bg-gradient-to-b from-main-100 from-[55%] to-main-200 bg-clip-text text-transparent">
              Goloka
            </span>
          </h1>
          <p className="text-center text-sm text-neutral-500 lg:text-balance">
            Lorem ipsum dolor sit amet consectetur. Sapien ipsum lorem volutpat
            magna tortor.
          </p>
        </div>

        {/* SIGNUP FORM */}
        <form
          id="sign-up"
          className="space-y-6 [&>label]:block"
          onSubmit={(e) => e.preventDefault()}
        >
          <Label htmlFor="fullname">
            <span className="mb-2 inline-block text-base text-neutral-500">
              Full name
            </span>
            <Input
              name="fullname"
              id="fullname"
              placeholder="Input your name"
              className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
            />
          </Label>

          <Label htmlFor="email">
            <span className="mb-2 inline-block text-base text-neutral-500">
              Email address
            </span>
            <Input
              name="email"
              id="email"
              placeholder="Input email address"
              className="h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
            />
          </Label>

          <Label htmlFor="country">
            <span className="mb-2 inline-block text-base text-neutral-500">
              Select your country
            </span>
            <Select name="country">
              <SelectTrigger className="neutral-400 h-12 w-full rounded-md border bg-transparent focus:ring-1 focus:ring-offset-0 focus-visible:ring-main-100 [&>span]:font-light [&>span]:text-neutral-400">
                <SelectValue
                  placeholder="Select a country"
                  className="text-sm font-light text-neutral-400"
                />
              </SelectTrigger>
              <SelectContent className="max-w-full">
                <SelectGroup>
                  <SelectLabel>Country</SelectLabel>
                  <SelectItem value="ng">Nigeria</SelectItem>
                  <SelectItem value="Gh">Ghana</SelectItem>
                  <SelectItem value="us">United State</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Label>

          <Label htmlFor="password">
            <span className="mb-2 inline-block text-base text-neutral-500">
              Password
            </span>
            <div className="relative">
              <Input
                type={eye1 ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Input password"
                className="h-12 rounded-md border placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
              <span
                onClick={handleToggle1}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500"
              >
                {!eye1 ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>
          </Label>

          <Label htmlFor="password2">
            <span className="mb-2 inline-block text-base text-neutral-500">
              Confirm password
            </span>
            <div className="relative">
              <Input
                type={eye2 ? "text" : "password"}
                name="password2"
                id="password2"
                placeholder="Input password confirm"
                className="h-12 rounded-md border placeholder:text-sm placeholder:font-light placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
              <span
                onClick={handleToggle2}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-500"
              >
                {!eye2 ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </span>
            </div>
          </Label>

          <div className="mt-8 space-y-4">
            <Button
              type="submit"
              onClick={() => setStep(1)}
              className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
            >
              Sign up
            </Button>
            <Button className="h-12 w-full gap-2 rounded-full border border-main-100 bg-main-100 bg-opacity-15 text-base font-light text-white hover:bg-current">
              <FcGoogle size={20} />{" "}
              <span className="text-neutral-600">Sign up with Google</span>
            </Button>
          </div>

          <p className="my-8 text-center">
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
    </>
  );
};

export default SignUpForm;
