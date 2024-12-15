import { ElementEqual } from "iconsax-react";
import Image from "next/image";
import React from "react";
import Pattern from "@/public/assets/pattern-bg.svg";

const BlogBanner = () => {
  return (
    <section className="relative h-auto overflow-hidden bg-[#3365E30A] pb-24 pt-28 xl:flex xl:h-[70vh] xl:items-center xl:pt-36">
      <Image
        src={Pattern}
        alt="BgPattern"
        className="absolute left-0 top-0 z-0 h-full w-full object-cover opacity-20"
      />
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto flex max-w-[375px] flex-col items-center text-center sm:max-w-md md:max-w-xl lg:max-w-4xl xl:justify-start">
          <div className="inline-flex items-center justify-center gap-3 rounded-full bg-[#EBF0FC] px-5 py-2 text-sm font-medium text-main-100">
            <span>
              <ElementEqual size="24" />
            </span>{" "}
            Blog
          </div>
          <h1 className="z-10 mb-4 mt-6 w-full text-[2rem] font-bold text-[#101828] sm:text-4xl sm:leading-tight md:text-5xl md:leading-snug">
            Data Insights Unleashed: Discovering the
            <span className="text-main-100"> Power of Information</span>
          </h1>
          <p className="text-center leading-normal text-[#434343] md:mx-auto md:max-w-2xl">
            Exploring the Vast Horizons of Data Analytics, Insights, and
            Innovation
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogBanner;
