import Banner from "@/components/landing-comps/case-study-comps/banner";
import CaseStudies from "@/components/landing-comps/case-study-comps/case_studies";
import CaseStudyCta from "@/components/landing-comps/case-study-comps/cta";
import Reviews from "@/components/landing-comps/case-study-comps/reviews";
import React from "react";

const CaseStudy = () => {
  return (
    <>
      <Banner />
      <CaseStudies />
      <CaseStudyCta />
      <Reviews />
    </>
  );
};

export default CaseStudy;
