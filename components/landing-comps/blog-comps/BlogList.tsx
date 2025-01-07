import React from "react";
import img from "@/public/assets/images/tasks/task1.png";
import img2 from "@/public/assets/images/tasks/task2.png";
import img3 from "@/public/assets/images/tasks/task3.png";
import BlogCard from "./BlogCard";

const BlogList = () => {
  return (
    <div className="wrapper py-20">
      <div className="grid gap-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {blogs.map((blog, index) => (
          <BlogCard data={blog} key={index} />
        ))}
      </div>
    </div>
  );
};

export default BlogList;

const blogs: any[] = [
  {
    title:
      "African News Media in the Age of AI: Balancing Disruption and Development",
    image: img,
  },
  {
    title:
      "I and Nigeria's Civic Space: The Role of AI in Shaping Nigeria's Civic Space",
    image: img2,
  },
  {
    title: "US and China compete for influence in Africa's digital future",
    image: img3,
  },

  {
    title:
      "African News Media in the Age of AI: Balancing Disruption and Development",
    image: img,
  },
  {
    title:
      "I and Nigeria's Civic Space: The Role of AI in Shaping Nigeria's Civic Space",
    image: img2,
  },
  {
    title: "US and China compete for influence in Africa's digital future",
    image: img3,
  },
];
