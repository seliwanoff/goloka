// components/BlogCard.tsx
import { cn } from "@/lib/utils";
import { BlogPost } from "@/utils/blog";
import Image from "next/image";
import Link from "next/link";
import React from "react";


interface BlogCardProps {
  data: BlogPost;
  className?: string;
}

const BlogCard = ({ data, className }: BlogCardProps) => {
  return (
    <div className={cn(className)}>
      <Image
        src={data.image}
        width={500}
        height={500}
        className="h-[250px] w-full rounded-[12px] object-cover object-center"
        alt={data.title}
      />

      <div className="mt-4">
        <p className="inline-flex items-center gap-3 text-[#4f4f4f]">
          May 31st, 2024{" "}
          <span className="inline-block h-2 w-2 rounded-full bg-[#D9D9D9]" />{" "}
          {data.readTime} mins read
        </p>
        <Link
          href={`/blog/${data.id}`}
          className="my-3.5 block text-lg font-semibold leading-snug tracking-wide text-black"
        >
          {data.title}
        </Link>
        <p className="text-sm font-semibold text-[#9A9A9A]">Muhammad Jamiu</p>
      </div>
    </div>
  );
};

export default BlogCard;
