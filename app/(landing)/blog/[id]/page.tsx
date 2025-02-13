

import BlogDetails from "@/components/landing-comps/blog-comps/blogDetails";
import { blogData } from "@/utils/blog";
import { notFound } from "next/navigation";


interface BlogPostPageProps {
  params: {
    id: string;
  };
}


export async function generateStaticParams() {
  return blogData.map((post) => ({
    id: post.id,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogData.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  return <BlogDetails post={post} />;
}


export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = blogData.find((p) => p.id === params.id);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}
