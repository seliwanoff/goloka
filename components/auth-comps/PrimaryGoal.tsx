import React from "react";
import BenchMark from "@/public/assets/images/goal1.png";
import Income from "@/public/assets/images/goal2.png";
import Image from "next/image";
import { BsChevronRight } from "react-icons/bs";

const goals = [
  {
    icon: BenchMark,
    title: "Generate data for my organization",
    content: "Lorem ipsum dolor sit amet consectetur. Pulvinar.",
    path:""
  },
  {
    icon: Income,
    title: "Earn by participating in survey",
    content: "Lorem ipsum dolor sit amet consectetur. Pulvinar.",
        path:"/contributor-onboarding"
  },
];

type PageProps = {
  setStep: any;
};

const PrimaryGoal: React.FC<PageProps> = ({ setStep }) => {
  const handleClick = () => {
    setStep((prev: number) => prev + 1);
  };

  console.log(goals);

  return (
    <div className="flex w-[90%] flex-col gap-8">
      <div>
        <h3 className="mb-2 text-2xl font-semibold lg:text-[32px] lg:leading-[1.4]">
          What is your primary goal on{" "}
          <span className="bg-gradient-to-b from-[#7F55DA] from-55% to-[#1F0656] bg-clip-text text-transparent">
            Goloka?
          </span>{" "}
        </h3>
        <p className="text-base text-[#4F4F4F]">
          Lorem ipsum dolor sit amet consectetur. Blandit nibh convallis et
          imperdiet lobortis et. Egestas vitae bibendum morbi.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {goals.map((goal: any, index: number) => (
          <div
            key={index}
            className="group grid w-full transform cursor-pointer grid-cols-[50px_1fr_20px] items-center rounded border p-2 transition-all ease-out hover:border-[#7F55DA] active:scale-90"
            onClick={handleClick}
          >
            <figure className="flex h-10 w-10 items-center justify-center rounded bg-[#7F55DA0F] transition-colors group-hover:bg-[#ddd5ee]">
              <Image src={goal.icon} alt={goal?.title} width={30} height={30} />
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
              <BsChevronRight />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryGoal;
