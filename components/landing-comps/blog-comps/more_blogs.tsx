import React from "react";
import img from "@/public/assets/images/tasks/task1.png";
import img2 from "@/public/assets/images/tasks/task2.png";
import img3 from "@/public/assets/images/tasks/task3.png";
import BlogCard from "./BlogCard";

const MoreBlogs = () => {
  return (
    <section className="bg-[#3365E305] py-24">
      <div className="wrapper">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#333333]">
            Explore news from <span className="text-main-100">Goloka</span>
          </h2>
          <p className="text-[#434343]">
            See how businesses and organizations are using Goloka to collect
            data, insight and make smarter decisions. Check out our case studies
            to learn more.
          </p>
        </div>

        <div className="no-scrollbar overflow-x-auto">
          <div className="flex w-min gap-4">
            {blogs.map((item, index) => (
              <BlogCard key={index} data={item} className="w-[320px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreBlogs;

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
