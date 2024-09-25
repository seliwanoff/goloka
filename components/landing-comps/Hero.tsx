import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { CirclePlay } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Hero1 from "@/public/assets/hero-1.png";
import Hero2 from "@/public/assets/hero-2.png";
import Pattern from "@/public/assets/pattern-bg.svg";
import { ElementEqual } from "iconsax-react";

type ComponentProps = {};
const Hero: React.FC<ComponentProps> = () => {
  const router = useRouter();

  return (
    <section className="relative h-auto overflow-hidden xl:h-max xl:min-h-[80vh]">
      <div className="container relative z-10 mx-auto px-4 pt-28">
        <div className="mx-auto flex w-full flex-col items-center gap-6 text-center md:w-11/12 lg:w-full xl:justify-start">
          <div className="inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-4 py-3 text-sm font-medium text-main-100">
            <span>
              <ElementEqual size="24" />
            </span>{" "}
            The world of localized and organic data
          </div>
          <h1 className="z-10 w-full text-[2rem] font-semibold text-[#101828] md:text-4xl md:leading-normal xl:w-2/4">
            Empower Your Decisions with <br className="hidden md:block" />
            <span className="text-main-100">Quality Data Collection</span>
          </h1>
          <p className="text-center leading-normal text-[#434343] lg:mx-auto lg:w-[630px]">
            Our product provides real-time, highly-localised, spatial-enriched
            insights and analytics to empower businesses, governments, and
            third-sector organisations to make smarter decisions, increase
            revenue, and reduce losses
          </p>
          <div className="w-full">
            <Button
              onClick={() => router.push("/signin")}
              className="h-auto w-10/12 rounded-full bg-main-100 px-7 py-3.5 text-sm font-light text-white hover:bg-blue-700 md:w-auto"
            >
              Get access to Goloka free
            </Button>
          </div>
        </div>

        {/* -- image */}
        <div className="mt-10 w-full grid-cols-[1.5fr_1fr] gap-6 sm:mx-auto sm:grid sm:w-10/12">
          <div className="hidden sm:block md:col-span-2 lg:col-span-1">
            <AspectRatio ratio={30 / 12}>
              <Image
                src={Hero1}
                alt="hero-img"
                className="h-auto w-full max-w-full"
              />
            </AspectRatio>
          </div>
          {/* <AspectRatio ratio={30 / 12}> */}
          <Image
            src={Hero2}
            alt="hero-img"
            className="h-auto w-full max-w-full md:hidden lg:block"
          />
          {/* </AspectRatio> */}
        </div>
      </div>
      <Image
        src={Pattern}
        alt="BgPattern"
        className="absolute left-0 top-0 z-0 h-full w-full object-cover opacity-20"
      />
    </section>
  );
};

export default Hero;
