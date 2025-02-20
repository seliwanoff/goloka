"use client";
import SettingsWeb from "@/components/settings-comp/tab-comps/desktop_settings";
import MobileSettings from "@/components/settings-comp/tab-comps/mobile_settings";
import SettingsWebOrganization from "@/components/settings-comp/tab-comps/org_desktop_settings";

const SettingsPage = () => {
  return (
    <>
      {/* DESKTOP */}
      <SettingsWebOrganization />
      {/* MOBILE */}
      <MobileSettings />
    </>
  );
};

export default SettingsPage;
