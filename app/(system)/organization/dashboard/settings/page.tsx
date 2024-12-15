"use client";
import SettingsWeb from "@/components/settings-comp/tab-comps/desktop_settings";
import MobileSettings from "@/components/settings-comp/tab-comps/mobile_settings";

const SettingsPage = () => {
  return (
    <>
      {/* DESKTOP */}
      <SettingsWeb />
      {/* MOBILE */}
      <MobileSettings />
    </>
  );
};

export default SettingsPage;
