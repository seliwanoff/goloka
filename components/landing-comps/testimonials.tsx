import React, { FC } from "react";
import { Sparkle } from "lucide-react";
import Image from "next/image";
import Marquee from "@/components/ui/marquee";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Customer from "@/public/assets/images/reviewer.jpg";

type ComponentProps = {};

const Testimonials: FC<ComponentProps> = ({}) => {
  return (
    <section className="max-w-8xl my-20 flex w-full flex-col items-center gap-5 overflow-hidden">
      {/* ####################################### */}
      {/* -- Header section */}
      {/* ####################################### */}
      <div className="flex w-full flex-col items-center gap-2">
        <div className="text-primary-600 mb-5 flex items-center justify-center gap-2 rounded-full bg-violet-50 px-6 py-2 text-sm font-bold">
          <div className="inline-flex items-center space-x-2 text-primary">
            <Sparkle size={16} />
            <span className="text-sm">What are people saying</span>
          </div>
        </div>

        <h2 className="border-0 text-center">
          See what our &nbsp;
          <b className="text-primary-600">Users</b> are saying
        </h2>
        <p className="-mt-2 text-center text-gray-700">
          Our AI tool crafts compelling stories from your data.
        </p>
      </div>
      {/* -- content */}
      {/* -- row 1 */}
      <div className="relative w-full">
        <div className="absolute left-0 top-0 z-10 h-full w-[300px] bg-gradient-to-tr from-white to-transparent" />
        <div className="absolute right-0 top-0 z-10 h-full w-[300px] bg-gradient-to-tl from-white to-transparent" />
        <Marquee pauseOnHover className="relative mt-10 [--duration:40s]">
          {Array.from({ length: 8 }, (data, idx) => (
            <div
              key={idx}
              className="flex w-[400px] cursor-pointer flex-col gap-5 rounded-2xl bg-[#F8F8F8] p-4 hover:shadow-lg"
            >
              <p className="text-right text-sm">
                Monday 16th of January 2024 by 01:20 AM
              </p>
              <p className="text-gray-600 group-hover:text-gray-800">
                The Cybersecurity training with EvolveHQ so far has been
                beneficial for a newcomer like me. The content is presented in a
                way that's understandable, and the practical exercises have
                helped reinforce my understanding.
              </p>

              <div className="flex items-end gap-2">
                <div className="w-10">
                  <AspectRatio ratio={1}>
                    <Image
                      src={Customer}
                      alt="person-img"
                      fill
                      className="rounded-full"
                    />
                  </AspectRatio>
                </div>
                <div className="flex flex-col">
                  <p className="m-0 text-sm font-medium">Benjamin </p>
                  <p className="m-0 text-sm text-muted-foreground">Austria</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
        {/* -- row 2 */}
        <Marquee pauseOnHover reverse className="[--duration:40s]">
          {Array.from({ length: 8 }, (data, idx) => (
            <div
              key={idx}
              className="flex w-[400px] cursor-pointer flex-col gap-5 rounded-2xl bg-[#F8F8F8] p-4 hover:shadow-lg"
            >
              <p className="text-right text-sm">
                Monday 16th of January 2024 by 01:20 AM
              </p>
              <p className="text-gray-600 group-hover:text-gray-800">
                The Cybersecurity training with EvolveHQ so far has been
                beneficial for a newcomer like me. The content is presented in a
                way that's understandable, and the practical exercises have
                helped reinforce my understanding.
              </p>

              <div className="flex items-end gap-2">
                <div className="w-10">
                  <AspectRatio ratio={1}>
                    <Image
                      src={Customer}
                      alt="person-img"
                      fill
                      className="rounded-full"
                    />
                  </AspectRatio>
                </div>
                <div className="flex flex-col">
                  <p className="m-0 text-sm font-medium">Benjamin </p>
                  <p className="m-0 text-sm text-muted-foreground">Austria</p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Testimonials;

const testimonialData: {
  name: string;
  content: string;
  img: any;
  role: string;
}[] = [
  {
    name: "John Abah",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
  {
    name: "Samuel Moses",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
  {
    name: "Daniel Michel",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
  {
    name: "Sanduk Ray",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
  {
    name: "Miss Kent",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
  {
    name: "Donald Troy",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
  {
    name: "John Doe",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
  {
    name: "Samson Telsman",
    role: "ceo dataphyte",
    content: "Lorem ipsum content for review of a user using Nubia",
    img: Customer,
  },
];
