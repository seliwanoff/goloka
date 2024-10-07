import { ArrowLeft } from "iconsax-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import Notification from "@/components/settings-comp/tab-comps/notification";
import Payment from "@/components/settings-comp/tab-comps/payment";
import ChangePassword from "@/components/settings-comp/tab-comps/password";
import OtherPersonalInfo from "@/components/settings-comp/tab-comps/other_personal_info";
import PersonalInfo from "@/components/settings-comp/tab-comps/personal_info";
import Location from "@/components/settings-comp/tab-comps/location";

const MobileSettings = () => {
  const [tab, setTab] = useState<number>(-1);

  return (
    <div className="absolute left-0 top-0 min-h-svh w-full bg-[#F8F8F8] px-4 pt-24 md:hidden">
      {tab >= 0 ? (
        <div className="">
          <div className="absolute left-0 top-[70px] block h-[70px] w-[2000px] -translate-x-[2%] bg-white"></div>

          <div
            onClick={() => setTab(-1)}
            className="group relative z-20 inline-flex cursor-pointer items-center gap-2 pb-3.5 md:hidden"
          >
            <span>
              <ArrowLeft
                size={24}
                className="text-[#333333] group-hover:text-main-100"
              />
            </span>
            <p className="text-lg font-medium text-[#333333] group-hover:text-main-100">
              {settingTabs[tab]?.title}
            </p>
          </div>
          <div className="no-scrollbar mt-4 h-[80vh] overflow-y-auto rounded-2xl pb-28">
            <div className="min-h-min">
              {/* {tab} {typeof tab} */}
              {settingTabs[tab]?.label}
            </div>
          </div>
        </div>
      ) : (
        <Tabs
          defaultValue={"-1"}
          className="grid w-full gap-5 p-0 md:grid-cols-[1fr_2fr]"
        >
          <TabsList className="block h-auto space-y-4 bg-transparent p-0">
            {settingTabs?.map((tab: any, index: number) => (
              <TabsTrigger
                value={index.toString()}
                key={index}
                onClick={() => setTab(index)}
                className="flex h-[50px] w-full items-center justify-between rounded-full border border-[#E0E0E0] bg-[#F8F8F8] text-base font-medium text-[#071E3B] data-[state=active]:border-main-100 data-[state=active]:bg-[#3365E305] data-[state=active]:text-main-100"
              >
                {tab?.title}

                <span>
                  <ChevronRight color="#808080" size={20} />
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
    </div>
  );
};

export default MobileSettings;

const settingTabs = [
  {
    title: "Profile",
    value: "profile",
    label: <PersonalInfo />,
  },
  {
    title: "Password",
    value: "password",
    label: <ChangePassword />,
  },
  {
    title: "Location",
    value: "location",
    label: <Location />,
  },
  {
    title: "Payment",
    value: "payment",
    label: <Payment />,
  },
  {
    title: "Notification",
    value: "notification",
    label: <Notification />,
  },
];
