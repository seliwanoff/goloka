import React from "react";
import { Button } from "@/components/ui/button";
import Pattern from "@/public/assets/pattern-bg.svg";
import Image from "next/image";
import Link from "next/link";

const BlogCta = () => {
  return (
    <section className="wrapper py-20">
      <div className="relative rounded-3xl bg-[radial-gradient(135.58%_135.58%_at_50%_35.83%,#3365E3_0%,#1C387D_100%)] px-4 py-10 md:py-16">
        <div className="relative z-10 mx-auto max-w-md text-center lg:max-w-2xl">
          <h2 className="text-2xl font-semibold text-white md:text-balance md:text-[2rem] md:leading-normal lg:text-5xl lg:leading-normal">
            Solve your business problems <br /> with accurate data
          </h2>
          <p className="mt-4 text-white lg:text-balance">
            We guarantee improved data accuracy and verification with Goloka’s
            cutting-edge geospatial <br /> technology. The in-built wallet
            system, ensures you can seamlessly manage your data <br />
            collection project. Everything is streamlined for your
            <br /> convenience, from the launch of your project to the payment
            of data collectors.
          </p>
          <Link href="/signin">
            <Button className="mt-6 h-auto w-full rounded-full bg-white py-3.5 text-main-100 hover:bg-white md:w-auto">
              Get started with Goloka
            </Button>
          </Link>
        </div>

        {/* Pattern */}
        <Image
          src={Pattern}
          alt="BgPattern"
          className="absolute left-0 top-0 z-[1] h-full w-full object-cover object-center opacity-20 brightness-0 invert filter"
        />
      </div>
    </section>
  );
};

export default BlogCta;
