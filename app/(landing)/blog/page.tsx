// import BlogBanner from "@/components/landing-comps/blog-comps/BlogBanner";
// import BlogCta from "@/components/landing-comps/blog-comps/BlogCta";
// import BlogList from "@/components/landing-comps/blog-comps/BlogList";
// import Reviews from "@/components/landing-comps/blog-comps/reviews";
// import React from "react";

// const BlogPage = () => {
//   return (
//     <>
//       <BlogBanner />
//       <BlogList />
//       <BlogCta />
//       <Reviews />
//     </>
//   );
// };

// export default BlogPage;

import BlogCard from "@/components/landing-comps/blog-comps/BlogCard";
import BlogDetails from "@/components/landing-comps/blog-comps/blogDetails";
import { blogData } from "@/utils/blog";

export default function BlogPage() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogData.map((post) => (
        <BlogCard key={post.id} data={post} />
      ))}
    </div>
  );
}