"use client";
import CustomInput, { FormProps } from "@/components/lib/widgets/custom_inputs";
import DatePicker from "@/components/settings-comp/date_picker";
import PhoneInputField from "@/components/settings-comp/phone_input";
import CustomSelectField from "@/components/settings-comp/select_field";
import TextField from "@/components/settings-comp/text_field";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";

import { Control, Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";
import { Camera, Eye, EyeSlash } from "iconsax-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { myBeneficiaries } from "@/utils";
import { Switch } from "@/components/ui/switch";
import Notification from "@/components/settings-comp/tab-comps/notification";
import Payment from "@/components/settings-comp/tab-comps/payment";
import ChangePassword from "@/components/settings-comp/tab-comps/password";
import OtherPersonalInfo from "@/components/settings-comp/tab-comps/other_personal_info";
import PersonalInfo from "@/components/settings-comp/tab-comps/personal_info";
import Location from "@/components/settings-comp/tab-comps/location";

const SettingsPage = () => {
  return (
    <>
      {/* DESKTOP */}
      <SettingsWeb />

      {/* MOBILE */}
    </>
  );
};

export default SettingsPage;

type ComponentProps = {};
const SettingsWeb: React.FC<ComponentProps> = ({}) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <>
      <div className="mt-2.5">
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
