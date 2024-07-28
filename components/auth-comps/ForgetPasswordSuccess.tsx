import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import Success from "@/public/assets/images/success.svg";
import Image from "next/image";

type PageProps = {};

const ForgetPasswordSuccess: React.FC<PageProps> = ({}) => {
  const router = useRouter();
  return (
    <div className="relative z-[1] py-24 lg:translate-y-[60%] lg:py-0">
      <div className="text-center">
        <Image
          src={Success}
          alt="target illustration"
          width={120}
          height={111}
          className="mx-auto w-[120px]"
        />
        <h2 className="my-6 text-2xl font-semibold lg:text-[xl]">
          Password reset succesful
        </h2>
        <p className="text-[#828282] lg:text-wrap">
          Your password have been reset successfully, you can now log into point
          of sale with your email and new password.
        </p>

        <Button
          onClick={() => router.push("/signin")}
          className="mt-16 h-auto w-full cursor-pointer rounded-full bg-main-100 py-3 font-medium text-white hover:bg-blue-700"
        >
          Login to your account
        </Button>
      </div>
    </div>
  );
};

export default ForgetPasswordSuccess;
