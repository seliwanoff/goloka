import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Notification from "@/components/settings-comp/tab-comps/notification";
import Payment from "@/components/settings-comp/tab-comps/payment";
import ChangePassword from "@/components/settings-comp/tab-comps/password";
import PersonalInfo from "@/components/settings-comp/tab-comps/personal_info";
import Location from "@/components/settings-comp/tab-comps/location";

type ComponentProps = {};
const SettingsWeb: React.FC<ComponentProps> = ({}) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>
      <div className="mt-2.5 hidden md:block">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="relative w-full bg-transparent"
        >
          <div className="absolute left-0 top-0 block h-[50px] w-[2000px] -translate-x-[2%] bg-white"></div>

          <TabsList className="relative mb-8 flex h-auto items-center justify-start gap-6 bg-transparent">
            {settingTabs?.map((tab: any, index: number) => (
              <TabsTrigger
                value={tab.value}
                key={index}
                className="flex items-center justify-between rounded-none border-b-2 border-transparent pb-4 pt-2.5 text-sm font-light text-[#828282] data-[state=active]:border-main-100 data-[state=active]:bg-transparent data-[state=active]:text-main-100 data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {settingTabs?.map((tab: any, index: number) => (
            <TabsContent value={tab?.value} key={index}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </>
  );
};

export default SettingsWeb;

const settingTabs = [
  { label: "Profile", value: "profile", content: <PersonalInfo /> },
  {
    label: "Password",
    value: "password",
    content: <ChangePassword />,
  },
  { label: "Location", value: "location", content: <Location /> },
  {
    label: "Payment",
    value: "payment",
    content: <Payment />,
  },
  { label: "Notification", value: "notification", content: <Notification /> },
];
