import React from "react";
import ProjectCard from "./project_card";
import { projects } from "@/utils";

const MoreCaseStudies = () => {
  return (
    <section className="bg-[#3365E305] py-24">
      <div className="wrapper">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#333333]">
            Explore more case studies
          </h2>
          <p className="text-[#434343]">
            See how businesses and organizations are using Goloka to collect
            data, insight and make smarter decisions. Check out our case studies
            to learn more.
          </p>
        </div>

        <div className="no-scrollbar overflow-x-auto">
          <div className="flex w-min gap-4">
            {projects.map((item, index) => (
              <ProjectCard key={index} data={item} className="w-[320px]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreCaseStudies;
