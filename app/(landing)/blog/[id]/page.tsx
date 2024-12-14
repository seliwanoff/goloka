import Image from "next/image";
import React from "react";
import Img2 from "@/public/assets/images/tasks/task1.png";
import MoreBlogs from "@/components/landing-comps/blog-comps/more_blogs";
import BlogCta from "@/components/landing-comps/blog-comps/BlogCta";

const BlogDetails = () => {
  return (
    <>
      <div className="wrapper mx-auto max-w-5xl pb-16 pt-28">
        <div className="">
          <p className="inline-flex items-center gap-4 text-[#4f4f4f]">
            May 31st, 2024{" "}
            <span className="inline-block h-2 w-2 rounded-full bg-[#D9D9D9]" />{" "}
            5 mins read
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold leading-snug text-[#071E3B] md:text-3xl md:leading-snug">
            African News Media in the Age of AI: Balancing Disruption and
            Development
          </h1>
          <p className="mt-3 text-[#4f4f4f]">By Muhammed Jamiu</p>
        </div>

        <div className="mt-10">
          <Image
            src={Img2}
            alt=""
            width={500}
            height={500}
            className="h-[300px] w-full rounded-2xl object-cover object-center md:h-[400px]"
          />

          <div className="mt-16">
            <p className="leading-relaxed text-black">
              In today&apos;s rapidly evolving technological landscape, one term
              seems to dominate discussions and headlines alike: Artificial
              Intelligence (AI). From the humble beginnings of chatbots and
              recommendation algorithms to the sophisticated neural networks
              powering autonomous vehicles and medical diagnostics, AI has
              undoubtedly become a driving force behind innovation and progress
              in our society. But what exactly is AI, and how is it impacting
              our everyday lives? In this blog, we&apos;ll explore the rise of
              artificial intelligence technology and its profound implications
              for various aspects of our daily routines.
            </p>
            <br />
            <br />

            <h3 className="mb-3 text-2xl font-semibold text-black">
              Understanding Artificial Intelligence:
            </h3>
            <p className="leading-relaxed text-black">
              At its core, artificial intelligence refers to the simulation of
              human intelligence processes by machines, particularly computer
              systems. This encompasses a wide range of capabilities, including
              learning, reasoning, problem-solving, perception, and language
              understanding. AI systems are designed to analyze vast amounts of
              data, recognize patterns, and make predictions or decisions based
              on that data.
            </p>
          </div>
        </div>
      </div>

      <MoreBlogs />
      <BlogCta />
    </>
  );
};

export default BlogDetails;
