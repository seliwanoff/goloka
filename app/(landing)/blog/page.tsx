import BlogBanner from "@/components/landing-comps/blog-comps/BlogBanner";
import BlogCta from "@/components/landing-comps/blog-comps/BlogCta";
import BlogList from "@/components/landing-comps/blog-comps/BlogList";
import Reviews from "@/components/landing-comps/blog-comps/reviews";
import React from "react";

const BlogPage = () => {
  return (
    <>
      <BlogBanner />
      <BlogList />
      <BlogCta />
      <Reviews />
    </>
  );
};

export default BlogPage;
