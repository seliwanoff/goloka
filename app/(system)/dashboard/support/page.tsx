import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ChevronRight } from "lucide-react";
import ContactTab from "@/components/support_comps/contact_tab";
import HelpTab from "@/components/support_comps/help_tab";
import ChatTab from "@/components/support_comps/chat_tab";
import ReportTab from "@/components/support_comps/report_tab";

type PageProps = {};

const SupportPage: React.FC<PageProps> = ({}) => {
  return (
    <>
      <section className="pb-10 pt-[34px]">
        <h1 className="mb-6 text-2xl font-semibold text-[#333]">Support</h1>

        {/* <div className="md:grid">
          <div className="rounded-2xl bg-white p-4 lg:px-6 lg:py-8"></div>
          <div className="rounded-2xl bg-white p-4 lg:px-6 lg:py-8"></div>
        </div> */}

        <Tabs
          defaultValue="contact"
          className="grid h-[80vh] w-full grid-cols-[1fr_2fr] gap-5"
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
              className="relative m-0 overflow-hidden"
              key={index}
            >
              <div className="h-full rounded-2xl bg-white p-4 lg:px-6 lg:py-8">
                {content.label}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </>
  );
};

export default SupportPage;

const supportTabContent = [
  {
    label: <ContactTab />,
    value: "contact",
  },
  {
    label: <HelpTab />,
    value: "help",
  },
  {
    label: <ChatTab />,
    value: "chat",
  },
  {
    label: <ReportTab />,
    value: "report",
  },
];

const supportTabs = [
  {
    label: "Contact Goloka",
    value: "contact",
  },
  {
    label: "Help center",
    value: "help",
  },
  {
    label: "Chat with Goloka",
    value: "chat",
  },
  {
    label: "Report an issue",
    value: "report",
  },
];
