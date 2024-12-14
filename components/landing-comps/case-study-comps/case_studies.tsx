import React from "react";
import ProjectCard from "./project_card";
import { projects } from "@/utils";

const CaseStudies = () => {
  return (
    <section className="wrapper py-28">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((item, index) => (
          <ProjectCard key={index} data={item} />
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;

