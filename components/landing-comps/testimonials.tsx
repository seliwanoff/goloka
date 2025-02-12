import React, { FC } from "react";
import { Sparkle } from "lucide-react";
import Image from "next/image";
import Marquee from "@/components/ui/marquee";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Customer from "@/public/assets/images/reviewer.jpg";

type ComponentProps = {};
type Testimonial = {
  id: string;
  quote: string;
  author: string;
  position: string;
  organization: string;
};
const Testimonials: FC<ComponentProps> = ({}) => {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase();
  };
  return (
    <section className="max-w-8xl my-20 flex w-full flex-col items-center gap-5 overflow-hidden px-4">
      {/* Header section */}
      <div className="flex w-full flex-col items-center gap-2">
        <div className="text-primary-600 mb-5 flex items-center justify-center gap-2 rounded-full bg-violet-50 px-6 py-2 text-sm font-bold">
          <div className="inline-flex items-center space-x-2 text-primary">
            <Sparkle size={16} />
            <span className="text-sm">Testimonial</span>
          </div>
        </div>

        <h2 className="text-center text-2xl font-semibold text-[#333] md:text-balance md:text-[2rem] md:leading-normal">
          See what our <b className="text-main-100">Users</b> are saying
        </h2>
      </div>

      {/* Content */}
      <div className="relative w-full">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 z-10 h-full w-[100px] bg-[linear-gradient(to_right,white_50%,transparent)] md:w-[300px]" />
        <div className="absolute right-0 top-0 z-10 h-full w-[100px] bg-[linear-gradient(to_left,white_50%,transparent)] md:w-[300px]" />

        {/* First row */}
        <Marquee pauseOnHover className="relative mt-10 [--duration:40s]">
          {testimonials.map((data) => (
            <div
              key={data.id}
              className="mx-2 flex w-[280px] cursor-pointer flex-col gap-5 rounded-2xl bg-[#F8F8F8] p-4 hover:shadow-lg md:w-[400px]"
            >
              <p className="text-sm text-gray-600 group-hover:text-gray-800 md:text-base">
                {data.quote}
              </p>

              <div className="flex items-end gap-2">
                <div className="w-8 md:w-10">
                  <AspectRatio ratio={1}>
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white">
                      {getInitials(data.author)}
                    </div>
                  </AspectRatio>
                </div>
                <div className="flex flex-col">
                  <p className="m-0 text-xs font-medium md:text-sm">
                    {data.author}
                  </p>
                  <p className="m-0 text-xs text-muted-foreground md:text-sm">
                    {data.position}, {data.organization}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Marquee>

        {/* Second row */}
        <Marquee pauseOnHover reverse className="[--duration:40s]">
          {testimonials.map((data) => (
            <div
              key={data.id}
              className="mx-2 flex w-[280px] cursor-pointer flex-col gap-5 rounded-2xl bg-[#F8F8F8] p-4 hover:shadow-lg md:w-[400px]"
            >
              <p className="text-sm text-gray-600 group-hover:text-gray-800 md:text-base">
                {data.quote}
              </p>

              <div className="flex items-end gap-2">
                <div className="w-8 md:w-10">
                  <AspectRatio ratio={1}>
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-600 text-white">
                      {getInitials(data.author)}
                    </div>
                  </AspectRatio>
                </div>
                <div className="flex flex-col">
                  <p className="m-0 text-xs font-medium md:text-sm">
                    {data.author}
                  </p>
                  <p className="m-0 text-xs text-muted-foreground md:text-sm">
                    {data.position}, {data.organization}
                  </p>
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
  location: string;
  date: string;
}[] = [
  {
    date: "Monday 16th of January 2024 by 01:20 AM",
    content:
      "The Cybersecurity training with EvolveHQ so far has been beneficial for a newcomer like me. The content is presented in a way that's understandable, and the practical exercises have helped reinforce my understanding.",
    img: "/images/customer1.jpg",
    name: "Benjamin",
    location: "Austria",
  },
  {
    date: "Wednesday 3rd of February 2024 by 10:45 AM",
    content:
      "EvolveHQ's Data Science program was a game changer. The mentorship and detailed explanations helped me transition into a new career.",
    img: "/images/customer2.jpg",
    name: "Emily",
    location: "Canada",
  },
  {
    date: "Friday 5th of March 2024 by 04:30 PM",
    content:
      "The hands-on projects during the AI course were exactly what I needed. EvolveHQ provided practical examples that helped solidify my understanding.",
    img: "/images/customer3.jpg",
    name: "Arjun",
    location: "India",
  },
  {
    date: "Tuesday 10th of April 2024 by 11:00 AM",
    content:
      "The UI/UX design course was fantastic. I was able to land a freelance job right after completing the course!",
    img: "/images/customer4.jpg",
    name: "Sophia",
    location: "Germany",
  },
  {
    date: "Thursday 7th of May 2024 by 09:15 AM",
    content:
      "EvolveHQ's coding bootcamp made coding fun and accessible for someone like me who was new to the field. I would highly recommend it to others.",
    img: "/images/customer5.jpg",
    name: "Michael",
    location: "USA",
  },
  {
    date: "Monday 12th of June 2024 by 08:00 AM",
    content:
      "The Blockchain course was extremely detailed, and the instructors were always willing to help. I learned so much more than I expected!",
    img: "/images/customer6.jpg",
    name: "Chen",
    location: "China",
  },
  {
    date: "Friday 20th of July 2024 by 02:45 PM",
    content:
      "The project-based learning in the Cybersecurity track has been the highlight for me. It’s one of the best training programs I have participated in.",
    img: "/images/customer7.jpg",
    name: "Maria",
    location: "Spain",
  },
  {
    date: "Sunday 25th of August 2024 by 05:30 PM",
    content:
      "The AI course at EvolveHQ provided me with both theoretical and practical skills that I now use daily in my work.",
    img: "/images/customer8.jpg",
    name: "James",
    location: "Australia",
  },
  {
    date: "Wednesday 30th of September 2024 by 06:00 PM",
    content:
      "EvolveHQ's web development program gave me the skills I needed to start building real-world applications. The community was also very supportive.",
    img: "/images/customer9.jpg",
    name: "Luna",
    location: "Brazil",
  },
  {
    date: "Tuesday 15th of October 2024 by 07:20 AM",
    content:
      "The practical exercises in the Cloud Computing course were so valuable. I now feel confident in setting up and managing cloud environments.",
    img: "/images/customer10.jpg",
    name: "Oliver",
    location: "United Kingdom",
  },
];

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Working with Goloka was a game-changer for our data collection process. Their agents were knowledgeable, responsive, and always went above and beyond to ensure that we received the data we needed on time",
    author: "Atiku Samuel",
    position: "Technical Coordinator",
    organization: "IBP",
  },
  {
    id: "2",
    quote:
      "We were impressed by Goloka's commitment to quality and attention to detail. Their agents provided us with thorough and accurate data, which enabled us to make informed decisions about our business strategies.",
    author: "Kadaria Ahmed",
    position: "CEO",
    organization: "Daria Media",
  },
  {
    id: "3",
    quote:
      "We needed to conduct a market survey in a remote location, and GoLoka's agents were able to mobilise quickly and gather valuable data that helped us make informed business decisions.",
    author: "Ambassador Jola Adekola",
    position: "Exec. Director",
    organization: "JAIRAA",
  },
  {
    id: "4",
    quote:
      "Goloka's mobile field agents were incredibly helpful in gathering real-time data for our research project. Their professional and efficient approach made the process seamless and stress-free.",
    author: "Martin Obono",
    position: "Executive Director",
    organization: "TapNitiative",
  },
  {
    id: "5",
    quote:
      "I am thrilled to share my positive experience working with Goloka on a digital surveillance project. Their services exceeded my expectations in terms of quality and functionality. Thank you for your outstanding work!",
    author: "Victoria Ibezim",
    position: "Exec. Director",
    organization: "SFC",
  },
  {
    id: "6",
    quote:
      "I recently had the pleasure of working with Goloka on a State Open Contracting Research project and I must say, I am thoroughly impressed with their level of professionalism and expertise. The quality of their work exceeded my expectations and the final deliverables were exceptional.",
    author: "Andie Okon",
    position: "Program Manager",
    organization: "OCP",
  },
];
