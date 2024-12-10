"use client";
import FGPOTP from "@/components/auth-comps/fgpOtp";
import SettingsWeb from "@/components/settings-comp/tab-comps/desktop_settings";
import MobileSettings from "@/components/settings-comp/tab-comps/mobile_settings";
import { useShowPasswordOtp } from "@/stores/misc";
import { useState } from "react";

const SettingsPage = () => {



  return (
    <>
      {/* DESKTOP */}
      <SettingsWeb />
      <FGPOTP  />
      {/* MOBILE */}
      <MobileSettings />
    </>
  );
};

export default SettingsPage;
