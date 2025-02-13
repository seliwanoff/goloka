// components/BlogDetails.tsx
import Image from "next/image";
import React from "react";

import MoreBlogs from "@/components/landing-comps/blog-comps/more_blogs";
import BlogCta from "@/components/landing-comps/blog-comps/BlogCta";
import { BlogPost } from "@/utils/blog";
import BackToHomeButton from "./customBlogButton";

interface BlogDetailsProps {
  post: BlogPost;
}

const BlogDetails = ({ post }: BlogDetailsProps) => {
  return (
    <>
      <BackToHomeButton />
      <div className="wrapper mx-auto max-w-5xl pb-16 pt-28">
        <div className="">
          <p className="inline-flex items-center gap-4 text-[#4f4f4f]">
            March 31st, 2024{" "}
            <span className="inline-block h-2 w-2 rounded-full bg-[#D9D9D9]" />{" "}
            {post.readTime} mins read
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold leading-snug text-[#071E3B] md:text-3xl md:leading-snug">
            {post.title}
          </h1>
          <p className="mt-3 text-[#4f4f4f]">By Muhammad Jamiu</p>
        </div>

        <div className="mt-10">
          <Image
            src={post.image}
            alt={post.title}
            width={500}
            height={500}
            className="h-[300px] w-full rounded-2xl object-cover object-center md:h-[400px]"
          />

          <div className="mt-16">
            {/* Introduction */}
            <p className="leading-relaxed text-black">
              {post.content.introduction.overview}
            </p>
            <br />
            <br />

            {/* Client Information */}
            <h3 className="mb-3 text-2xl font-semibold text-black">
              About the Client
            </h3>
            <p className="leading-relaxed text-black">
              {post.content.introduction.client}
            </p>
            <br />
            <br />

            {/* Context if available */}
            {post.content.context && (
              <>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  Context
                </h3>
                <p className="leading-relaxed text-black">
                  {post.content.context}
                </p>
                <br />
                <br />
              </>
            )}

            {/* Objectives if available */}
            {post.content.objectives && (
              <>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  Key Objectives
                </h3>
                <ul className="list-inside list-disc space-y-2">
                  {post.content.objectives.map((objective, index) => (
                    <li key={index} className="leading-relaxed text-black">
                      {objective}
                    </li>
                  ))}
                </ul>
                <br />
                <br />
              </>
            )}

            {/* Sections */}
            {post.content.sections.map((section, index) => (
              <React.Fragment key={index}>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  {section.title}
                </h3>
                <p className="leading-relaxed text-black">{section.content}</p>
                {index !== post.content.sections.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* <MoreBlogs /> */}
      <BlogCta />
    </>
  );
};

export default BlogDetails;
