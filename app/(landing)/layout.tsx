import React from "react";
import LandingNavbar from "@/components/lib/navigation/landing_navbar";
import Footer from "@/components/landing-comps/footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Landinglayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative w-full">
      <LandingNavbar />
      {children}
      <Footer />
    </div>
  );
};

export default Landinglayout;
