import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supportTabs } from "@/utils";
import ContactTab from "./contact_tab";
import HelpTab from "./help_tab";
import ChatTab from "./chat_tab";
import ReportTab from "./report_tab";
import { usePathname, useRouter } from "next/navigation";

const DesktopSupport = () => {
  const [tab, setTab] = useState("contact");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.replace(`${pathname}?tab=${tab}`);
  }, [tab]);

  return (
    <section className="hidden pb-10 pt-[34px] md:block">
      <h1 className="mb-6 text-lg font-semibold text-[#333]">Support</h1>

      <Tabs
        defaultValue={tab}
        onValueChange={setTab}
        className="h-[80vh] w-full gap-5 md:grid md:grid-cols-[1fr_2fr]"
      >
        <TabsList className="block h-auto space-y-4 rounded-2xl bg-white p-4 lg:px-6 lg:py-8">
          {supportTabs?.map((tab: any, index: number) => (
            <TabsTrigger
              value={tab.value}
              key={index}
              className="flex h-[50px] w-full items-center justify-between rounded-full border border-[#E0E0E0] bg-[#F8F8F8] text-base font-medium text-[#071E3B] data-[state=active]:border-main-100 data-[state=active]:bg-[#3365E305] data-[state=active]:text-main-100"
            >
              {tab.label}

              <span>
                <ChevronRight color="#808080" size={20} />
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {supportTabContent.map((content: any, index: number) => (
          <TabsContent
            value={content.value}
            className={cn(
              "relative m-0 w-full overflow-hidden bg-transparent md:top-0",
            )}
            key={index}
          >
            {/* <div className="no-scrollbar w-full overflow-y-auto"> */}
            <div className="h-full rounded-2xl bg-white p-4 lg:px-6 lg:py-8">
              {content.label}
            </div>
            {/* </div> */}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default DesktopSupport;

const supportTabContent = [
  {
    title: "Contact Goloka",
    label: <ContactTab />,
    value: "contact",
  },
  {
    title: "Help center",
    label: <HelpTab />,
    value: "help",
  },
  // {
  //   title: "Chat with Goloka",
  //   label: <ChatTab />,
  //   value: "chat",
  // },
  {
    title: "Report an issue",
    label: <ReportTab />,
    value: "report",
  },
];
