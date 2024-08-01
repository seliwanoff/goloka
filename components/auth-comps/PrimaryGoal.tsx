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
  },
  {
    icon: Income,
    title: "Earn by participating in survey",
    content: "Lorem ipsum dolor sit amet consectetur. Pulvinar.",
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
    <div className="relative z-[1] py-24 lg:translate-y-[60%] lg:py-0 bg-slate-400">
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
            className="grid w-full cursor-pointer grid-cols-[50px_1fr_20px] items-center rounded border p-2"
            onClick={handleClick}
          >
            <figure className="flex h-10 w-10 items-center justify-center rounded bg-neutral-100">
              <Image src={goal.icon} alt={goal?.title} width={30} height={30} />
            </figure>{" "}
            <div>
              <h3 className="mb-1 text-xs font-medium text-[#101828] lg:text-base">
                {goal.title}
              </h3>
              <p className="text-[10px] text-[#828282] lg:text-sm">
                {goal.content}
              </p>
            </div>
            <span className="cursor-pointer text-[#828282]">
              <BsChevronRight />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrimaryGoal;
