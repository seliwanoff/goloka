"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BenchMark from "@/public/assets/images/goal1.png";
import Income from "@/public/assets/images/goal2.png";
import Image from "next/image";
import { BsChevronRight } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/user";
import { useUserStore } from "@/stores/currentUserStore";
import { Loader } from "lucide-react";

const goals = [
  {
    icon: BenchMark,
    title: "Generate data for my organization",
    content: "Generate organic data for your campaigns",
    path: "/organization-onboarding",
    enable: true,
  },
  {
    icon: Income,
    title: "Earn by participating in survey",
    content: "Earn by participating in campaigns",
    path: "/contributor-onboarding",
    enable: true,
  },
];

type PageProps = {
  setStep: (step: number, email?: string) => void;
};
const PrimaryGoal: React.FC<PageProps> = ({ setStep }) => {
  const loginUser = useUserStore((state) => state.loginUser);
  const router = useRouter();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);
  // Query for remote user data
  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["Get current remote user"],
    queryFn: getCurrentUser,
    retry: 1, // Only retry once before considering it a failure
  });

  useEffect(() => {
    if (currentUser && "data" in currentUser && currentUser.data) {
      loginUser(currentUser.data);
    }
  }, [currentUser, loginUser]);

  const handleClick = (path: string) => {
    if (path) {
            setLoadingPath(path);
      router.replace(path);
    } else {
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 text-2xl font-semibold lg:text-[32px] lg:leading-[1.4]">
          What is your primary goal on{" "}
          <span className="bg-gradient-to-b from-[#7F55DA] from-55% to-[#1F0656] bg-clip-text text-transparent">
            Goloka?
          </span>{" "}
        </h3>
        <p className="text-base text-[#4F4F4F]">
          Select the type of account you wan to create on Goloka in order to
          proceed with your registration.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {goals.map((goal, index) => (
          <div
            key={index}
            className={`group grid w-full transform grid-cols-[50px_1fr_20px] items-center rounded border bg-white p-2 transition-all ease-out ${
              goal.enable
                ? "cursor-pointer hover:border-[#7F55DA] hover:bg-[#fffdfd] active:scale-90"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => goal.enable && handleClick(goal.path)}
          >
            <figure className="flex h-10 w-10 items-center justify-center rounded bg-[#7F55DA0F] transition-colors group-hover:bg-[#ddd5ee]">
              <Image src={goal.icon} alt={goal.title} width={30} height={30} />
            </figure>
            <div>
              <h3 className="mb-1 text-xs font-medium text-[#101828] lg:text-[16px] lg:leading-[19.2px]">
                {goal.title}
              </h3>
              <p className="text-[10px] leading-[16.8px] text-[#828282] lg:text-[14px]">
                {goal.content}
              </p>
            </div>
            <span className="cursor-pointer text-[#828282] transition-colors group-hover:text-[#7F55DA]">
              {loadingPath === goal.path ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <BsChevronRight />
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryGoal;
