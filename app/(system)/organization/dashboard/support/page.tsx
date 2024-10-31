"use client";
import React from "react";
import MobileSupport from "@/components/support_comps/Mobile_support";
import DesktopSupport from "@/components/support_comps/DesktopSupport";

type PageProps = {};

const SupportPage: React.FC<PageProps> = ({}) => {
  return (
    <>
      {/* DESKTOP */}
      <DesktopSupport />

      {/* MOBILE */}
      <MobileSupport />
    </>
  );
};

export default SupportPage;
